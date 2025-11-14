//internal/services/password_reset_service.go
package services

import (
	"crypto/rand"
	"errors"
	"fmt"
	"math/big"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"
	"server/internal/dto"
	"server/internal/models"
	"server/pkgs/security"
)

type PasswordResetService struct {
	db            *gorm.DB
	argon2Service *security.Argon2Service
}

func NewPasswordResetService(db *gorm.DB, argon2Service *security.Argon2Service) *PasswordResetService {
	return &PasswordResetService{
		db:            db,
		argon2Service: argon2Service,
	}
}

var ErrUserNotFound = errors.New("no existe una cuenta para el correo ingresado")

type UserService struct {
	db *gorm.DB
}

func NewUserService(db *gorm.DB) *UserService {
	return &UserService{db: db}
}

func (s *UserService) CheckUserExists(email string) (*models.User, error) {
	var user models.User
	
	if err := s.db.Where("email = ? AND is_active = ?", email, true).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}
	
	return &models.User{
		ID:    user.ID,
		Email: user.Email,
		Name:  user.Name,
	}, nil
}

func (s *PasswordResetService) RequestPasswordReset(req dto.PasswordResetRequestDTO) (map[string]interface{}, error) {
	var user models.User
	if err := s.db.Where("email = ? AND is_active = ?", req.Email, true).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, errors.New("no existe una cuenta para el correo ingresado")
		}
		return nil, err
	}

	var lastToken models.PasswordResetToken
	if err := s.db.Where("email = ?", req.Email).Order("created_at DESC").First(&lastToken).Error; err == nil {
		if lastToken.LastSentAt != nil {
			timeSince := time.Now().Unix() - *lastToken.LastSentAt
			if timeSince < 60 {
				return nil, errors.New("debes esperar antes de solicitar un nuevo código")
			}
		}
	}

	s.db.Where("user_id = ?", user.ID).Delete(&models.PasswordResetToken{})

	code := generateCode(6)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userId": user.ID,
		"email":  user.Email,
		"type":   "password_reset_initial",
		"exp":    time.Now().Add(15 * time.Minute).Unix(),
	})

	jwtSecret := []byte(os.Getenv("JWT_SECRET"))
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return nil, err
	}

	expires := time.Now().Add(15 * time.Minute)
	lastSentAt := time.Now().Unix()
	resetToken := models.PasswordResetToken{
		UserID:     user.ID,
		Email:      user.Email,
		Code:       code,
		Token:      tokenString,
		Expires:    expires,
		LastSentAt: &lastSentAt,
	}

	if err := s.db.Create(&resetToken).Error; err != nil {
		return nil, err
	}

	return map[string]interface{}{
		"code":    code,
		"token":   tokenString,
		"expires": expires,
		"userId":  user.ID,
		"name":    user.Name,
	}, nil
}

func (s *PasswordResetService) ValidateResetCode(req dto.ValidateCodeDTO) (map[string]interface{}, error) {
	var resetToken models.PasswordResetToken
	if err := s.db.Where("email = ? AND code = ? AND expires > ? AND is_used = ?",
		req.Email, req.Code, time.Now(), false).
		Order("created_at DESC").First(&resetToken).Error; err != nil {
		return nil, errors.New("código inválido, ya utilizado o expirado")
	}

	jwtSecret := []byte(os.Getenv("JWT_SECRET"))
	_, err := jwt.Parse(resetToken.Token, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})
	if err != nil {
		return nil, errors.New("token inválido o expirado")
	}

	newToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userId": resetToken.UserID,
		"email":  resetToken.Email,
		"type":   "password_reset_final",
		"exp":    time.Now().Add(30 * time.Minute).Unix(),
	})

	newTokenString, err := newToken.SignedString(jwtSecret)
	if err != nil {
		return nil, err
	}

	s.db.Model(&resetToken).Update("is_validated", true)
	s.db.Model(&models.PasswordResetToken{}).
		Where("user_id = ? AND id != ?", resetToken.UserID, resetToken.ID).
		Update("expires", time.Unix(0, 0))

	return map[string]interface{}{
		"success": true,
		"email":   resetToken.Email,
		"token":   newTokenString,
	}, nil
}

func (s *PasswordResetService) ResetPassword(req dto.ResetPasswordDTO) error {
	jwtSecret := []byte(os.Getenv("JWT_SECRET"))
	token, err := jwt.Parse(req.Token, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		return errors.New("token inválido o expirado")
	}

	claims := token.Claims.(jwt.MapClaims)
	if claims["type"] != "password_reset_final" || claims["email"] != req.Email {
		return errors.New("token no válido")
	}

	userID, ok := claims["userId"].(string)
	if !ok {
		return errors.New("token no contiene un ID de usuario válido")
	}

	var resetToken models.PasswordResetToken
	if err := s.db.Where("user_id = ? AND email = ? AND is_validated = ? AND is_used = ? AND expires > ?",
		userID, req.Email, true, false, time.Now()).
		First(&resetToken).Error; err != nil {
		return errors.New("token no validado, ya utilizado o expirado")
	}

	hashedStr, err := s.argon2Service.HashPassword(req.NewPassword)
	if err != nil {
		return fmt.Errorf("error al hashear la contraseña: %w", err)
	}

	if err := s.db.Model(&models.User{}).Where("email = ?", req.Email).
		Update("password", hashedStr).Error; err != nil {
		return err
	}

	now := time.Now()
	s.db.Model(&resetToken).Updates(map[string]interface{}{
		"is_used": true,
		"used_at": now,
	})

	return nil
}

func generateCode(length int) string {
	const digits = "0123456789"
	code := make([]byte, length)
	for i := range code {
		num, _ := rand.Int(rand.Reader, big.NewInt(int64(len(digits))))
		code[i] = digits[num.Int64()]
	}
	return string(code)
}

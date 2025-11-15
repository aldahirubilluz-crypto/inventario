// server/internal/services/fn_auth_signup.go
package services

import (
	"crypto/rand"
	"errors"
	"math/big"
	"server/internal/dto"
	"server/internal/models"
	"server/pkgs/security"
	"time"

	"gorm.io/gorm"
)

func (s *authServiceImpl) Signup(req dto.SignupRequest) (*dto.AuthResponse, error) {
	if req.Email == "" {
		return nil, ErrSignupEmailRequired
	}
	if !emailRx.MatchString(req.Email) {
		return nil, ErrSignupEmailInvalid
	}
	if req.Provider == "google" {
		return nil, ErrGoogleSignupNotAllowed
	}

	var existing models.User
	if err := s.db.Where("email = ?", req.Email).First(&existing).Error; err == nil {
		return nil, ErrSignupEmailTaken
	}

	if req.Password == "" {
		return nil, ErrSignupPasswordOrProviderNeeded
	}

	hashed, err := s.argon.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	now := time.Now()
	user := models.User{
		Email:         req.Email,
		Name:          req.Name,
		Image:         req.Image,
		Rol:           models.RolEmployee,
		IsActive:      true,
		Password:      &hashed,
		EmailVerified: &now,
		CreatedAt:     now,
		UpdatedAt:     now,
	}

	if err := s.db.Create(&user).Error; err != nil {
		return nil, err
	}

	return s.buildAuthResponse(&user), nil
}

type UserManagementService struct {
	db            *gorm.DB
	argon2Service *security.Argon2Service
}

func NewUserManagementService(db *gorm.DB, argon2Service *security.Argon2Service) *UserManagementService {
	return &UserManagementService{db: db, argon2Service: argon2Service}
}

var (
	ErrCreateUserEmailRequired      = errors.New("email is required")
	ErrCreateUserEmailInvalid       = errors.New("email is invalid")
	ErrCreateUserEmailTaken         = errors.New("el correo ya está registrado")
	ErrCreateUserRoleInvalid        = errors.New("role must be MANAGER or EMPLOYEE")
	ErrCreateUserOfficeRequired     = errors.New("office is required")
	ErrManagerCanOnlyCreateEmployee = errors.New("manager can only create employees")
)

func generateRandomPassword(length int) (string, error) {
	const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
	password := make([]byte, length)
	for i := range password {
		num, err := rand.Int(rand.Reader, big.NewInt(int64(len(chars))))
		if err != nil {
			return "", err
		}
		password[i] = chars[num.Int64()]
	}
	return string(password), nil
}

func (s *UserManagementService) CreateUser(req dto.CreateUserRequest, createdByID string) (*dto.CreateUserResponse, error) {
	if req.Email == "" {
		return nil, ErrCreateUserEmailRequired
	}
	if !emailRx.MatchString(req.Email) {
		return nil, ErrCreateUserEmailInvalid
	}
	if req.Role != "MANAGER" && req.Role != "EMPLOYEE" {
		return nil, ErrCreateUserRoleInvalid
	}
	if req.Office == nil || *req.Office == "" {
		return nil, ErrCreateUserOfficeRequired
	}

	var creator models.User
	if err := s.db.Where("id = ?", createdByID).First(&creator).Error; err != nil {
		return nil, errors.New("usuario creador no encontrado")
	}

	if creator.Rol == models.RolManager && req.Role != "EMPLOYEE" {
		return nil, ErrManagerCanOnlyCreateEmployee
	}

	var existingUser models.User
	if err := s.db.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
		return nil, ErrCreateUserEmailTaken
	}

	randomPassword, err := generateRandomPassword(12)
	if err != nil {
		return nil, errors.New("error al generar contraseña")
	}

	hashedPassword, err := s.argon2Service.HashPassword(randomPassword)
	if err != nil {
		return nil, errors.New("error al hashear la contraseña")
	}

	now := time.Now()
	office := models.Office(*req.Office)

	user := models.User{
		Name:          req.Name,
		Email:         req.Email,
		Password:      &hashedPassword,
		Rol:           models.Rol(req.Role),
		Office:        &office,
		Phone:         req.Phone,
		IsActive:      true,
		EmailVerified: &now,
		CreatedByID:   &createdByID,
		CreatedAt:     now,
		UpdatedAt:     now,
	}

	if err := s.db.Create(&user).Error; err != nil {
		return nil, err
	}

	officeStr := string(*user.Office)

	return &dto.CreateUserResponse{
		ID:                user.ID,
		Name:              user.Name,
		Email:             user.Email,
		Role:              string(user.Rol),
		Office:            &officeStr,
		Phone:             user.Phone,
		GeneratedPassword: &randomPassword,
	}, nil
}

// server/internal/services/fn_auth.go
package services

import (
	"errors"
	"regexp"
	"server/internal/dto"
	"server/internal/models"
	"server/pkgs/security"
	"time"

	"gorm.io/gorm"
)

type AuthService interface {
	Signin(req dto.SigninRequest) (*dto.AuthResponse, error)
	Signup(req dto.SignupRequest) (*dto.AuthResponse, error)
}

type authServiceImpl struct {
	db    *gorm.DB
	argon *security.Argon2Service
}

func NewAuthService(db *gorm.DB, argon *security.Argon2Service) AuthService {
	return &authServiceImpl{
		db:    db,
		argon: argon,
	}
}

// ===== Errores predefinidos =====
var (
	ErrSigninEmailRequired    = errors.New("email is required")
	ErrSigninPasswordRequired = errors.New("password is required")
	ErrSigninEmailInvalid     = errors.New("email is invalid")
	ErrInvalidCredentials     = errors.New("invalid credentials")
	ErrUserNotFound           = errors.New("user not found")
	ErrUserInactive           = errors.New("user is inactive")
	ErrInvalidLoginMethod     = errors.New("invalid login method, use OAuth provider")

	ErrSignupEmailRequired            = errors.New("email is required")
	ErrSignupEmailInvalid             = errors.New("email is invalid")
	ErrSignupPasswordOrProviderNeeded = errors.New("password or provider is required")
	ErrSignupProviderInvalid          = errors.New("provider is invalid")
	ErrSignupEmailTaken               = errors.New("email is already in use")
)

var emailRxSignin = regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]+$`)

// ===== Signin =====
func (s *authServiceImpl) Signin(req dto.SigninRequest) (*dto.AuthResponse, error) {
	// Validaciones básicas
	if req.Email == "" {
		return nil, ErrSigninEmailRequired
	}
	if !emailRxSignin.MatchString(req.Email) {
		return nil, ErrSigninEmailInvalid
	}

	// Buscar usuario
	var user models.User
	if err := s.db.Where("email = ?", req.Email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}

	// Verificar si está activo
	if !user.IsActive {
		return nil, ErrUserInactive
	}

	// Si es login con Google
	if req.Provider == "google" {
		now := time.Now()
		user.LastLogin = &now
		s.db.Save(&user)

		return &dto.AuthResponse{
			ID:    user.ID,
			Email: user.Email,
			Name:  user.Name,
			Image: user.Image,
			Role:  string(user.Rol),
		}, nil
	}

	// Login con credenciales
	if req.Password == "" {
		return nil, ErrSigninPasswordRequired
	}

	if user.Password == nil || *user.Password == "" {
		return nil, ErrInvalidLoginMethod
	}

	// Verificar contraseña con Argon2
	if err := s.argon.ComparePassword(*user.Password, req.Password); err != nil {
		return nil, ErrInvalidCredentials
	}

	// Actualizar último login
	now := time.Now()
	user.LastLogin = &now
	s.db.Save(&user)

	return &dto.AuthResponse{
		ID:    user.ID,
		Email: user.Email,
		Name:  user.Name,
		Image: user.Image,
		Role:  string(user.Rol),
	}, nil
}

// ===== Signup =====
func (s *authServiceImpl) Signup(req dto.SignupRequest) (*dto.AuthResponse, error) {
	// Validaciones
	if req.Email == "" {
		return nil, ErrSignupEmailRequired
	}
	if !emailRxSignin.MatchString(req.Email) {
		return nil, ErrSignupEmailInvalid
	}

	// Verificar que no exista
	var existingUser models.User
	if err := s.db.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
		return nil, ErrSignupEmailTaken
	}

	// Crear usuario
	now := time.Now()
	user := models.User{
		Email:         req.Email,
		Name:          req.Name,
		Image:         req.Image,
		Rol:           models.RolObserver, // ✅ Usar constante correcta
		IsActive:      true,
		EmailVerified: &now,
		CreatedAt:     now,
		UpdatedAt:     now,
	}

	// Google vs Credenciales
	if req.Provider == "google" {
		user.Password = nil
	} else {
		if req.Password == "" {
			return nil, ErrSignupPasswordOrProviderNeeded
		}
		hashedPassword, err := s.argon.HashPassword(req.Password)
		if err != nil {
			return nil, err
		}
		user.Password = &hashedPassword
	}

	// Guardar
	if err := s.db.Create(&user).Error; err != nil {
		return nil, err
	}

	return &dto.AuthResponse{
		ID:    user.ID,
		Email: user.Email,
		Name:  user.Name,
		Image: user.Image,
		Role:  string(user.Rol),
	}, nil
}
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

var (
	ErrSigninEmailRequired    = errors.New("email is required")
	ErrSigninPasswordRequired = errors.New("password is required")
	ErrSigninEmailInvalid     = errors.New("email is invalid")
	ErrInvalidCredentials     = errors.New("invalid credentials")
	ErrUserInactive           = errors.New("user is inactive")
	ErrInvalidLoginMethod     = errors.New("invalid login method, use OAuth provider")
	// Nuevo error para que el handler lo mapee a 403
	ErrGoogleUserNotRegistered = errors.New("google user not registered")

	ErrSignupEmailRequired            = errors.New("email is required")
	ErrSignupEmailInvalid             = errors.New("email is invalid")
	ErrSignupPasswordOrProviderNeeded = errors.New("password or provider is required")
	ErrSignupProviderInvalid          = errors.New("provider is invalid")
	ErrSignupEmailTaken               = errors.New("email is already in use")
	ErrGoogleSignupNotAllowed         = errors.New("google signup is not allowed, user must be created by admin")
)

var emailRxSignin = regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]+$`)

func (s *authServiceImpl) Signin(req dto.SigninRequest) (*dto.AuthResponse, error) {
	if req.Email == "" {
		return nil, ErrSigninEmailRequired
	}
	if !emailRxSignin.MatchString(req.Email) {
		return nil, ErrSigninEmailInvalid
	}

	if req.Provider == "google" {
		var user models.User
		if err := s.db.Where("email = ?", req.Email).First(&user).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				// Usamos el error específico para que el handler devuelva 403
				return nil, ErrGoogleUserNotRegistered
			}
			return nil, err
		}

		if !user.IsActive {
			return nil, errors.New("user inactive")
		}

		user.LastLogin = ptrTimeNow()
		s.db.Save(&user)

		return s.buildAuthResponse(&user), nil
	}

	if req.Password == "" {
		return nil, ErrSigninPasswordRequired
	}

	var user models.User
	if err := s.db.Where("email = ?", req.Email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}

	if !user.IsActive {
		return nil, ErrUserInactive
	}

	if user.Password == nil || *user.Password == "" {
		return nil, ErrInvalidLoginMethod
	}

	if err := s.argon.ComparePassword(*user.Password, req.Password); err != nil {
		return nil, ErrInvalidCredentials
	}

	user.LastLogin = ptrTimeNow()
	s.db.Save(&user)

	return s.buildAuthResponse(&user), nil
}

func (s *authServiceImpl) Signup(req dto.SignupRequest) (*dto.AuthResponse, error) {
	if req.Email == "" {
		return nil, ErrSignupEmailRequired
	}
	if !emailRxSignin.MatchString(req.Email) {
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

func (s *authServiceImpl) buildAuthResponse(u *models.User) *dto.AuthResponse {
	var office *string
	if u.Office != nil {
		str := string(*u.Office)
		office = &str
	}
	return &dto.AuthResponse{
		ID:     u.ID,
		Email:  u.Email,
		Name:   u.Name,
		Image:  u.Image,
		Role:   string(u.Rol),
		Office: office,
	}
}

func ptrTimeNow() *time.Time {
	now := time.Now()
	return &now
}

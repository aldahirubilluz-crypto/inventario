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

var (
	ErrSigninEmailRequired    = errors.New("email is required")
	ErrSigninPasswordRequired = errors.New("password is required")
	ErrSigninEmailInvalid     = errors.New("email is invalid")
	ErrInvalidCredentials     = errors.New("invalid credentials")
	ErrUserInactive           = errors.New("user is inactive")
	ErrInvalidLoginMethod     = errors.New("invalid login method, use OAuth provider")
	ErrGoogleUserNotRegistered = errors.New("google user not registered")

	ErrSignupEmailRequired            = errors.New("email is required")
	ErrSignupEmailInvalid             = errors.New("email is invalid")
	ErrSignupPasswordOrProviderNeeded = errors.New("password or provider is required")
	ErrSignupProviderInvalid          = errors.New("provider is invalid")
	ErrSignupEmailTaken               = errors.New("email is already in use")
	ErrGoogleSignupNotAllowed         = errors.New("google signup is not allowed, user must be created by admin")
)

var emailRx = regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]+$`)

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
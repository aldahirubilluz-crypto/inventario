// server/internal/services/fn_auth_signin.go
package services

import (
	"errors"
	"server/internal/dto"
	"server/internal/models"

	"gorm.io/gorm"
)

func (s *authServiceImpl) Signin(req dto.SigninRequest) (*dto.AuthResponse, error) {
	if req.Email == "" {
		return nil, ErrSigninEmailRequired
	}
	if !emailRx.MatchString(req.Email) {
		return nil, ErrSigninEmailInvalid
	}

	if req.Provider == "google" {
		var user models.User
		if err := s.db.Where("email = ?", req.Email).First(&user).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
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
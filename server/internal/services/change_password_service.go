// server/internal/services/change_password_service.go
package services

import (
	"errors"
	"gorm.io/gorm"
	"server/internal/models"
	"server/pkgs/security"
)

type ChangePasswordService struct {
	db            *gorm.DB
	argon2Service *security.Argon2Service
}

func NewChangePasswordService(db *gorm.DB, argon2Service *security.Argon2Service) *ChangePasswordService {
	return &ChangePasswordService{db: db, argon2Service: argon2Service}
}

func (s *ChangePasswordService) UpdatePasswordWithVerification(userID string, currentPassword string, newPassword string) error {
	var user models.User

	if err := s.db.Where("id = ? AND is_active = ?", userID, true).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("usuario no encontrado o inactivo")
		}
		return err
	}

	if user.Password == nil || *user.Password == "" {
		return errors.New("usuario no tiene contraseña configurada")
	}

	if err := s.argon2Service.ComparePassword(*user.Password, currentPassword); err != nil {
		return errors.New("la contraseña actual es incorrecta")
	}

	hashedPassword, err := s.argon2Service.HashPassword(newPassword)
	if err != nil {
		return errors.New("error al hashear la nueva contraseña")
	}

	if err := s.db.Model(&user).Update("password", hashedPassword).Error; err != nil {
		return err
	}

	return nil
}

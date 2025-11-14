//server/internal/dto/change_password.go
package dto

type UpdatePasswordByIDDTO struct {
	UserID      string `json:"userId" validate:"required"`
	Password    string `json:"password" validate:"required"`
	NewPassword string `json:"newPassword" validate:"required,min=8"`
}

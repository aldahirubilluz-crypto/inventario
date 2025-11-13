// internal/dto/password_reset.go
package dto

type PasswordResetRequestDTO struct {
	Email string `json:"email" validate:"required,email"`
}

type ValidateCodeDTO struct {
	Email string `json:"email" validate:"required,email"`
	Code  string `json:"code" validate:"required,len=6"`
}

type ResetPasswordDTO struct {
	Email       string `json:"email" validate:"required,email"`
	Token       string `json:"token" validate:"required"`
	NewPassword string `json:"newPassword" validate:"required,min=8"`
}
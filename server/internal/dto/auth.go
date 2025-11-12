//server/internal/dto/auth.go
package dto

type SigninRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Provider string `json:"provider"` // ✅ Agregar este campo
}

type SignupRequest struct {
	Email    string  `json:"email"`
	Name     *string `json:"name"`
	Image    *string `json:"image"`
	Password string  `json:"password"`
	Provider string  `json:"provider"` // ✅ Agregar este campo
}

type AuthResponse struct {
	ID    string  `json:"id"`
	Email string  `json:"email"`
	Name  *string `json:"name"`
	Image *string `json:"image"`
	Role  string  `json:"role"`
}
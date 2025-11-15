// server/internal/dto/auth.go
package dto

type SigninRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Provider string `json:"provider"`
}

type SignupRequest struct {
	Email    string  `json:"email"`
	Name     *string `json:"name"`
	Image    *string `json:"image"`
	Password string  `json:"password"`
	Provider string  `json:"provider"`
}

type AuthResponse struct {
	ID     string  `json:"id"`
	Email  string  `json:"email"`
	Name   *string `json:"name"`
	Image  *string `json:"image"`
	Role   string  `json:"role"`
	Office *string `json:"office"`
}

type CreateUserRequest struct {
	Name   *string `json:"name"`
	Email  string  `json:"email" validate:"required,email"`
	Role   string  `json:"role" validate:"required,oneof=MANAGER EMPLOYEE"`
	Office *string `json:"office" validate:"required"`
	Phone  *string `json:"phone"`
}

type CreateUserResponse struct {
	ID                string  `json:"id"`
	Name              *string `json:"name"`
	Email             string  `json:"email"`
	Role              string  `json:"role"`
	Office            *string `json:"office"`
	Phone             *string `json:"phone"`
	GeneratedPassword *string `json:"generatedPassword"`
}

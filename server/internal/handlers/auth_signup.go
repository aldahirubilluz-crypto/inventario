// server/internal/handlers/auth_signup.go
package handlers

import (
	"github.com/gofiber/fiber/v3"
	"server/internal/dto"
	"server/internal/services"
	"server/pkgs/logger"
)

func (h *AuthHandler) Signup(c fiber.Ctx) (interface{}, string, error) {
	logger.Log.Info("📥 Signup request received")

	var req dto.SignupRequest
	if err := c.Bind().JSON(&req); err != nil {
		return nil, "Invalid request body", fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}

	user, err := h.authService.Signup(req)
	if err != nil {
		logger.Log.Errorf("❌ Signup failed: %v", err)

		if err == services.ErrSignupEmailTaken {
			return nil, err.Error(), fiber.NewError(fiber.StatusConflict, err.Error())
		}
		if err == services.ErrGoogleSignupNotAllowed {
			return nil, err.Error(), fiber.NewError(fiber.StatusForbidden, err.Error())
		}

		return nil, err.Error(), fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	logger.Log.Infof("✅ Signup successful for %s", req.Email)
	return user, "Signup successful", nil
}

type UserManagementHandler struct {
	userManagementService *services.UserManagementService
}

func NewUserManagementHandler(userManagementService *services.UserManagementService) *UserManagementHandler {
	return &UserManagementHandler{userManagementService: userManagementService}
}

func (h *UserManagementHandler) CreateUser(c fiber.Ctx) (interface{}, string, error) {
	logger.Log.Info("📥 Create user request received")

	createdByID := c.Get("X-User-ID")
	if createdByID == "" {
		return nil, "Usuario no autenticado", fiber.NewError(fiber.StatusUnauthorized, "Usuario no autenticado")
	}

	var req dto.CreateUserRequest
	if err := c.Bind().JSON(&req); err != nil {
		return nil, "Datos inválidos", fiber.NewError(fiber.StatusBadRequest, "Datos inválidos")
	}

	user, err := h.userManagementService.CreateUser(req, createdByID)
	if err != nil {
		logger.Log.Errorf("❌ Create user failed: %v", err)

		if err == services.ErrCreateUserEmailTaken {
			return nil, err.Error(), fiber.NewError(fiber.StatusConflict, err.Error())
		}

		return nil, err.Error(), fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	logger.Log.Infof("✅ User created: %s", user.Email)
	return user, "Usuario creado exitosamente", nil
}

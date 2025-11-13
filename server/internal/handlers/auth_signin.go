package handlers

import (
	"errors" // 👈 Importamos el paquete errors
	"server/internal/dto"
	"server/internal/services"
	"server/pkgs/logger"

	"github.com/gofiber/fiber/v3"
)

type AuthHandler struct {
	authService services.AuthService
}

func NewAuthHandler(authService services.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

// ✅ Adaptado al formato que espera httpwrap: (data, message, error)
func (h *AuthHandler) Signin(c fiber.Ctx) (interface{}, string, error) {
	logger.Log.Info("📥 Signin request received")

	var req dto.SigninRequest
	if err := c.Bind().JSON(&req); err != nil {
		logger.Log.Errorf("❌ Invalid request body: %v", err)
		return nil, "Invalid request body", fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}

	logger.Log.Infof("📧 Email: %s, Provider: %s", req.Email, req.Provider)

	user, err := h.authService.Signin(req)
	if err != nil {
		logger.Log.Errorf("❌ Signin failed: %v", err)

		// 🆕 Lógica añadida para mapear el error de Google a 403
		if errors.Is(err, services.ErrGoogleUserNotRegistered) {
			// Si el usuario de Google no está registrado, devolvemos 403 Forbidden
			return nil, err.Error(), fiber.NewError(fiber.StatusForbidden, err.Error())
		}

		// Para todos los demás errores (credenciales inválidas, usuario inactivo, etc.), devolvemos 401 Unauthorized
		return nil, err.Error(), fiber.NewError(fiber.StatusUnauthorized, err.Error())
	}

	logger.Log.Infof("✅ Signin successful for %s", req.Email)
	return user, "Login successful", nil
}

func (h *AuthHandler) Signup(c fiber.Ctx) (interface{}, string, error) {
	logger.Log.Info("📥 Signup request received")

	var req dto.SignupRequest
	if err := c.Bind().JSON(&req); err != nil {
		return nil, "Invalid request body", fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}

	user, err := h.authService.Signup(req)
	if err != nil {
		if err == services.ErrSignupEmailTaken {
			return nil, err.Error(), fiber.NewError(fiber.StatusConflict, err.Error())
		}
		return nil, err.Error(), fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	return user, "Signup successful", nil
}

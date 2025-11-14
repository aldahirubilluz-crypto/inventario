// server/inetrnal/handlers/password_reset_handler.go
package handlers

import (
	"errors"
	"github.com/gofiber/fiber/v3"
	"net/http"
	"server/internal/dto"
	"server/internal/services"
)

type PasswordResetHandler struct {
	service     *services.PasswordResetService
	userService *services.UserService
}

func NewPasswordResetHandler(service *services.PasswordResetService, userService *services.UserService) *PasswordResetHandler {
	return &PasswordResetHandler{service: service, userService: userService}
}

func (h *PasswordResetHandler) CheckUserExists(c fiber.Ctx) error {
	var req dto.UserExistsRequestDTO
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"data":    nil,
			"message": "Datos de entrada inválidos",
			"status":  http.StatusBadRequest,
		})
	}

	user, err := h.userService.CheckUserExists(req.Email)
	if err != nil {
		status := http.StatusInternalServerError
		if errors.Is(err, services.ErrUserNotFound) { // 👈 Cambiado
			status = http.StatusNotFound
		}

		return c.Status(status).JSON(fiber.Map{
			"data":    nil,
			"message": err.Error(),
			"status":  status,
		})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"data": fiber.Map{
			"userId": user.ID,
			"email":  user.Email,
			"name":   user.Name,
		},
		"message": "Usuario encontrado",
		"status":  http.StatusOK,
	})
}

func (h *PasswordResetHandler) RequestPasswordReset(c fiber.Ctx) error {
	var req dto.PasswordResetRequestDTO
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"data":    nil,
			"message": "Datos inválidos",
			"status":  http.StatusBadRequest,
		})
	}

	data, err := h.service.RequestPasswordReset(req)
	if err != nil {
		status := http.StatusInternalServerError
		if err.Error() == "no existe una cuenta para el correo ingresado" { // 👈 Minúscula
			status = http.StatusNotFound
		} else if err.Error() == "debes esperar antes de solicitar un nuevo código" { // 👈 Minúscula
			status = http.StatusTooManyRequests
		}
		return c.Status(status).JSON(fiber.Map{
			"data":    nil,
			"message": err.Error(),
			"status":  status,
		})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"data":    data,
		"message": "Código generado exitosamente",
		"status":  http.StatusOK,
	})
}

func (h *PasswordResetHandler) ValidateResetCode(c fiber.Ctx) error {
	var req dto.ValidateCodeDTO
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"data":    nil,
			"message": "Datos inválidos",
			"status":  http.StatusBadRequest,
		})
	}

	data, err := h.service.ValidateResetCode(req)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"data":    nil,
			"message": err.Error(),
			"status":  http.StatusBadRequest,
		})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"data":    data,
		"message": "Código validado exitosamente",
		"status":  http.StatusOK,
	})
}

func (h *PasswordResetHandler) ResetPassword(c fiber.Ctx) error {
	var req dto.ResetPasswordDTO
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"data":    nil,
			"message": "Datos inválidos",
			"status":  http.StatusBadRequest,
		})
	}

	if err := h.service.ResetPassword(req); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"data":    nil,
			"message": err.Error(),
			"status":  http.StatusBadRequest,
		})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"data": fiber.Map{
			"success": true,
		},
		"message": "Contraseña actualizada exitosamente",
		"status":  http.StatusOK,
	})
}

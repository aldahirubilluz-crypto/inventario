// internal/handlers/password_reset_handler.go
package handlers

import (
	"github.com/gofiber/fiber/v3"
	"server/internal/dto"
	"server/internal/services"
)

type PasswordResetHandler struct {
	service *services.PasswordResetService
}

func NewPasswordResetHandler(service *services.PasswordResetService) *PasswordResetHandler {
	return &PasswordResetHandler{service: service}
}

func (h *PasswordResetHandler) RequestPasswordReset(c fiber.Ctx) error {
	var req dto.PasswordResetRequestDTO
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"data":    nil,
			"message": "Datos inválidos",
			"status":  400,
		})
	}

	data, err := h.service.RequestPasswordReset(req)
	if err != nil {
		status := fiber.StatusInternalServerError
		if err.Error() == "No existe una cuenta para el correo ingresado" {
			status = fiber.StatusNotFound
		} else if err.Error() == "Debes esperar antes de solicitar un nuevo código" {
			status = fiber.StatusTooManyRequests
		}
		return c.Status(status).JSON(fiber.Map{
			"data":    nil,
			"message": err.Error(),
			"status":  status,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data":    data,
		"message": "Código generado exitosamente",
		"status":  200,
	})
}

func (h *PasswordResetHandler) ValidateResetCode(c fiber.Ctx) error {
	var req dto.ValidateCodeDTO
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"data":    nil,
			"message": "Datos inválidos",
			"status":  400,
		})
	}

	data, err := h.service.ValidateResetCode(req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"data":    nil,
			"message": err.Error(),
			"status":  400,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data":    data,
		"message": "Código validado exitosamente",
		"status":  200,
	})
}

func (h *PasswordResetHandler) ResetPassword(c fiber.Ctx) error {
	var req dto.ResetPasswordDTO
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"data":    nil,
			"message": "Datos inválidos",
			"status":  400,
		})
	}

	if err := h.service.ResetPassword(req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"data":    nil,
			"message": err.Error(),
			"status":  400,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": fiber.Map{
			"success": true,
		},
		"message": "Contraseña actualizada exitosamente",
		"status":  200,
	})
}
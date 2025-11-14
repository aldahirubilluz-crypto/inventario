// server/internal/handlers/user_handler.go
package handlers

import (
	"github.com/gofiber/fiber/v3"
	"net/http"
	"server/internal/dto"
	"server/internal/services"
)

type UserHandler struct {
	changePasswordService *services.ChangePasswordService
}

func NewUserHandler(changePasswordService *services.ChangePasswordService) *UserHandler {
	return &UserHandler{changePasswordService: changePasswordService}
}

func (h *UserHandler) UpdatePasswordByID(c fiber.Ctx) error {
	var req dto.UpdatePasswordByIDDTO
	if err := c.Bind().JSON(&req); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"message": "Datos inválidos",
			"status":  http.StatusBadRequest,
		})
	}

	err := h.changePasswordService.UpdatePasswordWithVerification(req.UserID, req.Password, req.NewPassword)

	if err != nil {
		status := http.StatusBadRequest

		if err.Error() == "usuario no encontrado o inactivo" {
			status = http.StatusNotFound
		} else if err.Error() == "la contraseña actual es incorrecta" {
			status = http.StatusUnauthorized
		}

		return c.Status(status).JSON(fiber.Map{
			"message": err.Error(),
			"status":  status,
		})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{
		"message": "Contraseña actualizada exitosamente",
		"status":  http.StatusOK,
	})
}

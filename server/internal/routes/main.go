package routes

import (
	"github.com/gofiber/fiber/v3"
)

// RegisterRoutes registra todas las rutas del servidor
func RegisterRoutes(app *fiber.App) {
	app.Get("/health", func(c fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "ok",
			"message": "Servidor corriendo correctamente 🚀",
		})
	})
}

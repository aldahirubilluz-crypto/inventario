package routes

import (
	"github.com/gofiber/fiber/v3"
	"gorm.io/gorm"
	"server/internal/handlers"
	"server/internal/services"
	"server/pkgs/security" // 💡 Importamos el paquete de seguridad
)

func RegisterPasswordResetRoutes(app *fiber.App, db *gorm.DB) {
	// 1. Crear la instancia del servicio Argon2
	argon2Service := security.NewArgon2Service()
	
	// 2. Crear el servicio de reseteo, inyectando la DB y el servicio Argon2
	passwordResetService := services.NewPasswordResetService(db, argon2Service)
	passwordResetHandler := handlers.NewPasswordResetHandler(passwordResetService)

	auth := app.Group("/auth/password-reset")
	{
		auth.Post("/request", passwordResetHandler.RequestPasswordReset)
		auth.Post("/validate", passwordResetHandler.ValidateResetCode)
		auth.Post("/confirm", passwordResetHandler.ResetPassword)
	}
}
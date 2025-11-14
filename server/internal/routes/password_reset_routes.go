package routes

import (
	"github.com/gofiber/fiber/v3"
	"gorm.io/gorm"
	"server/internal/handlers"
	"server/internal/services"
	"server/pkgs/security"
)

func RegisterPasswordResetRoutes(app *fiber.App, db *gorm.DB) {

	argon2Service := security.NewArgon2Service()
	
	passwordResetService := services.NewPasswordResetService(db, argon2Service)
	userService := services.NewUserService(db)
	
	passwordResetHandler := handlers.NewPasswordResetHandler(passwordResetService, userService)

	auth := app.Group("/auth/password-reset")
	{
		auth.Post("/user-exists", passwordResetHandler.CheckUserExists)
		auth.Post("/request", passwordResetHandler.RequestPasswordReset)
		auth.Post("/validate", passwordResetHandler.ValidateResetCode)
		auth.Post("/confirm", passwordResetHandler.ResetPassword)
	}
}
// server/internal/routes/user_routes.go
package routes

import (
	"github.com/gofiber/fiber/v3"
	"gorm.io/gorm"
	"server/internal/handlers"
	"server/internal/services"
	"server/pkgs/security"
)

func RegisterUserRoutes(app *fiber.App, db *gorm.DB) {
	argon2Service := security.NewArgon2Service()
	changePasswordService := services.NewChangePasswordService(db, argon2Service)
	userHandler := handlers.NewUserHandler(changePasswordService)

	userGroup := app.Group("/user")
	{
		userGroup.Post("/update-password", userHandler.UpdatePasswordByID)
	}
}

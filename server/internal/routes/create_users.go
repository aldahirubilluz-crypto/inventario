// server/internal/routes/create_user.go
package routes

import (
	"github.com/gofiber/fiber/v3"
	"gorm.io/gorm"
	"server/internal/handlers"
	"server/internal/services"
	"server/pkgs/httpwrap"
	"server/pkgs/security"
)

func RegisterUserManagementRoutes(app *fiber.App, db *gorm.DB) {
	argon2Service := security.NewArgon2Service()
	userManagementService := services.NewUserManagementService(db, argon2Service)
	userManagementHandler := handlers.NewUserManagementHandler(userManagementService)

	userGroup := app.Group("/users")
	{
		userGroup.Post("/create", httpwrap.Wrap(userManagementHandler.CreateUser))
		userGroup.Get("/list", httpwrap.Wrap(userManagementHandler.GetAllUsers))
	}

	println("✅ User management routes registered: POST /users/create")
}
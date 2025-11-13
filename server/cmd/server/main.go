// server/cmd/server/main.go
package main

import (
	"bufio"
	"database/sql"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/gofiber/fiber/v3"
	"github.com/joho/godotenv"

	"server/internal/config"
	"server/internal/database/seed"
	"server/internal/middlewares"
	"server/internal/models"
	"server/internal/routes"
	"server/pkgs/logger"
	"server/pkgs/validator"
)

func main() {
	// Cargar variables de entorno
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️  No se encontró archivo .env, usando variables del sistema.")
	}

	// Inicializar logger
	logger.InitLogger()
	logger.Log.Info("🚀 Iniciando servidor...")

	// Cargar configuración
	config.LoadConfig()

	// Conectar base de datos y manejar tablas
	wasCreated, wasReset, err := initDatabase()
	if err != nil {
		logger.Log.Fatalf("❌ Error al inicializar la base de datos: %v", err)
	}

	// Si la base fue recién creada o fue reseteada → ejecutar seeding
	if wasCreated || wasReset {
		logger.Log.Info("🌱 Ejecutando seeding inicial (usuario admin)...")
		if err := seed.SeedAll(config.DB); err != nil {
			logger.Log.Fatalf("❌ Error en SeedAll: %v", err)
		}
		logger.Log.Info("✅ Seeding completo ✅")
	}

	// Inicializar validador
	if err := validator.InitValidator(); err != nil {
		logger.Log.Fatalf("❌ Error al inicializar el validador: %v", err)
	}

	// Crear instancia Fiber
	app := fiber.New(fiber.Config{
		AppName:      "Inventario Server",
		ErrorHandler: middlewares.JSONErrorHandler,
	})

	// Middlewares globales
	app.Use(middlewares.CORSMiddleware())
	app.Use(middlewares.LoggerMiddleware())

	// Registrar rutas
	routes.RegisterRoutes(app, config.DB)

	// ✅ AGREGAR ESTO: Imprimir rutas registradas
	logger.Log.Info("📋 Rutas registradas:")
	allRoutes := app.GetRoutes()
	if len(allRoutes) == 0 {
		logger.Log.Error("⚠️  NO SE REGISTRÓ NINGUNA RUTA")
	} else {
		for _, route := range allRoutes {
			logger.Log.Infof("  %s %s", route.Method, route.Path)
		}
	}

	// Puerto
	port := config.GetConfig().ServerPort
	if port == "" {
		port = "8080"
	}

	logger.Log.Infof("✅ Servidor escuchando en http://localhost:%s", port)
	if err := app.Listen(":" + port); err != nil {
		logger.Log.Fatalf("❌ Error al iniciar el servidor: %v", err)
	}
}

// initDatabase crea DB si no existe, migra y retorna si fue recién creada o reseteada
func initDatabase() (wasCreated bool, wasReset bool, err error) {
	cfg := config.GetConfig()

	// Conexión al servidor PostgreSQL (sin DB específica)
	dsnSuper := fmt.Sprintf(
		"host=%s user=%s password=%s port=%s sslmode=%s",
		cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBPort, cfg.DBSSLMode,
	)
	superDB, err := config.SqlConnect(dsnSuper)
	if err != nil {
		return false, false, fmt.Errorf("error conectando al servidor PostgreSQL: %w", err)
	}
	defer superDB.Close()

	// Verificar existencia
	var exists bool
	checkQuery := fmt.Sprintf("SELECT 1 FROM pg_database WHERE datname = '%s';", cfg.DBName)
	err = superDB.QueryRow(checkQuery).Scan(&exists)
	if err != nil && err != sql.ErrNoRows {
		return false, false, fmt.Errorf("error verificando existencia de base de datos: %w", err)
	}

	// Crear si no existe
	if !exists {
		_, err = superDB.Exec("CREATE DATABASE " + cfg.DBName)
		if err != nil {
			return false, false, fmt.Errorf("error creando base de datos: %w", err)
		}
		logger.Log.Infof("🆕 Base de datos %s creada correctamente", cfg.DBName)
		wasCreated = true
	} else {
		logger.Log.Infof("📦 La base de datos %s ya existe", cfg.DBName)
	}

	// Conectar a la base de datos con GORM
	if err := config.ConnectDB(); err != nil {
		return wasCreated, false, fmt.Errorf("error conectando a la base de datos: %w", err)
	}

	// Si ya existía, preguntar si desea resetear tablas
	if !wasCreated {
		reader := bufio.NewReader(os.Stdin)
		fmt.Print("¿Deseas borrar todas las tablas y recrearlas? (s/n): ")
		input, _ := reader.ReadString('\n')
		reset := strings.TrimSpace(strings.ToLower(input)) == "s"

		if reset {
			err = config.DB.Migrator().DropTable(
				&models.Asset{},
				&models.PasswordResetToken{},
				&models.VerificationToken{},
				&models.Session{},
				&models.Account{},
				&models.User{},
			)
			if err != nil {
				return wasCreated, false, fmt.Errorf("error eliminando tablas: %w", err)
			}
			logger.Log.Info("🗑️ Tablas eliminadas correctamente")
			wasReset = true
		}
	}

	// Migrar tablas
	err = config.DB.AutoMigrate(
		&models.User{},
		&models.Account{},
		&models.Session{},
		&models.VerificationToken{},
		&models.PasswordResetToken{},
		&models.Asset{},
	)
	if err != nil {
		return wasCreated, wasReset, fmt.Errorf("error migrando tablas: %w", err)
	}

	logger.Log.Info("✅ Tablas migradas correctamente")
	return wasCreated, wasReset, nil
}

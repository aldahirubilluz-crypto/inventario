//server/cmd/seed/main.go
package main

import (
	"server/internal/config"
	seed "server/internal/database/seed"
	"server/pkgs/logger"

	"github.com/joho/godotenv"
)

func main() {
	logger.InitLogger()
	_ = godotenv.Load()

	config.LoadConfig()
	if err := config.ConnectDB(); err != nil {
		logger.Log.Fatalf("❌ Error conectando a la DB: %v", err)
	}

	if err := seed.SeedAll(config.DB); err != nil {
		logger.Log.Fatalf("❌ Error en SeedAll: %v", err)
	}

	logger.Log.Info("🌱 Seeding completo ✅")
}

package config

import (
	"os"
	"sync"
)

// AppConfig contiene toda la configuración del entorno.
type AppConfig struct {
	ServerPort string
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	DBSSLMode  string
}

var (
	cfg  *AppConfig
	once sync.Once
)

// LoadConfig inicializa la configuración una sola vez (patrón singleton).
func LoadConfig() {
	once.Do(func() {
		cfg = &AppConfig{
			ServerPort: getEnv("SERVER_PORT", "8080"),
			DBHost:     getEnv("DB_HOST", "localhost"),
			DBPort:     getEnv("DB_PORT", "5432"),
			DBUser:     getEnv("DB_USER", "postgres"),
			DBPassword: getEnv("DB_PASSWORD", ""),
			DBName:     getEnv("DB_NAME", "inventario"),
			DBSSLMode:  getEnv("DB_SSLMODE", "disable"),
		}
	})
}

// GetConfig devuelve la configuración actual cargada.
func GetConfig() *AppConfig {
	if cfg == nil {
		LoadConfig()
	}
	return cfg
}

// getEnv obtiene una variable de entorno o retorna un valor por defecto.
func getEnv(key, defaultValue string) string {
	if val, ok := os.LookupEnv(key); ok {
		return val
	}
	return defaultValue
}

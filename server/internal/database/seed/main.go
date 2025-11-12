package seed

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"gorm.io/gorm"
	"server/internal/models"
)

type SeedUser struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Rol      string `json:"rol"`
}

func SeedAll(db *gorm.DB) error {
	var count int64
	if err := db.Model(&models.User{}).Count(&count).Error; err != nil {
		return fmt.Errorf("error al contar usuarios: %w", err)
	}

	if count == 0 {
		fmt.Println("🧩 No existen usuarios, insertando usuario administrador inicial...")
		return seedUsers(db)
	}

	fmt.Println("✅ Usuarios ya existen, se omite seeding.")
	return nil
}

func seedUsers(db *gorm.DB) error {
	// Detectar ruta absoluta del archivo user.json
	execPath, _ := os.Getwd()
	filePath := filepath.Join(execPath, "internal", "database", "seed", "user.json")

	data, err := os.ReadFile(filePath)
	if err != nil {
		return fmt.Errorf("no se pudo leer %s: %w", filePath, err)
	}

	var users []SeedUser
	if err := json.Unmarshal(data, &users); err != nil {
		return fmt.Errorf("error al parsear user.json: %w", err)
	}

	for _, u := range users {
		user := models.User{
			Name:          &u.Name,
			Email:         u.Email,
			Password:      &u.Password,
			Rol:           models.Rol(u.Rol),
			IsActive:      true,
			EmailVerified: ptrTime(time.Now()),
		}
		if err := db.Create(&user).Error; err != nil {
			return fmt.Errorf("error al crear usuario %s: %w", u.Email, err)
		}
		fmt.Printf("👑 Usuario administrador %s creado correctamente.\n", u.Email)
	}

	return nil
}

func ptrTime(t time.Time) *time.Time {
	return &t
}

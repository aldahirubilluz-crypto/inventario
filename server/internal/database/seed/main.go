// server/internal/database/seed/main.go
package seed

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"gorm.io/gorm"
	"server/internal/models"
	"server/pkgs/security"
)

type SeedUser struct {
	Name     string  `json:"name"`
	Email    string  `json:"email"`
	Password string  `json:"password"`
	Rol      string  `json:"rol"`
	Office   *string `json:"office"`
}

func SeedAll(db *gorm.DB) error {
	var count int64
	if err := db.Model(&models.User{}).Count(&count).Error; err != nil {
		return fmt.Errorf("error al contar usuarios: %w", err)
	}

	if count == 0 {
		fmt.Println("🧩 No existen usuarios, insertando usuarios iniciales...")
		return seedUsers(db)
	}

	fmt.Println("✅ Usuarios ya existen, se omite seeding.")
	return nil
}

func seedUsers(db *gorm.DB) error {
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

	argon := security.NewArgon2Service()

	var adminID string
	managerIDs := make(map[string]string)

	// 🔹 Crear primero al ADMIN
	for _, u := range users {
		if u.Rol == "ADMIN" {
			hashedPassword, err := argon.HashPassword(u.Password)
			if err != nil {
				return fmt.Errorf("error al encriptar la contraseña de %s: %w", u.Email, err)
			}

			user := models.User{
				Name:          &u.Name,
				Email:         u.Email,
				Password:      ptrString(hashedPassword),
				Rol:           models.Rol(u.Rol),
				IsActive:      true,
				EmailVerified: ptrTime(time.Now()),
			}

			if err := db.Create(&user).Error; err != nil {
				return fmt.Errorf("error al crear usuario %s: %w", u.Email, err)
			}

			adminID = user.ID
			fmt.Printf("👤 Usuario ADMIN %s creado correctamente.\n", u.Email)
			break
		}
	}

	// 🔹 Crear managers y asignar admin como creador
	for _, u := range users {
		if u.Rol != "MANAGER" {
			continue
		}

		hashedPassword, err := argon.HashPassword(u.Password)
		if err != nil {
			return fmt.Errorf("error al encriptar la contraseña de %s: %w", u.Email, err)
		}

		var office *models.Office
		if u.Office != nil && *u.Office != "" {
			officeValue := models.Office(*u.Office)
			office = &officeValue
		}

		user := models.User{
			Name:          &u.Name,
			Email:         u.Email,
			Password:      ptrString(hashedPassword),
			Rol:           models.Rol(u.Rol),
			Office:        office,
			IsActive:      true,
			CreatedByID:   &adminID,
			EmailVerified: ptrTime(time.Now()),
		}

		if err := db.Create(&user).Error; err != nil {
			return fmt.Errorf("error al crear usuario %s: %w", u.Email, err)
		}

		if u.Office != nil {
			managerIDs[*u.Office] = user.ID
		}

		fmt.Printf("👤 Usuario MANAGER %s (%s) creado correctamente.\n", u.Email, *u.Office)
	}

	// 🔹 Crear empleados y asignar manager de su oficina como creador
	for _, u := range users {
		if u.Rol != "EMPLOYEE" {
			continue
		}

		hashedPassword, err := argon.HashPassword(u.Password)
		if err != nil {
			return fmt.Errorf("error al encriptar la contraseña de %s: %w", u.Email, err)
		}

		var office *models.Office
		var createdByID *string
		if u.Office != nil && *u.Office != "" {
			officeValue := models.Office(*u.Office)
			office = &officeValue

			if managerID, exists := managerIDs[*u.Office]; exists {
				createdByID = &managerID
			}
		}

		user := models.User{
			Name:          &u.Name,
			Email:         u.Email,
			Password:      ptrString(hashedPassword),
			Rol:           models.Rol(u.Rol),
			Office:        office,
			CreatedByID:   createdByID,
			IsActive:      true,
			EmailVerified: ptrTime(time.Now()),
		}

		if err := db.Create(&user).Error; err != nil {
			return fmt.Errorf("error al crear usuario %s: %w", u.Email, err)
		}

		fmt.Printf("👤 Usuario EMPLOYEE %s (%s) creado correctamente.\n", u.Email, *u.Office)
	}

	fmt.Println("✅ Todos los usuarios seed creados exitosamente")
	return nil
}

func ptrTime(t time.Time) *time.Time {
	return &t
}

func ptrString(s string) *string {
	return &s
}
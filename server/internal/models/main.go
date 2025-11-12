package models

import (
	"time"

	"gorm.io/gorm"
)

// ENUM
type Rol string

const (
	Admin    Rol = "ADMIN"
	Manager  Rol = "MANAGER"
	Observer Rol = "OBSERVER"
)

// ======= BASE =======
type Base struct {
	ID        string         `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	CreatedAt time.Time      `gorm:"autoCreateTime"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

// ======= USER =======
type User struct {
	ID                 string              `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Name               *string             `gorm:"type:varchar(100)"`
	Email              string              `gorm:"uniqueIndex;not null"`
	EmailVerified      *time.Time
	Image              *string
	Password           *string
	Rol                Rol                 `gorm:"type:varchar(20);default:'OBSERVER'"`
	Phone              *string
	IsActive           bool                `gorm:"default:true"`
	LastLogin          *time.Time
	CreatedAt          time.Time           `gorm:"autoCreateTime"`
	UpdatedAt          time.Time           `gorm:"autoUpdateTime"`

	Accounts            []Account
	Sessions            []Session
	PasswordResetTokens []PasswordResetToken
}

// ======= ACCOUNT =======
type Account struct {
	ID                string  `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	UserID            string  `gorm:"type:uuid;not null"`
	Type              string
	Provider          string
	ProviderAccountID string
	RefreshToken      *string `gorm:"type:text"`
	AccessToken       *string `gorm:"type:text"`
	ExpiresAt         *int
	TokenType         *string
	Scope             *string
	IDToken           *string `gorm:"type:text"`
	SessionState      *string

	User User `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
}

// ======= SESSION =======
type Session struct {
	ID           string    `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	SessionToken string    `gorm:"uniqueIndex;not null"`
	UserID       string    `gorm:"type:uuid;not null"`
	Expires      time.Time
	User         User `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
}

// ======= VERIFICATION TOKEN =======
type VerificationToken struct {
	Identifier string    `gorm:"not null"`
	Token      string    `gorm:"uniqueIndex;not null"`
	Expires    time.Time
}

// ======= PASSWORD RESET TOKEN =======
type PasswordResetToken struct {
	ID          string     `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	UserID      string     `gorm:"type:uuid;not null"`
	Email       string
	Token       string
	Code        string
	Expires     time.Time
	LastSentAt  *int64
	CreatedAt   time.Time  `gorm:"autoCreateTime"`
	IsUsed      bool       `gorm:"default:false"`
	IsValidated bool       `gorm:"default:false"`
	UsedAt      *time.Time

	User User `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
}

// ======= ASSET =======
type Asset struct {
	ID                  uint      `gorm:"primaryKey;autoIncrement"`
	OldLabel            string    `gorm:"uniqueIndex"`
	PatrimonialCode     string    `gorm:"uniqueIndex"`
	Description         string
	PurchaseOrder       string
	PurchaseValue       float64   `gorm:"type:decimal(12,2)"`
	PurchaseDate        time.Time
	DocumentType        string
	PecosaNumber        string
	RegistrationDate    time.Time
	Location            string
	CostCenter          string
	ResponsibleEmployee string
	FinalEmployee       string
	LocationType        string
	LocationSubtype     string
	Features            *string
	Model               string
	Dimensions          string
	SerialNumber        string
	Brand               string
	ChassisNumber       *string
	EngineNumber        *string
	LicensePlate        *string
	CreatedAt           time.Time `gorm:"autoCreateTime"`
	UpdatedAt           time.Time `gorm:"autoUpdateTime"`
}

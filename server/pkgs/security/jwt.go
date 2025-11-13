package security

import (
	"time"
	"github.com/golang-jwt/jwt/v5"
)

type JWTService struct {
	SecretKey string
	TTL       time.Duration
}

func NewJWTService(secret string, ttl time.Duration) *JWTService {
	return &JWTService{
		SecretKey: secret,
		TTL:       ttl,
	}
}

func (j *JWTService) GenerateToken(userID string, email string, role string) (string, error) {
	claims := jwt.MapClaims{
		"sub":   userID,
		"email": email,
		"role":  role,
		"exp":   time.Now().Add(j.TTL).Unix(),
		"iat":   time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(j.SecretKey))
}

package apimiddleware

import (
	"fmt"
	"strings"
	"time"

	"github.com/charmbracelet/log"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
)

type CustomClaims struct {
	UserID string `json:"userId"`
	jwt.RegisteredClaims
}

func AuthMiddleware(secretKey string, logger *log.Logger) fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")

		if authHeader == "" {
			logger.Error("'Authorization' header not found")
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "unauthorized request",
			})
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			logger.Error("invalid 'Authorization' header")
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "unauthorized request",
			})
		}

		token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(secretKey), nil
		})

		if err != nil {
			logger.Error("failed to parse token", "error", err)
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "unauthorized request",
			})
		}

		if claims, ok := token.Claims.(*CustomClaims); ok && token.Valid {
			if time.Now().Unix() > claims.ExpiresAt.Unix() {
				logger.Error("token expired")
				return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
					"error": "unauthorized request",
				})
			}

			c.Locals("userId", claims.UserID)

			return c.Next()
		}

		logger.Error("invalid token")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "unauthorized request",
		})
	}
}

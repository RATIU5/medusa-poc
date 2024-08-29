package v1routes

import (
	"github.com/RATIU5/medusa-poc/internal/database"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(v1 fiber.Router, db *database.Database) {
	v1.Get("/hello", helloHandler)
}

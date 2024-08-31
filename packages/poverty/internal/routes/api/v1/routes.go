package v1

import (
	"github.com/RATIU5/medusa-poc/internal/database"
	v1routes "github.com/RATIU5/medusa-poc/internal/routes/api/v1/routes"
	"github.com/charmbracelet/log"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(router fiber.Router, db *database.Database, logger *log.Logger) {
	v1 := router.Group("/v1")
	v1routes.SetupRoutes(v1, db, logger)
}

package v1routes

import (
	"github.com/RATIU5/medusa-poc/internal/database"
	v1handlers "github.com/RATIU5/medusa-poc/internal/routes/api/v1/handlers"
	"github.com/charmbracelet/log"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(v1 fiber.Router, db *database.Database, logger *log.Logger) {
	itemsHandler := v1handlers.NewItemsHandler(db, logger)
	v1.Post("/items", itemsHandler.CreateItemHandler)
}

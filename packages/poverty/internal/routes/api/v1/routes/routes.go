package v1routes

import (
	"github.com/RATIU5/medusa-poc/internal/database"
	v1handlers "github.com/RATIU5/medusa-poc/internal/routes/api/v1/handlers"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(v1 fiber.Router, db *database.Database) {
	itemsHandler := v1handlers.NewItemsHandler(db)
	v1.Post("/items", itemsHandler.CreateItem)
}

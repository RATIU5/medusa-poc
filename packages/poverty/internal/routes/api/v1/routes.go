package v1

import (
	"github.com/RATIU5/medusa-poc/internal/database"
	v1handlers "github.com/RATIU5/medusa-poc/internal/routes/api/v1/handlers"
	"github.com/charmbracelet/log"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(router fiber.Router, db *database.Database, logger *log.Logger) {
	itemHandlers := v1handlers.NewItemsHandler(db, logger)
	v1 := router.Group("/v1")
	items := v1.Group("/items")
	items.Get("/", itemHandlers.GetAllItemsHandler)
	items.Post("/", itemHandlers.CreateItemHandler)

	item := items.Group(":id")
	item.Get("/", itemHandlers.GetItemHandler)
	item.Patch("/", itemHandlers.PartialUpdateItemHandler)
}

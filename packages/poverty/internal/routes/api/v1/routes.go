package v1

import (
	"github.com/RATIU5/medusa-poc/internal/database"
	v1HandlersItem "github.com/RATIU5/medusa-poc/internal/routes/api/v1/handlers/items"
	"github.com/charmbracelet/log"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(router fiber.Router, db *database.Database, logger *log.Logger) {
	itemHandlers := v1HandlersItem.NewItemsHandler(logger, db)
	v1 := router.Group("/v1")
	items := v1.Group("/items")
	items.Get("/", itemHandlers.GetAllItemsHandler)
	items.Post("/", itemHandlers.CreateItemHandler)

	item := items.Group(":id")
	item.Get("/", itemHandlers.GetItemHandler)
	item.Patch("/", itemHandlers.PartialUpdateItemHandler)
	item.Put("/", itemHandlers.UpdateItemHandler)
	item.Delete("/", itemHandlers.DeleteItemHandler)

	item.Get("/children", itemHandlers.GetChildrenHandler)
}

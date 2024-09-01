package v1HandlersItem

import (
	"github.com/RATIU5/medusa-poc/internal/database"
	"github.com/charmbracelet/log"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type ItemsHandler struct {
	logger *log.Logger
	db     *database.Database
}

func NewItemsHandler(logger *log.Logger, db *database.Database) *ItemsHandler {
	return &ItemsHandler{
		logger: logger,
		db:     db,
	}
}

func (i *ItemsHandler) GetItemHandler(c *fiber.Ctx) error {
	paramId := c.Params("id")
	if paramId == "" {
		return handleError(c, i.logger, ErrItemIDNotProvided)
	}

	item, err := i.getItem(c.Context(), paramId)
	if err != nil {
		return handleError(c, i.logger, err)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": item,
	})
}

func (i *ItemsHandler) PartialUpdateItemHandler(c *fiber.Ctx) error {
	paramId := c.Params("id")
	if paramId == "" {
		return handleError(c, i.logger, ErrItemIDNotProvided)
	}

	itemUUID, err := uuid.Parse(paramId)
	if err != nil {
		return handleError(c, i.logger, ErrInvalidItemID)
	}

	updateItem, err := parseUpdateItemRequest(c)
	if err != nil {
		return handleError(c, i.logger, err)
	}

	err = i.updatePartialItem(c.Context(), itemUUID, updateItem)
	if err != nil {
		return handleError(c, i.logger, err)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "item updated",
	})
}

func (i *ItemsHandler) CreateItemHandler(c *fiber.Ctx) error {
	var item Item
	if err := c.BodyParser(&item); err != nil {
		return handleError(c, i.logger, ErrInvalidRequestBody)
	}

	err := i.createItem(c.Context(), &item)
	if err != nil {
		return handleError(c, i.logger, err)
	}

	return c.Status(fiber.StatusCreated).JSON(item)
}

func (i *ItemsHandler) GetAllItemsHandler(c *fiber.Ctx) error {
	items, err := i.getAllItems(c.Context())
	if err != nil {
		return handleError(c, i.logger, err)
	}

	return c.Status(fiber.StatusOK).JSON(items)
}

func (i *ItemsHandler) UpdateItemHandler(c *fiber.Ctx) error {
	paramId := c.Params("id")
	if paramId == "" {
		return handleError(c, i.logger, ErrItemIDNotProvided)
	}

	itemUUID, err := uuid.Parse(paramId)
	if err != nil {
		return handleError(c, i.logger, ErrInvalidItemID)
	}

	var updateItem FullUpdateItem
	if err := c.BodyParser(&updateItem); err != nil {
		return handleError(c, i.logger, ErrInvalidRequestBody)
	}

	if err := validateUpdateItemRequest(&updateItem); err != nil {
		return handleError(c, i.logger, err)
	}

	updatedItem, err := i.updateFullItem(c.Context(), itemUUID, &updateItem)
	if err != nil {
		return handleError(c, i.logger, err)
	}

	return c.Status(fiber.StatusOK).JSON(updatedItem)
}

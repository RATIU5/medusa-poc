package v1HandlersItem

import (
	"fmt"

	"github.com/RATIU5/medusa-poc/internal/database"
	queryparser "github.com/RATIU5/medusa-poc/internal/query/parser"
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

func (i *ItemsHandler) GetAllItemsHandler(c *fiber.Ctx) error {
	queryArgs := make(map[string]string)
	c.Request().URI().QueryArgs().VisitAll(func(key, value []byte) {
		queryArgs[string(key)] = string(value)
	})

	filters, selects, err := queryparser.ParseQuery(queryArgs)
	if err != nil {
		return handleError(c, i.logger, fmt.Errorf("error parsing query: %w", err))
	}

	items, err := i.getAllItems(c.Context(), filters, selects)
	if err != nil {
		return handleError(c, i.logger, err)
	}

	if len(items) == 0 {
		items = []map[string]interface{}{}
	}

	return c.Status(fiber.StatusOK).JSON(items)
}

func (i *ItemsHandler) GetItemHandler(c *fiber.Ctx) error {
	paramId := c.Params("id")
	if paramId == "" {
		return handleError(c, i.logger, ErrItemIDNotProvided)
	}

	queryArgs := make(map[string]string)
	c.Request().URI().QueryArgs().VisitAll(func(key, value []byte) {
		queryArgs[string(key)] = string(value)
	})

	filters, selects, err := queryparser.ParseQuery(queryArgs)
	if err != nil {
		return handleError(c, i.logger, fmt.Errorf("error parsing query: %w", err))
	}

	item, err := i.getItem(c.Context(), paramId, filters, selects)
	if err != nil {
		return handleError(c, i.logger, err)
	}

	return c.Status(fiber.StatusOK).JSON(item)
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

	// Validate content separately
	if err := validateJSONObject(item.Content, "content"); err != nil {
		return handleError(c, i.logger, err)
	}
	if err := validateJSONObject(item.Metadata, "metadata"); err != nil {
		return handleError(c, i.logger, err)
	}

	err := i.createItem(c.Context(), &item)
	if err != nil {
		return handleError(c, i.logger, err)
	}

	return c.Status(fiber.StatusCreated).JSON(item)
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

func (i *ItemsHandler) DeleteItemHandler(c *fiber.Ctx) error {
	paramId := c.Params("id")
	if paramId == "" {
		return handleError(c, i.logger, ErrItemIDNotProvided)
	}

	itemUUID, err := uuid.Parse(paramId)
	if err != nil {
		return handleError(c, i.logger, ErrInvalidItemID)
	}

	err = i.deleteItem(c.Context(), itemUUID)
	if err != nil {
		return handleError(c, i.logger, err)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "item deleted",
	})
}

func (i *ItemsHandler) GetChildrenHandler(c *fiber.Ctx) error {
	paramId := c.Params("id")
	if paramId == "" {
		return handleError(c, i.logger, ErrItemIDNotProvided)
	}

	itemUUID, err := uuid.Parse(paramId)
	if err != nil {
		return handleError(c, i.logger, ErrInvalidItemID)
	}

	queryArgs := make(map[string]string)
	c.Request().URI().QueryArgs().VisitAll(func(key, value []byte) {
		queryArgs[string(key)] = string(value)
	})

	filters, selects, err := queryparser.ParseQuery(queryArgs)
	if err != nil {
		return handleError(c, i.logger, fmt.Errorf("error parsing query: %w", err))
	}

	children, err := i.getChildren(c.Context(), itemUUID, filters, selects)
	if err != nil {
		return handleError(c, i.logger, err)
	}

	if len(children) == 0 {
		children = []map[string]interface{}{}
	}

	return c.Status(fiber.StatusOK).JSON(children)
}

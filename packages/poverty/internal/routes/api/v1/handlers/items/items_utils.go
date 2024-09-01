package v1HandlersItem

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"

	"github.com/charmbracelet/log"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

var (
	ErrItemNotFound         = errors.New("item not found")
	ErrItemIDNotProvided    = errors.New("item id not provided")
	ErrInvalidItemID        = errors.New("item id not valid")
	ErrInvalidRequestBody   = errors.New("invalid request body")
	ErrInvalidParentID      = errors.New("invalid parent_id format")
	ErrNoChangesDetected    = errors.New("no changes detected")
	ErrCannotRemoveParentID = errors.New("cannot remove parent_id due to existing children")
	ErrEmptyItemTitle       = errors.New("item title cannot be empty")
	ErrParentItemNotFound   = errors.New("specified parent item does not exist")
	ErrNoItemCreated        = errors.New("no item was created")
	ErrTitleRequired        = errors.New("title is required")
	ErrContentRequired      = errors.New("content is required")
)

func handleError(c *fiber.Ctx, logger *log.Logger, err error) error {
	switch err {
	case ErrItemNotFound, ErrItemIDNotProvided, ErrInvalidItemID:
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": err.Error(),
		})
	case ErrInvalidRequestBody, ErrInvalidParentID, ErrEmptyItemTitle, ErrParentItemNotFound, ErrTitleRequired, ErrContentRequired:
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	case ErrNoChangesDetected:
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "no changes applied",
		})
	case ErrCannotRemoveParentID:
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot remove parent_id because this item has children",
		})
	case ErrNoItemCreated:
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create item",
		})
	default:
		logger.Error("failed to process request", "error", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "failed to process request",
		})
	}
}

func validateParentID(ctx context.Context, tx pgx.Tx, itemUUID uuid.UUID, parentID *uuid.UUID) error {
	if parentID != nil && *parentID != uuid.Nil {
		if *parentID == itemUUID {
			return errors.New("cannot set parent_id to item's own id")
		}
		isValid, err := isValidID(ctx, tx, *parentID)
		if err != nil {
			return err
		}
		if !isValid {
			return ErrInvalidParentID
		}
	}
	return nil
}

func uuidEqual(a, b *uuid.UUID) bool {
	if a == nil && b == nil {
		return true
	}
	if a == nil || b == nil {
		return false
	}
	return *a == *b
}

func jsonRawMessageEqual(a, b json.RawMessage) bool {
	return bytes.Equal(a, b)
}

func mapEqual(a, b map[string]interface{}) bool {
	return bytes.Equal(mustMarshal(a), mustMarshal(b))
}

func mustMarshal(v interface{}) []byte {
	b, err := json.Marshal(v)
	if err != nil {
		panic(err)
	}
	return b
}

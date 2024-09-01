package v1handlers

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"reflect"
	"strings"

	"github.com/charmbracelet/log"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

const ItemNotFound = "item not found"

func (i *ItemsHandler) GetItemHandler(c *fiber.Ctx) error {
	paramId := c.Params("id")
	if paramId == "" {
		i.logger.Error("item id not provided")
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": ItemNotFound,
		})
	}

	var item Item

	query := `
			SELECT id, title, parent_id, content, metadata, created_at, updated_at 
			FROM items
			WHERE id = $1`
	err := i.db.ExecuteQueryRow(c.Context(), query, paramId).Scan(
		&item.ID,
		&item.Title,
		&item.ParentID,
		&item.Content,
		&item.Metadata,
		&item.CreatedAt,
		&item.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			i.logger.Error("item not found")
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": ItemNotFound,
			})
		}
		i.logger.Error(err)
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": ItemNotFound,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"data": item,
	})
}

type UpdateItem struct {
	Title    string                 `json:"title"`
	Content  json.RawMessage        `json:"content"`
	Metadata map[string]interface{} `json:"metadata,omitempty"`
	ParentId *uuid.UUID             `json:"parent_id,omitempty"`
}

func (i *ItemsHandler) PartialUpdateItemHandler(c *fiber.Ctx) error {
	paramId := c.Params("id")
	if paramId == "" {
		i.logger.Error("item id not provided")
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": ItemNotFound,
		})
	}
	itemUUID, err := uuid.Parse(paramId)
	if err != nil {
		i.logger.Error("item id not valid")
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": ItemNotFound,
		})
	}

	var requestBody map[string]interface{}
	if err := c.BodyParser(&requestBody); err != nil {
		i.logger.Error(err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid request body",
		})
	}

	newItem := new(UpdateItem)
	if title, ok := requestBody["title"].(string); ok {
		newItem.Title = title
	}
	if content, ok := requestBody["content"].(json.RawMessage); ok {
		newItem.Content = content
	}
	if metadata, ok := requestBody["metadata"].(map[string]interface{}); ok {
		newItem.Metadata = metadata
	}
	if _, ok := requestBody["parent_id"]; ok {
		nilUUID := uuid.Nil
		newItem.ParentId = &nilUUID
		if parentIdStr, ok := requestBody["parent_id"].(string); ok && parentIdStr != "" {
			parsedUUID, err := uuid.Parse(parentIdStr)
			if err != nil {
				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
					"error": "invalid parent_id format",
				})
			}
			newItem.ParentId = &parsedUUID
		}
	}

	err = i.db.ExecuteTransaction(c.Context(), func(tx pgx.Tx) error {
		existingItem, err := getExistingItem(c.Context(), tx, paramId)
		if err != nil {
			return err
		}

		if newItem.ParentId != nil && *newItem.ParentId != uuid.Nil {
			if *newItem.ParentId == itemUUID {
				return errors.New("cannot set parent_id to item's own id")
			}
			isValid, err := isValidId(c.Context(), tx, newItem.ParentId)
			if err != nil {
				i.logger.Error("failed to check parent_id", "error", err)
				return err
			}
			if !isValid {
				return errors.New("parent id does not exist")
			}
		}

		updateQuery, args := buildUpdateQuery(itemUUID, existingItem, newItem)
		if updateQuery == "" {
			return errors.New("no changes detected")
		}

		i.logger.Debug(updateQuery)

		_, err = tx.Exec(c.Context(), updateQuery, args...)
		if err != nil {
			if pgErr, ok := err.(*pgconn.PgError); ok {
				if pgErr.Code == "23503" { // foreign key violation
					return errors.New("cannot remove parent_id due to existing children")
				}
			}
			return err
		}
		return nil
	})

	if err != nil {
		return handleUpdateError(c, i.logger, err)
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "item updated",
	})
}

func getExistingItem(ctx context.Context, tx pgx.Tx, id string) (*UpdateItem, error) {
	var existingItem UpdateItem
	query := `
		SELECT title, parent_id, content, metadata
		FROM items
		WHERE id = $1`
	err := tx.QueryRow(ctx, query, id).Scan(
		&existingItem.Title,
		&existingItem.ParentId,
		&existingItem.Content,
		&existingItem.Metadata,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, errors.New("specified item does not exist")
		}
		return nil, err
	}
	return &existingItem, nil
}

func buildUpdateQuery(id uuid.UUID, existing, new *UpdateItem) (string, []interface{}) {
	updates := []string{}
	args := []interface{}{id}
	argIndex := 2

	if new.Title != "" && new.Title != existing.Title {
		updates = append(updates, fmt.Sprintf("title = $%d", argIndex))
		args = append(args, new.Title)
		argIndex++
	}

	// Handle parent_id
	if new.ParentId != nil {
		if *new.ParentId == id {
			return "SAME_PARENT", nil
		}
		if *new.ParentId == uuid.Nil {
			// Only add update if existing.ParentId is not null
			if existing.ParentId != nil {
				updates = append(updates, "parent_id = NULL")
			}
		} else if !reflect.DeepEqual(new.ParentId, existing.ParentId) {
			updates = append(updates, fmt.Sprintf("parent_id = $%d", argIndex))
			args = append(args, *new.ParentId)
			argIndex++
		}
	}

	if new.Content != nil && !reflect.DeepEqual(new.Content, existing.Content) {
		updates = append(updates, fmt.Sprintf("content = $%d", argIndex))
		args = append(args, new.Content)
		argIndex++
	}

	if new.Metadata != nil && !reflect.DeepEqual(new.Metadata, existing.Metadata) {
		updates = append(updates, fmt.Sprintf("metadata = $%d", argIndex))
		args = append(args, new.Metadata)
		argIndex++
	}

	if len(updates) == 0 {
		return "", args
	}

	query := fmt.Sprintf("UPDATE items SET %s WHERE id = $1", strings.Join(updates, ", "))
	return query, args
}

func handleUpdateError(c *fiber.Ctx, logger *log.Logger, err error) error {
	switch err.Error() {
	case "specified item does not exist":
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": ItemNotFound,
		})
	case "no changes detected":
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"message": "no changes applied",
		})
	case "cannot remove parent_id due to existing children":
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Cannot remove parent_id because this item has children",
		})
	default:
		logger.Error("failed to update item", "error", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "failed to update item",
		})
	}
}

func isValidId(ctx context.Context, tx pgx.Tx, id *uuid.UUID) (bool, error) {
	var exists bool
	err := tx.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM items WHERE id = $1)", id).Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}

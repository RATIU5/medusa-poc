package v1handlers

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"reflect"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
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

func (i *ItemsHandler) UpdateItemHandler(c *fiber.Ctx) error {
	paramId := c.Params("id")
	if paramId == "" {
		i.logger.Error("item id not provided")
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": ItemNotFound,
		})
	}

	err := i.db.ExecuteTransaction(c.Context(), func(tx pgx.Tx) error {
		var existingItem UpdateItem
		query := `
			SELECT title, parent_id, content, metadata
			FROM items
			WHERE id = $1`
		err := tx.QueryRow(c.Context(), query, paramId).Scan(
			&existingItem.Title,
			&existingItem.ParentId,
			&existingItem.Content,
			&existingItem.Metadata,
		)
		if err != nil {
			return errors.New("specified item does not exist")
		}

		newItem := new(UpdateItem)

		if err = c.BodyParser(newItem); err != nil {
			i.logger.Error(err)
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "invalid request body",
			})
		}

		equal, err := compareAndValidateUpdateItems(c.Context(), tx, existingItem, *newItem)
		if err != nil {
			return err
		}

		if equal {
			return errors.New("no new changes")
		}

		updateQuery := `
			UPDATE items
			SET title = $1, parent_id = $2, content = $3, metadata = $4
			WHERE id = $5`
		_, err = tx.Exec(c.Context(), updateQuery,
			newItem.Title,
			newItem.ParentId,
			newItem.Content,
			newItem.Metadata,
			paramId)
		return err
	})

	if err != nil {
		if err.Error() == "specified item does not exist" {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": ItemNotFound,
			})
		}
		if err.Error() == "no changes detected" {
			return c.Status(fiber.StatusOK).JSON(fiber.Map{
				"message": "ok",
			})
		}
		if err.Error() == "new parent does not exist" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "invalid parent ID",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "failed to update item",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "item updated",
	})
}

func compareAndValidateUpdateItems(ctx context.Context, tx pgx.Tx, oldItem, newItem UpdateItem) (bool, error) {
	changed := false

	if oldItem.Title != newItem.Title {
		changed = true
	}

	if !reflect.DeepEqual(oldItem.Content, newItem.Content) {
		changed = true
	}

	if !reflect.DeepEqual(oldItem.Metadata, newItem.Metadata) {
		changed = true
	}

	if !areParentIdsEqual(oldItem.ParentId, newItem.ParentId) {
		changed = true
		if newItem.ParentId != nil {
			exists, err := doesItemExist(ctx, tx, *newItem.ParentId)
			if err != nil {
				return false, err
			}
			if !exists {
				return false, errors.New("new parent does not exist")
			}
		}
	}

	return !changed, nil
}

func areParentIdsEqual(a, b *uuid.UUID) bool {
	if a == nil && b == nil {
		return true
	}
	if a == nil || b == nil {
		return false
	}
	return *a == *b
}

func doesItemExist(ctx context.Context, tx pgx.Tx, id uuid.UUID) (bool, error) {
	var exists bool
	err := tx.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM items WHERE id = $1)", id).Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}

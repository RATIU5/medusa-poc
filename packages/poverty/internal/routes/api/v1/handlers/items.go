package v1handlers

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/RATIU5/medusa-poc/internal/database"
	"github.com/charmbracelet/log"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

type ItemsHandler struct {
	db     *database.Database
	logger *log.Logger
}

func NewItemsHandler(db *database.Database, logger *log.Logger) *ItemsHandler {
	return &ItemsHandler{db: db, logger: logger}
}

type Item struct {
	ID        uuid.UUID              `json:"id,omitempty"`
	Title     string                 `json:"title"`
	ParentID  *uuid.UUID             `json:"parent_id,omitempty"`
	Content   json.RawMessage        `json:"content"`
	Metadata  map[string]interface{} `json:"metadata,omitempty"`
	CreatedAt time.Time              `json:"created_at,omitempty"`
	UpdatedAt time.Time              `json:"updated_at,omitempty"`
}

func (item *Item) validateContent() error {
	if len(item.Content) == 0 {
		return errors.New("content cannot be empty")
	}

	// You can add more general content validation here if needed
	return nil
}

// CreateItem inserts a new item into the database
func CreateItem(ctx context.Context, db *database.Database, item *Item) error {
	if item.Title == "" {
		return errors.New("item title cannot be empty")
	}
	if err := item.validateContent(); err != nil {
		return err
	}

	return db.ExecuteTransaction(ctx, func(tx pgx.Tx) error {
		// If ParentID is provided, check if it exists
		if item.ParentID != nil {
			var exists bool
			err := tx.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM items WHERE id = $1)", item.ParentID).Scan(&exists)
			if err != nil {
				return fmt.Errorf("error checking parent existence: %w", err)
			}
			if !exists {
				return errors.New("specified parent item does not exist")
			}
		}

		query := `
			INSERT INTO items (title, parent_id, content, metadata)
			VALUES ($1, $2, $3, $4)
			RETURNING id, created_at, updated_at`

		err := tx.QueryRow(ctx, query,
			item.Title,
			item.ParentID,
			item.Content,
			item.Metadata,
		).Scan(&item.ID, &item.CreatedAt, &item.UpdatedAt)

		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				return errors.New("no item was created")
			}
			return fmt.Errorf("error creating item: %w", err)
		}

		return nil
	})
}

// CreateItemHandler is an example Fiber handler for creating an item
func (i *ItemsHandler) CreateItemHandler(c *fiber.Ctx) error {
	var item Item
	if err := c.BodyParser(&item); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid request body",
		})
	}

	err := CreateItem(c.Context(), i.db, &item)
	if err != nil {
		i.logger.Error(err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "failed to create item",
		})
	}

	return c.Status(fiber.StatusOK).JSON(item)
}

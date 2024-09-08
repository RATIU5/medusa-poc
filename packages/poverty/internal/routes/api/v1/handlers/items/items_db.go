package v1HandlersItem

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"

	querybuilder "github.com/RATIU5/medusa-poc/internal/query/builder"
	queryparser "github.com/RATIU5/medusa-poc/internal/query/parser"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

type Database interface {
	ExecuteQueryRow(ctx context.Context, query string, args ...interface{}) pgx.Row
	ExecuteTransaction(ctx context.Context, fn func(pgx.Tx) error) error
}

func (i *ItemsHandler) updatePartialItem(ctx context.Context, itemUUID uuid.UUID, newItem *PartialUpdateItem) error {
	return i.db.ExecuteTransaction(ctx, func(tx pgx.Tx) error {
		existingItem, err := getExistingItem(ctx, tx, itemUUID.String())
		if err != nil {
			return err
		}

		if err := validateParentID(ctx, tx, itemUUID, newItem.ParentID); err != nil {
			return err
		}

		updateQuery, args := buildPartialUpdateQuery(itemUUID, existingItem, newItem)
		if updateQuery == "" {
			return ErrNoChangesDetected
		}

		_, err = tx.Exec(ctx, updateQuery, args...)
		if err != nil {
			if pgErr, ok := err.(*pgconn.PgError); ok && pgErr.Code == "23503" {
				return ErrCannotRemoveParentID
			}
			return err
		}
		return nil
	})
}

func (i *ItemsHandler) getItem(ctx context.Context, id string, filters []queryparser.Filter, selects queryparser.Select) (map[string]interface{}, error) {
	idFilter := queryparser.Filter{
		Field:    "id",
		Operator: "eq",
		Value:    id,
	}
	filters = append(filters, idFilter)

	query, args, err := querybuilder.BuildQuery("items", filters, selects)
	if err != nil {
		return nil, fmt.Errorf("error building query: %w", err)
	}

	rows, err := i.db.ExecuteQuery(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("error executing query: %w", err)
	}
	defer rows.Close()

	var rawItem map[string]interface{}
	if rows.Next() {
		rawItem, err = pgx.RowToMap(rows)
		if err != nil {
			return nil, fmt.Errorf("error scanning row: %w", err)
		}
	} else {
		return nil, ErrItemNotFound
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating rows: %w", err)
	}

	reshapedItem := reshapeResponse(rawItem, i.logger)

	return reshapedItem, nil
}

func getExistingItem(ctx context.Context, tx pgx.Tx, id string) (*PartialUpdateItem, error) {
	filters := []queryparser.Filter{
		{
			Field:    "id",
			Operator: "eq",
			Value:    id,
		},
	}
	selects := queryparser.Select{
		Fields: []string{"title", "parent_id", "content", "metadata"},
	}

	query, args, err := querybuilder.BuildQuery("items", filters, selects)
	if err != nil {
		return nil, fmt.Errorf("error building query: %w", err)
	}

	var existingItem PartialUpdateItem
	err = tx.QueryRow(ctx, query, args...).Scan(
		&existingItem.Title,
		&existingItem.ParentID,
		&existingItem.Content,
		&existingItem.Metadata,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, ErrItemNotFound
		}
		return nil, err
	}
	return &existingItem, nil
}

func buildPartialUpdateQuery(id uuid.UUID, existing, new *PartialUpdateItem) (string, []interface{}) {
	updates := []string{}
	args := []interface{}{id}
	argIndex := 2

	if new.Title != "" && new.Title != existing.Title {
		updates = append(updates, fmt.Sprintf("title = $%d", argIndex))
		args = append(args, new.Title)
		argIndex++
	}

	if new.ParentID != nil {
		if *new.ParentID == uuid.Nil && existing.ParentID != nil {
			updates = append(updates, "parent_id = NULL")
		} else if *new.ParentID != uuid.Nil && !uuidEqual(new.ParentID, existing.ParentID) {
			updates = append(updates, fmt.Sprintf("parent_id = $%d", argIndex))
			args = append(args, *new.ParentID)
			argIndex++
		}
	}

	if new.Content != nil && !jsonRawMessageEqual(new.Content, existing.Content) {
		updates = append(updates, fmt.Sprintf("content = $%d", argIndex))
		args = append(args, new.Content)
		argIndex++
	}

	if new.Metadata != nil && !mapEqual(new.Metadata, existing.Metadata) {
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

func isValidID(ctx context.Context, tx pgx.Tx, id uuid.UUID) (bool, error) {
	var exists bool
	err := tx.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM items WHERE id = $1)", id).Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}

func (i *ItemsHandler) createItem(ctx context.Context, item *Item) error {
	if item.Title == "" {
		return ErrEmptyItemTitle
	}
	if err := item.validateContent(); err != nil {
		return err
	}
	if err := item.validateMetadata(); err != nil {
		return err
	}

	return i.db.ExecuteTransaction(ctx, func(tx pgx.Tx) error {
		if item.ParentID != nil {
			exists, err := isValidID(ctx, tx, *item.ParentID)
			if err != nil {
				return fmt.Errorf("error checking parent existence: %w", err)
			}
			if !exists {
				return ErrParentItemNotFound
			}
		}

		query := `
					INSERT INTO items (title, parent_id, content, metadata)
					VALUES ($1, $2, $3, $4)
					RETURNING id, created_at, updated_at`

		var parentID interface{}
		if item.ParentID != nil {
			parentID = *item.ParentID
		} else {
			parentID = nil
		}

		err := tx.QueryRow(ctx, query,
			item.Title,
			parentID,
			item.Content,
			item.Metadata,
		).Scan(&item.ID, &item.CreatedAt, &item.UpdatedAt)

		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				return ErrNoItemCreated
			}
			return fmt.Errorf("error creating item: %w", err)
		}

		return nil
	})
}

func (i *ItemsHandler) getAllItems(ctx context.Context, query string, args ...interface{}) ([]map[string]interface{}, error) {
	rows, err := i.db.ExecuteQuery(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to get items: %w", err)
	}
	defer rows.Close()

	var items []map[string]interface{}
	for rows.Next() {
		rawItem, err := pgx.RowToMap(rows)
		if err != nil {
			return nil, fmt.Errorf("failed to scan item: %w", err)
		}
		fmt.Printf("rawItem: %v\n", rawItem)
		reshapedItem := reshapeResponse(rawItem, i.logger)
		items = append(items, reshapedItem)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating over items: %w", err)
	}

	return items, nil
}

func (i *ItemsHandler) updateFullItem(ctx context.Context, itemUUID uuid.UUID, updateItem *FullUpdateItem) (*Item, error) {
	var updatedItem Item

	err := i.db.ExecuteTransaction(ctx, func(tx pgx.Tx) error {
		_, err := getExistingItem(ctx, tx, itemUUID.String())
		if err != nil {
			return err
		}

		if updateItem.ParentID != nil {
			if err := validateParentID(ctx, tx, itemUUID, updateItem.ParentID); err != nil {
				return err
			}
		}

		query := `
			UPDATE items
			SET title = $1, parent_id = $2, content = $3, metadata = $4, updated_at = NOW()
			WHERE id = $5
			RETURNING id, title, parent_id, content, metadata, created_at, updated_at
		`

		err = tx.QueryRow(ctx, query,
			updateItem.Title,
			updateItem.ParentID,
			updateItem.Content,
			updateItem.Metadata,
			itemUUID,
		).Scan(
			&updatedItem.ID,
			&updatedItem.Title,
			&updatedItem.ParentID,
			&updatedItem.Content,
			&updatedItem.Metadata,
			&updatedItem.CreatedAt,
			&updatedItem.UpdatedAt,
		)

		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				return ErrItemNotFound
			}
			return fmt.Errorf("error updating item: %w", err)
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return &updatedItem, nil
}

func (i *ItemsHandler) deleteItem(ctx context.Context, id uuid.UUID) error {
	return i.db.ExecuteTransaction(ctx, func(tx pgx.Tx) error {
		_, err := getExistingItem(ctx, tx, id.String())
		if err != nil {
			return err
		}

		query := "UPDATE items SET parent_id = NULL WHERE parent_id = $1"
		_, err = tx.Exec(ctx, query, id)
		if err != nil {
			return fmt.Errorf("error updating parent_id: %w", err)
		}

		query = "DELETE FROM items WHERE id = $1"
		_, err = tx.Exec(ctx, query, id)
		if err != nil {
			return fmt.Errorf("error deleting item: %w", err)
		}

		return nil
	})
}

func (i *ItemsHandler) getChildren(ctx context.Context, id uuid.UUID, filters []queryparser.Filter, selects queryparser.Select) ([]map[string]interface{}, error) {
	parentFilter := queryparser.Filter{
		Field:    "parent_id",
		Operator: "eq",
		Value:    id.String(),
	}
	filters = append(filters, parentFilter)

	query, args, err := querybuilder.BuildQuery("items", filters, selects)
	if err != nil {
		return nil, fmt.Errorf("error building query: %w", err)
	}

	i.logger.Debugf("query: %s", query)

	rows, err := i.db.ExecuteQuery(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to get children: %w", err)
	}
	defer rows.Close()

	var children []map[string]interface{}
	for rows.Next() {
		rawItem, err := pgx.RowToMap(rows)
		if err != nil {
			return nil, fmt.Errorf("failed to scan item: %w", err)
		}
		reshapedItem := reshapeResponse(rawItem, i.logger)
		children = append(children, reshapedItem)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating over items: %w", err)
	}

	return children, nil
}

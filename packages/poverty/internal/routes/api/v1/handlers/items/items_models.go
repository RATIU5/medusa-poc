package v1HandlersItem

import (
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type Item struct {
	ID        uuid.UUID       `json:"id"`
	Title     string          `json:"title"`
	ParentID  *uuid.UUID      `json:"parent_id,omitempty"`
	Content   json.RawMessage `json:"content"`
	Metadata  json.RawMessage `json:"metadata,omitempty"`
	CreatedAt time.Time       `json:"created_at"`
	UpdatedAt time.Time       `json:"updated_at"`
}

func (i *Item) Print() {
	fmt.Printf("ID: %s\n", i.ID)
	fmt.Printf("Title: %s\n", i.Title)
	fmt.Printf("ParentID: %s\n", i.ParentID)
	fmt.Printf("Content: %s\n", i.Content)
	fmt.Printf("Metadata: %s\n", i.Metadata)
	fmt.Printf("CreatedAt: %s\n", i.CreatedAt)
	fmt.Printf("UpdatedAt: %s\n", i.UpdatedAt)
}

func (item *Item) validateContent() error {
	return validateJSONObject(item.Content, "content")
}

func (item *Item) validateMetadata() error {
	return validateJSONObject(item.Metadata, "metadata")
}

type PartialUpdateItem struct {
	Title    string                 `json:"title"`
	Content  json.RawMessage        `json:"content"`
	Metadata map[string]interface{} `json:"metadata,omitempty"`
	ParentID *uuid.UUID             `json:"parent_id,omitempty"`
}

func parseUpdateItemRequest(c *fiber.Ctx) (*PartialUpdateItem, error) {
	var requestBody map[string]interface{}
	if err := c.BodyParser(&requestBody); err != nil {
		return nil, ErrInvalidRequestBody
	}

	newItem := new(PartialUpdateItem)
	if title, ok := requestBody["title"].(string); ok {
		newItem.Title = title
	}
	if content, ok := requestBody["content"].(json.RawMessage); ok {
		newItem.Content = content
	}
	if metadata, ok := requestBody["metadata"].(map[string]interface{}); ok {
		newItem.Metadata = metadata
	}
	if parentID, ok := requestBody["parent_id"]; ok {
		if parentIDStr, ok := parentID.(string); ok {
			if parentIDStr == "" {
				nilUUID := uuid.Nil
				newItem.ParentID = &nilUUID
			} else {
				parsedUUID, err := uuid.Parse(parentIDStr)
				if err != nil {
					return nil, ErrInvalidParentID
				}
				newItem.ParentID = &parsedUUID
			}
		}
	}

	return newItem, nil
}

type FullUpdateItem struct {
	Title    string                 `json:"title"`
	ParentID *uuid.UUID             `json:"parent_id"`
	Content  json.RawMessage        `json:"content"`
	Metadata map[string]interface{} `json:"metadata"`
}

func validateUpdateItemRequest(item *FullUpdateItem) error {
	if item.Title == "" {
		return errors.New("title is required")
	}
	if len(item.Content) == 0 {
		return errors.New("content is required")
	}
	return nil
}

func (i *Item) MarshalJSON() ([]byte, error) {
	type Alias Item
	return json.Marshal(&struct {
		*Alias
		ParentID *string `json:"parent_id,omitempty"`
	}{
		Alias:    (*Alias)(i),
		ParentID: uuidPtrToStringPtr(i.ParentID),
	})
}

// UnmarshalJSON implements custom JSON unmarshaling for Item
func (i *Item) UnmarshalJSON(data []byte) error {
	type Alias Item
	aux := &struct {
		*Alias
		ParentID *string `json:"parent_id,omitempty"`
	}{
		Alias: (*Alias)(i),
	}
	if err := json.Unmarshal(data, &aux); err != nil {
		return err
	}
	var err error
	i.ParentID, err = stringPtrToUUIDPtr(aux.ParentID)
	return err
}

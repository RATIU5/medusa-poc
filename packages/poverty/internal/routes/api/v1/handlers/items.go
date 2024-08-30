package v1handlers

import (
	"github.com/RATIU5/medusa-poc/internal/database"
)

type ItemsHandler struct {
	db *database.Database
}

func NewItemsHandler(db *database.Database) *ItemsHandler {
	return &ItemsHandler{db: db}
}

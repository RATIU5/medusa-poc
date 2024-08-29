package health

import (
	"github.com/RATIU5/medusa-poc/internal/database"
	"github.com/charmbracelet/log"
	"github.com/gofiber/fiber/v2"
)

type HealthHandler struct {
	db  *database.Database
	app *fiber.App
}

func NewHandler(app *fiber.App, db *database.Database) *HealthHandler {
	return &HealthHandler{
		db:  db,
		app: app,
	}
}

func (h *HealthHandler) Handler(c *fiber.Ctx) error {
	err := h.db.Ping()
	if err != nil {
		logger, _ := c.Locals("logger").(*log.Logger)
		logger.Error("failed to ping database", "error", err)
		return c.Status(fiber.StatusOK).SendString("not ok")
	}
	return c.Status(fiber.StatusOK).SendString("ok")
}

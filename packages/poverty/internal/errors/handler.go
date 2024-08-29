package errors

import (
	"github.com/RATIU5/medusa-poc/internal/constants"
	"github.com/charmbracelet/log"
	"github.com/gofiber/fiber/v2"
)

func Handler(l *log.Logger, c *fiber.Ctx, err error) error {
	if e, ok := err.(*AppError); ok {
		l.Errorf("%s %d: %s", e.Code, e.StatusCode, e.DevMessage)
		return c.Status(e.StatusCode).JSON(fiber.Map{
			"error": e.Message,
			"code":  e.Code,
		})
	}

	return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
		"error": "an unexpected error occurred",
		"code":  constants.ErrCodeInternal,
	})
}

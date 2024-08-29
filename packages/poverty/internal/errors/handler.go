package errors

import (
	"github.com/RATIU5/medusa-poc/internal/constants"
	"github.com/RATIU5/medusa-poc/internal/logger"
	"github.com/gofiber/fiber/v2"
)

func Handler(l *logger.Logger, c *fiber.Ctx, err error) error {
	if e, ok := err.(*AppError); ok {
		logPrettyError(l, e)
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

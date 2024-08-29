package middleware

import (
	"errors"

	"github.com/charmbracelet/log"
	"github.com/gofiber/fiber/v2"
)

func ErrorHandler(logger *log.Logger) fiber.ErrorHandler {
	return func(c *fiber.Ctx, err error) error {
		code := fiber.StatusInternalServerError

		var e *fiber.Error
		if errors.As(err, &e) {
			code = e.Code
		}

		logger.Error("fiber error", "error", err, "path", c.Path(), "code", code)

		switch code {
		case fiber.StatusNotFound:
			return c.Status(code).JSON(fiber.Map{
				"error": "Not Found",
			})
		case fiber.StatusBadRequest:
			return c.Status(code).JSON(fiber.Map{
				"error": "Bad Request",
			})
		case fiber.StatusUnauthorized:
			return c.Status(code).JSON(fiber.Map{
				"error": "Unauthorized",
			})
		case fiber.StatusForbidden:
			return c.Status(code).JSON(fiber.Map{
				"error": "Forbidden",
			})
		case fiber.StatusTooManyRequests:
			return c.Status(code).JSON(fiber.Map{
				"error": "Too Many Requests",
			})
		default:
			return c.Status(code).JSON(fiber.Map{
				"error": "Internal Server Error",
			})
		}
	}
}

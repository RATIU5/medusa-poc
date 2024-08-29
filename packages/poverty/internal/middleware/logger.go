package middleware

import (
	"time"

	"github.com/charmbracelet/log"
	"github.com/gofiber/fiber/v2"
)

func Logger(logger *log.Logger) fiber.Handler {
	return func(c *fiber.Ctx) error {
		c.Locals("logger", logger)
		start := time.Now()
		err := c.Next()
		logger.Info("request",
			"method", c.Method(),
			"path", c.Path(),
			"status", c.Response().StatusCode(),
			"latency", time.Since(start).Milliseconds())
		return err
	}
}

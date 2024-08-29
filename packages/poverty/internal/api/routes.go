package api

import (
	"github.com/RATIU5/medusa-poc/internal/errors"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Welcome to the CMS!")
	})

	app.Get("/error", func(c *fiber.Ctx) error {
		return errors.NewInternalError("Sample error; sample error; sample error; sample error; sample error;", nil)
	})
}

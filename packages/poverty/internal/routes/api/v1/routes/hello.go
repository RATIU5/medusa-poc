package v1routes

import "github.com/gofiber/fiber/v2"

func helloHandler(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"message": "Hello, World!",
	})
}

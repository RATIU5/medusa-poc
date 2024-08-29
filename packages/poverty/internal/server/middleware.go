package server

import (
	"github.com/RATIU5/medusa-poc/internal/middleware"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/favicon"
)

func setupMiddleware(s *Server) {
	s.app.Use(middleware.Logger(s.logger))

	// Send 204 for favicon requests
	s.app.Use(favicon.New(favicon.Config{
		Next: func(c *fiber.Ctx) bool {
			return false
		},
	}))
}

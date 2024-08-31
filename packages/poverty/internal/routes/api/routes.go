package api

import (
	"github.com/RATIU5/medusa-poc/internal/config"
	"github.com/RATIU5/medusa-poc/internal/database"
	apimiddleware "github.com/RATIU5/medusa-poc/internal/routes/api/middleware"
	v1 "github.com/RATIU5/medusa-poc/internal/routes/api/v1"
	"github.com/charmbracelet/log"
	"github.com/gofiber/fiber/v2"
)

func SetupApiRoutes(app *fiber.App, db *database.Database, cfg *config.Config, logger *log.Logger) {
	api := app.Group("/api")
	api.Use(apimiddleware.AuthMiddleware(cfg.Server.SecretKey, logger))

	v1.SetupRoutes(api, db, logger)
}

package main

import (
	"fmt"
	"log"

	"github.com/RATIU5/medusa-poc/internal/api"
	"github.com/RATIU5/medusa-poc/internal/config"
	"github.com/RATIU5/medusa-poc/internal/errors"
	"github.com/RATIU5/medusa-poc/internal/logger"
	"github.com/gofiber/fiber/v2"
)


func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	appLogger := logger.NewLogger(cfg.Logging.Level)

	app := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			return errors.Handler(appLogger, c, err)
		},
	})

	app.Use(logger.Middleware(appLogger))

	api.SetupRoutes(app)

	appLogger.Info("Starting server on %s:%d", cfg.Server.Host, cfg.Server.Port)
	log.Fatal(app.Listen(fmt.Sprintf("%s:%d", cfg.Server.Host, cfg.Server.Port)))
}
package server

import (
	"fmt"

	"github.com/RATIU5/medusa-poc/internal/config"
	"github.com/RATIU5/medusa-poc/internal/database"
	"github.com/RATIU5/medusa-poc/internal/middleware"
	"github.com/charmbracelet/log"
	"github.com/gofiber/fiber/v2"
)

type Server struct {
	app    *fiber.App
	cfg    *config.Config
	db     *database.Database
	logger *log.Logger
}

func New(cfg *config.Config, db *database.Database, logger *log.Logger) (*Server, error) {
	app := fiber.New(fiber.Config{
		ErrorHandler: middleware.ErrorHandler(logger),
	})

	return &Server{
		app:    app,
		cfg:    cfg,
		db:     db,
		logger: logger,
	}, nil
}

func (s *Server) Start() error {
	addr := fmt.Sprintf("%s:%d", s.cfg.Server.Host, s.cfg.Server.Port)

	setupMiddleware(s)
	setupRoutes(s)

	for _, route := range s.app.GetRoutes() {
		fmt.Printf("Method: %s, Path: %s, Handler: %s\n", route.Method, route.Path, route.Name)
	}

	return s.app.Listen(addr)
}

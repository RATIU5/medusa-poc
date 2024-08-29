package server

import (
	"github.com/RATIU5/medusa-poc/internal/routes/api"
	"github.com/RATIU5/medusa-poc/internal/routes/health"
)

func setupRoutes(s *Server) {
	// Health check route
	healthHandler := health.NewHandler(s.app, s.db)
	s.app.Get("/health", healthHandler.Handler)

	api.SetupApiRoutes(s.app, s.db, s.cfg, s.logger)
}

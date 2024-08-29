package main

import (
	"os"

	"github.com/RATIU5/medusa-poc/internal/config"
	"github.com/RATIU5/medusa-poc/internal/database"
	"github.com/RATIU5/medusa-poc/internal/server"
	"github.com/charmbracelet/log"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	logger := log.NewWithOptions(os.Stderr, log.Options{
		ReportCaller:    true,
		ReportTimestamp: true,
	})
	logger.SetLevel(log.DebugLevel)

	db, err := database.NewDatabase(cfg.Database)
	if err != nil {
		logger.Fatalf("failed to connect to database: %v", err)
	}

	server, err := server.New(cfg, db, logger)
	if err != nil {
		logger.Fatalf("failed to create server: %v", err)
	}

	if err := server.Start(); err != nil {
		logger.Fatalf("failed to start server: %v", err)
	}
}

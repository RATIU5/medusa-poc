package database

import (
	"context"
	"fmt"
	"time"

	"github.com/RATIU5/medusa-poc/internal/config"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Database struct {
	pool       *pgxpool.Pool
	maxRetries int
	retryDelay time.Duration
}

func NewDatabase(cfg config.DatabaseConfig) (*Database, error) {
	config, err := pgxpool.ParseConfig(cfg.ConnectionUrl)
	if err != nil {
		return nil, fmt.Errorf("error parsing db url: %w", err)
	}

	config.MinConns = int32(cfg.MinOpenConns)
	config.MaxConns = int32(cfg.MaxOpenConns)
	config.MaxConnLifetime = time.Duration(cfg.MaxConnLifetime) * time.Minute
	config.MaxConnIdleTime = time.Duration(cfg.MaxIdleLifetime) * time.Minute
	config.HealthCheckPeriod = time.Duration(cfg.HealthCheckPeriod) * time.Minute

	pool, err := pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		return nil, fmt.Errorf("error creating db pool: %w", err)
	}

	return &Database{
		pool:       pool,
		maxRetries: cfg.MaxRetries,
		retryDelay: time.Duration(cfg.RetryDelay) * time.Second,
	}, nil
}

func (db *Database) Close() {
	db.pool.Close()
}

func (db *Database) ExecuteQuery(ctx context.Context, query string, args ...interface{}) (pgx.Rows, error) {
	var rows pgx.Rows
	var err error

	for i := 0; i <= db.maxRetries; i++ {
		rows, err = db.pool.Query(ctx, query, args...)
		if err == nil {
			break
		}

		if !db.IsRetryableError(err) {
			break
		}

		if i < db.maxRetries {
			time.Sleep(db.retryDelay)
		}
	}

	return rows, err
}

func (db *Database) ExecuteQueryRow(ctx context.Context, query string, args ...interface{}) pgx.Row {
	return db.pool.QueryRow(ctx, query, args...)
}

func (db *Database) ExecuteTransaction(ctx context.Context, txFunc func(pgx.Tx) error) error {
	tx, err := db.pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("error starting transaction: %w", err)
	}

	if err := txFunc(tx); err != nil {
		if rbErr := tx.Rollback(ctx); rbErr != nil {
			return fmt.Errorf("error rolling back transaction: %v (original error: %w)", rbErr, err)
		}
		return err
	}

	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("error committing transaction: %w", err)
	}

	return nil
}

func (db *Database) IsRetryableError(err error) bool {
	// Implement logic to determine if an error is retriable
	// This could include checking for network errors, deadlocks, etc.
	return false // placeholder
}
func (db *Database) Ping() error {
	err := db.pool.Ping(context.Background())
	if err != nil {
		fmt.Printf("error pinging database: %v\n", err)
		return err
	}
	return nil
}

package database

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	_ "github.com/lib/pq"
	"github.com/pressly/goose/v3"

	"github.com/DaniilKalts/dmark-todo-list/internal/infrastructure/config"
)

func NewPostgres(cfg *config.PostgresConfig) (*sql.DB, error) {
	dsn := fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		cfg.Host,
		cfg.Port,
		cfg.User,
		cfg.Password,
		cfg.DB,
		cfg.SSLMode,
	)

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, err
	}

	db.SetMaxOpenConns(20)
	db.SetMaxIdleConns(10)
	db.SetConnMaxIdleTime(5 * time.Minute)
	db.SetConnMaxLifetime(30 * time.Minute)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)

	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		if err := db.Close(); err != nil {
			return nil, fmt.Errorf(
				"failed to close database connection: %w", err,
			)
		}
		return nil, fmt.Errorf("ping postgres: %w", err)
	}

	migrationsDir := "./db/migrations"
	if err := goose.Up(db, migrationsDir); err != nil {
		return nil, fmt.Errorf("failed to apply migrations: %w", err)
	}

	return db, nil
}

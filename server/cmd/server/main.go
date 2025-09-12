package main

import (
	"log"

	"github.com/DaniilKalts/dmark-todo-list/internal/infrastructure/adapters/http"
	"github.com/DaniilKalts/dmark-todo-list/internal/infrastructure/adapters/http/handlers"
	"github.com/DaniilKalts/dmark-todo-list/internal/infrastructure/repositories"
	"github.com/DaniilKalts/dmark-todo-list/internal/infrastructure/repositories/sqlc"
	"github.com/DaniilKalts/dmark-todo-list/internal/infrastructure/services"

	// Библиотека для красивого вывода структур
	"github.com/goforj/godump"

	"github.com/DaniilKalts/dmark-todo-list/internal/infrastructure/adapters/database"
	"github.com/DaniilKalts/dmark-todo-list/internal/infrastructure/config"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	godump.Dump(cfg)

	db, err := database.NewPostgres(&cfg.PostgresConfig)
	if err != nil {
		log.Fatalf("failed to initialize postgres: %v", err)
	}

	defer db.Close()

	queries := sqlc.New(db)

	taskRepo := repositories.NewTaskRepository(queries)
	taskService := services.NewTaskService(taskRepo)
	taskHandler := handlers.NewTaskHandler(taskService)

	server := http.NewServer(taskHandler)

	if err := server.Start(cfg.ServerConfig.Port); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}

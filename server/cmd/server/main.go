package main

import (
	"log"

	// Библиотека для красивого вывода структур
	"github.com/goforj/godump"

	"github.com/DaniilKalts/dmark-todo-list/internal/infrastructure/config"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	godump.Dump(cfg)
}

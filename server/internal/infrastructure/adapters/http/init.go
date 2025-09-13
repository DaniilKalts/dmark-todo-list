package http

import (
	"fmt"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"

	"github.com/DaniilKalts/dmark-todo-list/internal/infrastructure/adapters/http/handlers"
)

type Server struct {
	app *fiber.App
}

func NewServer(taskHandler *handlers.TaskHandler) *Server {
	app := fiber.New()

	app.Use(
		cors.New(
			cors.Config{
				AllowHeaders:     []string{"*"},
				AllowOrigins:     []string{"*"},
				AllowCredentials: false,
				AllowMethods: []string{
					fiber.MethodPost,
					fiber.MethodGet,
					fiber.MethodPatch,
					fiber.MethodDelete,
				},
			},
		),
	)

	api := app.Group("/api/v1")
	taskGroup := api.Group("/tasks")

	taskGroup.Post("/", taskHandler.Create)
	taskGroup.Get("/", taskHandler.List)
	taskGroup.Patch("/:id/done", taskHandler.Complete)
	taskGroup.Patch("/:id/undone", taskHandler.Reopen)
	taskGroup.Patch("/:id", taskHandler.Delete)

	return &Server{app: app}
}

func (s *Server) Start(port int) error {
	if port == 0 {
		port = 8080
	}
	addr := fmt.Sprintf(":%d", port)

	return s.app.Listen(addr)
}

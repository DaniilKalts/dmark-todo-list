package handlers

import (
	"encoding/json"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"

	"github.com/DaniilKalts/dmark-todo-list/internal/application/ports"
	"github.com/DaniilKalts/dmark-todo-list/internal/infrastructure/adapters/http/dto"
)

type TaskHandler struct {
	svc ports.TaskService
}

func NewTaskHandler(svc ports.TaskService) *TaskHandler {
	return &TaskHandler{svc: svc}
}

func (h *TaskHandler) Create(ctx fiber.Ctx) error {
	raw := ctx.Body()

	var req dto.CreateTaskRequest
	if err := json.Unmarshal(raw, &req); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	resp, err := h.svc.Create(
		ctx, req.Title,
	)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return ctx.Status(fiber.StatusCreated).JSON(resp)
}

func (h *TaskHandler) List(ctx fiber.Ctx) error {
	filter := ctx.Query("filter")

	resp, err := h.svc.List(ctx, ports.TaskFilter(filter))
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return ctx.Status(fiber.StatusOK).JSON(resp)
}

func (h *TaskHandler) Complete(ctx fiber.Ctx) error {
	idStr := ctx.Params("id")

	id, err := uuid.Parse(idStr)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	err = h.svc.Complete(ctx, id)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return ctx.Status(fiber.StatusNoContent).JSON(fiber.Map{})
}

func (h *TaskHandler) Reopen(ctx fiber.Ctx) error {
	idStr := ctx.Params("id")

	id, err := uuid.Parse(idStr)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	err = h.svc.Reopen(ctx, id)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return ctx.Status(fiber.StatusNoContent).JSON(fiber.Map{})
}

func (h *TaskHandler) Delete(ctx fiber.Ctx) error {
	idStr := ctx.Params("id")

	id, err := uuid.Parse(idStr)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	err = h.svc.Delete(ctx, id)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return ctx.Status(fiber.StatusNoContent).JSON(fiber.Map{})
}

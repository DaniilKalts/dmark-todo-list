package handlers

import (
	"encoding/json"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"

	"github.com/DaniilKalts/dmark-todo-list/internal/application/ports"
	"github.com/DaniilKalts/dmark-todo-list/internal/infrastructure/adapters/http/dto"
	"github.com/DaniilKalts/dmark-todo-list/pkg/httphelpers"

	validatorutil "github.com/DaniilKalts/dmark-todo-list/pkg/validator"
)

var validate = validator.New()

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

	if err := validate.Struct(req); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(
			fiber.Map{
				"error": validatorutil.TranslateValidationError(err),
			},
		)
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
	id, err := httphelpers.ParseUUIDParam(ctx, "id")
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid UUID"})
	}

	err = h.svc.Complete(ctx, id)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return ctx.Status(fiber.StatusNoContent).JSON(fiber.Map{})
}

func (h *TaskHandler) Reopen(ctx fiber.Ctx) error {
	id, err := httphelpers.ParseUUIDParam(ctx, "id")
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid UUID"})
	}

	err = h.svc.Reopen(ctx, id)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return ctx.Status(fiber.StatusNoContent).JSON(fiber.Map{})
}

func (h *TaskHandler) Delete(ctx fiber.Ctx) error {
	id, err := httphelpers.ParseUUIDParam(ctx, "id")
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid UUID"})
	}

	err = h.svc.Delete(ctx, id)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return ctx.Status(fiber.StatusNoContent).JSON(fiber.Map{})
}

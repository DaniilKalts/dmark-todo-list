package handlers

import (
	"encoding/json"
	"errors"

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

func parseFilter(q string) (ports.TaskFilter, error) {
	switch q {
	case "pending":
		return ports.FilterPending, nil
	case "completed":
		return ports.FilterCompleted, nil
	case "deleted":
		return ports.FilterDeleted, nil
	case "":
		return "", nil
	default:
		return "", errors.New("invalid filter")
	}
}

func parseOrder(q string) (ports.SortOrder, error) {
	switch q {
	case "asc":
		return ports.SortAsc, nil
	case "desc", "":
		return ports.SortDesc, nil
	default:
		return "", errors.New("invalid sort order")
	}
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
	filter, err := parseFilter(ctx.Query("filter"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	order, err := parseOrder(ctx.Query("order"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	resp, err := h.svc.List(ctx, filter, order)
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

	return ctx.SendStatus(fiber.StatusNoContent)
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

	return ctx.SendStatus(fiber.StatusNoContent)
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

	return ctx.SendStatus(fiber.StatusNoContent)
}

func (h *TaskHandler) Restore(ctx fiber.Ctx) error {
	id, err := httphelpers.ParseUUIDParam(ctx, "id")
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid UUID"})
	}

	err = h.svc.Restore(ctx, id)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return ctx.SendStatus(fiber.StatusNoContent)
}

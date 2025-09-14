package handlers

import (
	"encoding/json"
	"errors"

	"github.com/DaniilKalts/dmark-todo-list/internal/application/domain"
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

func parseSortBy(q string) (ports.SortBy, error) {
	if q == "" {
		return "", nil
	}
	switch q {
	case "created_at":
		return ports.SortByCreatedAt, nil
	case "priority":
		return ports.SortByPriority, nil
	case "completed_at":
		return ports.SortByCompletedAt, nil
	case "deleted_at":
		return ports.SortByDeletedAt, nil
	default:
		return "", errors.New("invalid sort field")
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
	var req dto.CreateTaskRequest
	if err := json.Unmarshal(ctx.Body(), &req); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	if err := validate.Struct(req); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": validatorutil.TranslateValidationError(err)})
	}

	var priority *domain.Priority
	if req.Priority != nil {
		p := domain.Priority(*req.Priority)
		priority = &p
	}

	task, err := h.svc.Create(ctx, req.Title, priority)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return ctx.Status(fiber.StatusCreated).JSON(task)
}

func (h *TaskHandler) SetPriority(ctx fiber.Ctx) error {
	id, err := httphelpers.ParseUUIDParam(ctx, "id")
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid UUID"})
	}

	var req dto.SetPriorityRequest
	if err := json.Unmarshal(ctx.Body(), &req); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	if err := validate.Struct(req); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": validatorutil.TranslateValidationError(err)})
	}

	if err := h.svc.SetPriority(ctx, id, domain.Priority(req.Priority)); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return ctx.SendStatus(fiber.StatusNoContent)
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

	sortBy, err := parseSortBy(ctx.Query("sort"))
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	resp, err := h.svc.List(ctx, filter, sortBy, order)
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

func (h *TaskHandler) SoftDelete(ctx fiber.Ctx) error {
	id, err := httphelpers.ParseUUIDParam(ctx, "id")
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid UUID"})
	}

	err = h.svc.SoftDelete(ctx, id)
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

func (h *TaskHandler) HardDelete(ctx fiber.Ctx) error {
	id, err := httphelpers.ParseUUIDParam(ctx, "id")
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid UUID"})
	}

	err = h.svc.HardDelete(ctx, id)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return ctx.SendStatus(fiber.StatusNoContent)
}

func (h *TaskHandler) EmptyTrash(ctx fiber.Ctx) error {
	err := h.svc.EmptyTrash(ctx)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return ctx.SendStatus(fiber.StatusNoContent)
}

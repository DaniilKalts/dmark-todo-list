package services

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/DaniilKalts/dmark-todo-list/internal/application/domain"
	"github.com/DaniilKalts/dmark-todo-list/internal/application/ports"
)

type taskService struct {
	repo ports.TaskRepository
}

func NewTaskService(repo ports.TaskRepository) ports.TaskService {
	return &taskService{repo: repo}
}

func (s *taskService) Create(
	ctx context.Context,
	title string,
	priority *domain.Priority,
) (domain.Task, error) {
	id, err := uuid.NewV7()
	if err != nil {
		return domain.Task{}, err
	}

	p := domain.PriorityMedium
	if priority != nil {
		if *priority >= domain.PriorityLow && *priority <= domain.PriorityHigh {
			p = *priority
		}
	}

	return s.repo.Create(ctx, id, title, p)
}

func (s *taskService) SetPriority(
	ctx context.Context, id uuid.UUID, priority domain.Priority,
) error {
	if priority < domain.PriorityLow || priority > domain.PriorityHigh {
		return fmt.Errorf("invalid priority")
	}
	return s.repo.SetPriority(ctx, id, priority)
}

func (s *taskService) List(
	ctx context.Context,
	filter ports.TaskFilter,
	sortBy ports.SortBy,
	order ports.SortOrder,
) ([]domain.Task, error) {
	if order == "" {
		order = ports.SortDesc
	}

	if sortBy == "" {
		switch filter {
		case ports.FilterCompleted:
			sortBy = ports.SortByCompletedAt
		case ports.FilterDeleted:
			sortBy = ports.SortByDeletedAt
		default:
			sortBy = ports.SortByCreatedAt
		}
	}

	switch filter {
	case ports.FilterPending:
		return s.repo.ListPending(ctx, sortBy, order)
	case ports.FilterCompleted:
		return s.repo.ListCompleted(ctx, sortBy, order)
	case ports.FilterDeleted:
		return s.repo.ListDeleted(ctx, sortBy, order)
	default:
		return s.repo.List(ctx, sortBy, order)
	}
}

func (s *taskService) Complete(ctx context.Context, id uuid.UUID) error {
	return s.repo.Complete(ctx, id)
}

func (s *taskService) Reopen(ctx context.Context, id uuid.UUID) error {
	return s.repo.Reopen(ctx, id)
}

func (s *taskService) SoftDelete(ctx context.Context, id uuid.UUID) error {
	return s.repo.SoftDelete(ctx, id)
}

func (s *taskService) Restore(ctx context.Context, id uuid.UUID) error {
	return s.repo.Restore(ctx, id)
}

func (s *taskService) HardDelete(ctx context.Context, id uuid.UUID) error {
	rows, err := s.repo.HardDelete(ctx, id)
	if err != nil {
		return err
	}
	if rows == 0 {
		return ports.ErrTaskNotDeleted
	}
	return nil
}

func (s *taskService) EmptyTrash(ctx context.Context) error {
	return s.repo.EmptyTrash(ctx)
}

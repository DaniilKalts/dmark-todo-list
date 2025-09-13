package services

import (
	"context"

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

func (s *taskService) Create(ctx context.Context, title string) (domain.Task, error) {
	id, err := uuid.NewV7()
	if err != nil {
		return domain.Task{}, err
	}

	return s.repo.Create(ctx, id, title)
}

func (s *taskService) List(ctx context.Context, filter ports.TaskFilter, order ports.SortOrder) (
	[]domain.Task,
	error,
) {
	if order == "" {
		order = ports.SortDesc
	}

	switch filter {
	case ports.FilterActive:
		return s.repo.ListActive(ctx, order)
	case ports.FilterCompleted:
		return s.repo.ListCompleted(ctx, order)
	case ports.FilterDeleted:
		return s.repo.ListDeleted(ctx, order)
	default:
		return s.repo.List(ctx, order)
	}
}

func (s *taskService) Complete(ctx context.Context, id uuid.UUID) error {
	return s.repo.MarkDone(ctx, id)
}

func (s *taskService) Reopen(ctx context.Context, id uuid.UUID) error {
	return s.repo.MarkUndone(ctx, id)
}

func (s *taskService) Delete(ctx context.Context, id uuid.UUID) error {
	return s.repo.SoftDelete(ctx, id)
}

func (s *taskService) Restore(ctx context.Context, id uuid.UUID) error {
	return s.repo.Restore(ctx, id)
}

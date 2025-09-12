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

func (s *taskService) CreateTask(ctx context.Context, task domain.Task) (domain.Task, error) {
	return s.repo.Create(ctx, task)
}

func (s *taskService) ListTasks(ctx context.Context, filter ports.TaskFilter) (
	[]domain.Task,
	error,
) {
	switch filter {
	case ports.FilterActive:
		return s.repo.ListActive(ctx)
	case ports.FilterCompleted:
		return s.repo.ListCompleted(ctx)
	default:
		return s.repo.List(ctx)
	}
}

func (s *taskService) Complete(ctx context.Context, id uuid.UUID) error {
	return s.repo.MarkDone(ctx, id)
}

func (s *taskService) Reopen(ctx context.Context, id uuid.UUID) error {
	return s.repo.MarkUndone(ctx, id)
}

func (s *taskService) DeleteTask(ctx context.Context, id uuid.UUID) error {
	return s.repo.SoftDelete(ctx, id)
}

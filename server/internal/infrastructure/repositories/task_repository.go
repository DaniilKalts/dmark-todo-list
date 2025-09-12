package repositories

import (
	"context"

	"github.com/google/uuid"

	"github.com/DaniilKalts/dmark-todo-list/internal/application/domain"
	"github.com/DaniilKalts/dmark-todo-list/internal/application/ports"
	"github.com/DaniilKalts/dmark-todo-list/internal/infrastructure/repositories/sqlc"
)

type taskRepo struct {
	q *sqlc.Queries
}

func NewTaskRepository(q *sqlc.Queries) ports.TaskRepository {
	return &taskRepo{q: q}
}

func (r *taskRepo) Create(ctx context.Context, task domain.Task) (domain.Task, error) {
	params := sqlc.CreateTaskParams{
		ID:    task.ID,
		Title: task.Title,
	}

	row, err := r.q.CreateTask(ctx, params)
	if err != nil {
		return domain.Task{}, err
	}

	return domain.Task{
		ID:        row.ID,
		Title:     row.Title,
		IsDone:    row.IsDone,
		CreatedAt: row.CreatedAt,
		UpdatedAt: row.UpdatedAt,
	}, err
}

func (r *taskRepo) List(ctx context.Context) ([]domain.Task, error) {
	rows, err := r.q.ListTasks(ctx)
	if err != nil {
		return nil, err
	}

	tasks := make([]domain.Task, len(rows))
	for i, row := range rows {
		tasks[i] = domain.Task{
			ID:        row.ID,
			Title:     row.Title,
			IsDone:    row.IsDone,
			CreatedAt: row.CreatedAt,
			UpdatedAt: row.UpdatedAt,
		}
	}

	return tasks, nil
}

func (r *taskRepo) ListActive(ctx context.Context) ([]domain.Task, error) {
	rows, err := r.q.ListActiveTasks(ctx)
	if err != nil {
		return nil, err
	}

	tasks := make([]domain.Task, len(rows))
	for i, row := range rows {
		tasks[i] = domain.Task{
			ID:        row.ID,
			Title:     row.Title,
			IsDone:    row.IsDone,
			CreatedAt: row.CreatedAt,
			UpdatedAt: row.UpdatedAt,
		}
	}

	return tasks, nil
}

func (r *taskRepo) ListCompleted(ctx context.Context) ([]domain.Task, error) {
	rows, err := r.q.ListCompletedTasks(ctx)
	if err != nil {
		return nil, err
	}

	tasks := make([]domain.Task, len(rows))
	for i, row := range rows {
		tasks[i] = domain.Task{
			ID:        row.ID,
			Title:     row.Title,
			IsDone:    row.IsDone,
			CreatedAt: row.CreatedAt,
			UpdatedAt: row.UpdatedAt,
		}
	}

	return tasks, nil
}

func (r *taskRepo) MarkDone(ctx context.Context, id uuid.UUID) error {
	return r.q.MarkTaskDone(ctx, id)
}

func (r *taskRepo) MarkUndone(ctx context.Context, id uuid.UUID) error {
	return r.q.MarkTaskUndone(ctx, id)
}

func (r *taskRepo) SoftDelete(ctx context.Context, id uuid.UUID) error {
	return r.q.SoftDeleteTask(ctx, id)
}

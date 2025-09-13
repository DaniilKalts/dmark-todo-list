package repositories

import (
	"context"
	"time"

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

// Вспомогательная функция, чтобы не дублировать код мапинга строки из SQLC в структуру домена
func mapRowToDomain(row sqlc.Task) domain.Task {
	return domain.Task{
		ID:        row.ID,
		Title:     row.Title,
		CreatedAt: row.CreatedAt,
		UpdatedAt: row.UpdatedAt,
		CompletedAt: func() *time.Time {
			if row.CompletedAt.Valid {
				t := row.CompletedAt.Time
				return &t
			}
			return nil
		}(),
		DeletedAt: func() *time.Time {
			if row.DeletedAt.Valid {
				t := row.DeletedAt.Time
				return &t
			}
			return nil
		}(),
	}
}

func (r *taskRepo) Create(ctx context.Context, id uuid.UUID, title string) (domain.Task, error) {
	params := sqlc.CreateTaskParams{
		ID:    id,
		Title: title,
	}

	row, err := r.q.CreateTask(ctx, params)
	if err != nil {
		return domain.Task{}, err
	}

	return mapRowToDomain(row), nil
}

func (r *taskRepo) List(ctx context.Context, order ports.SortOrder) ([]domain.Task, error) {
	rows, err := r.q.ListTasks(ctx, string(order))
	if err != nil {
		return nil, err
	}

	tasks := make([]domain.Task, len(rows))
	for i, row := range rows {
		tasks[i] = mapRowToDomain(row)
	}

	return tasks, nil
}

func (r *taskRepo) ListPending(ctx context.Context, order ports.SortOrder) ([]domain.Task, error) {
	rows, err := r.q.ListPendingTasks(ctx, order)
	if err != nil {
		return nil, err
	}

	tasks := make([]domain.Task, len(rows))
	for i, row := range rows {
		tasks[i] = mapRowToDomain(row)
	}

	return tasks, nil
}

func (r *taskRepo) ListCompleted(ctx context.Context, order ports.SortOrder) (
	[]domain.Task, error,
) {
	rows, err := r.q.ListCompletedTasks(ctx, order)
	if err != nil {
		return nil, err
	}

	tasks := make([]domain.Task, len(rows))
	for i, row := range rows {
		tasks[i] = mapRowToDomain(row)
	}

	return tasks, nil
}

func (r *taskRepo) ListDeleted(ctx context.Context, order ports.SortOrder) ([]domain.Task, error) {
	rows, err := r.q.ListDeletedTasks(ctx, order)
	if err != nil {
		return nil, err
	}

	tasks := make([]domain.Task, len(rows))
	for i, row := range rows {
		tasks[i] = mapRowToDomain(row)
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

func (r *taskRepo) Restore(ctx context.Context, id uuid.UUID) error {
	return r.q.RestoreDeletedTask(ctx, id)
}

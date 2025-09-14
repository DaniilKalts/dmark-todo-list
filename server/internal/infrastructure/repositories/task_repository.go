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
		Priority:  domain.Priority(row.Priority),
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

func (r *taskRepo) Create(
	ctx context.Context,
	id uuid.UUID,
	title string,
	priority domain.Priority,
) (domain.Task, error) {
	params := sqlc.CreateTaskParams{
		ID:       id,
		Title:    title,
		Priority: int16(priority),
	}

	row, err := r.q.CreateTask(ctx, params)
	if err != nil {
		return domain.Task{}, err
	}

	return mapRowToDomain(row), nil
}

func (r *taskRepo) SetPriority(
	ctx context.Context, id uuid.UUID, priority domain.Priority,
) error {
	return r.q.UpdateTaskPriority(
		ctx, sqlc.UpdateTaskPriorityParams{
			ID:       id,
			Priority: int16(priority),
		},
	)
}

func (r *taskRepo) List(
	ctx context.Context,
	sortBy ports.SortBy,
	order ports.SortOrder,
) ([]domain.Task, error) {
	rows, err := r.q.ListTasks(
		ctx, sqlc.ListTasksParams{
			SortBy:    string(sortBy),
			SortOrder: string(order),
		},
	)
	if err != nil {
		return nil, err
	}

	tasks := make([]domain.Task, len(rows))
	for i, row := range rows {
		tasks[i] = mapRowToDomain(row)
	}

	return tasks, nil
}

func (r *taskRepo) ListPending(
	ctx context.Context,
	sortBy ports.SortBy,
	order ports.SortOrder,
) ([]domain.Task, error) {
	rows, err := r.q.ListPendingTasks(
		ctx, sqlc.ListPendingTasksParams{
			SortBy:    string(sortBy),
			SortOrder: string(order),
		},
	)
	if err != nil {
		return nil, err
	}

	tasks := make([]domain.Task, len(rows))
	for i, row := range rows {
		tasks[i] = mapRowToDomain(row)
	}

	return tasks, nil
}

func (r *taskRepo) ListCompleted(
	ctx context.Context,
	sortBy ports.SortBy,
	order ports.SortOrder,
) ([]domain.Task, error) {
	rows, err := r.q.ListCompletedTasks(
		ctx, sqlc.ListCompletedTasksParams{
			SortBy:    string(sortBy),
			SortOrder: string(order),
		},
	)
	if err != nil {
		return nil, err
	}

	tasks := make([]domain.Task, len(rows))
	for i, row := range rows {
		tasks[i] = mapRowToDomain(row)
	}

	return tasks, nil
}

func (r *taskRepo) ListDeleted(
	ctx context.Context,
	sortBy ports.SortBy,
	order ports.SortOrder,
) ([]domain.Task, error) {
	rows, err := r.q.ListDeletedTasks(
		ctx, sqlc.ListDeletedTasksParams{
			SortBy:    string(sortBy),
			SortOrder: string(order),
		},
	)
	if err != nil {
		return nil, err
	}

	tasks := make([]domain.Task, len(rows))
	for i, row := range rows {
		tasks[i] = mapRowToDomain(row)
	}

	return tasks, nil
}

func (r *taskRepo) Complete(ctx context.Context, id uuid.UUID) error {
	return r.q.MarkTaskDone(ctx, id)
}

func (r *taskRepo) Reopen(ctx context.Context, id uuid.UUID) error {
	return r.q.MarkTaskUndone(ctx, id)
}

func (r *taskRepo) SoftDelete(ctx context.Context, id uuid.UUID) error {
	return r.q.SoftDeleteTask(ctx, id)
}

func (r *taskRepo) Restore(ctx context.Context, id uuid.UUID) error {
	return r.q.RestoreDeletedTask(ctx, id)
}

func (r *taskRepo) HardDelete(ctx context.Context, id uuid.UUID) (int64, error) {
	return r.q.HardDeleteTask(ctx, id)
}

func (r *taskRepo) EmptyTrash(ctx context.Context) error {
	return r.q.EmptyTrash(ctx)
}

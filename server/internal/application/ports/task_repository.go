package ports

import (
	"context"

	"github.com/google/uuid"

	"github.com/DaniilKalts/dmark-todo-list/internal/application/domain"
)

type TaskRepository interface {
	Create(ctx context.Context, id uuid.UUID, title string, priority domain.Priority) (
		domain.Task, error,
	)
	SetPriority(ctx context.Context, id uuid.UUID, priority domain.Priority) error
	List(ctx context.Context, sortBy SortBy, order SortOrder) ([]domain.Task, error)
	ListPending(ctx context.Context, sortBy SortBy, order SortOrder) ([]domain.Task, error)
	ListCompleted(ctx context.Context, sortBy SortBy, order SortOrder) ([]domain.Task, error)
	ListDeleted(ctx context.Context, sortBy SortBy, order SortOrder) ([]domain.Task, error)
	Complete(ctx context.Context, id uuid.UUID) error
	Reopen(ctx context.Context, id uuid.UUID) error
	SoftDelete(ctx context.Context, id uuid.UUID) error
	Restore(ctx context.Context, id uuid.UUID) error
	HardDelete(ctx context.Context, id uuid.UUID) (int64, error)
	EmptyTrash(ctx context.Context) error
}

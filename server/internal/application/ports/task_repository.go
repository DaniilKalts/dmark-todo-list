package ports

import (
	"context"

	"github.com/google/uuid"

	"github.com/DaniilKalts/dmark-todo-list/internal/application/domain"
)

type TaskRepository interface {
	Create(ctx context.Context, id uuid.UUID, title string) (domain.Task, error)
	List(ctx context.Context) ([]domain.Task, error)
	ListDeleted(ctx context.Context) ([]domain.Task, error)
	ListActive(ctx context.Context) ([]domain.Task, error)
	ListCompleted(ctx context.Context) ([]domain.Task, error)
	MarkDone(ctx context.Context, id uuid.UUID) error
	MarkUndone(ctx context.Context, id uuid.UUID) error
	SoftDelete(ctx context.Context, id uuid.UUID) error
	Restore(ctx context.Context, id uuid.UUID) error
}

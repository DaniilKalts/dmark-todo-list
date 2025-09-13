package ports

import (
	"context"

	"github.com/google/uuid"

	"github.com/DaniilKalts/dmark-todo-list/internal/application/domain"
)

type TaskFilter string

const (
	FilterActive    TaskFilter = "active"
	FilterCompleted TaskFilter = "completed"
	FilterDeleted   TaskFilter = "deleted"
)

type SortOrder string

const (
	SortAsc  SortOrder = "asc"
	SortDesc SortOrder = "desc"
)

type TaskService interface {
	Create(ctx context.Context, title string) (domain.Task, error)
	List(ctx context.Context, filter TaskFilter, order SortOrder) ([]domain.Task, error)
	Complete(ctx context.Context, id uuid.UUID) error
	Reopen(ctx context.Context, id uuid.UUID) error
	Delete(ctx context.Context, id uuid.UUID) error
	Restore(ctx context.Context, id uuid.UUID) error
}

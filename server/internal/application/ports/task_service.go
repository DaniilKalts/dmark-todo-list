package ports

import (
	"context"
	"errors"

	"github.com/google/uuid"

	"github.com/DaniilKalts/dmark-todo-list/internal/application/domain"
)

type TaskFilter string

const (
	FilterPending   TaskFilter = "pending"
	FilterCompleted TaskFilter = "completed"
	FilterDeleted   TaskFilter = "deleted"
)

type SortOrder string

const (
	SortAsc  SortOrder = "asc"
	SortDesc SortOrder = "desc"
)

var ErrTaskNotDeleted = errors.New("cannot hard delete a task that is not in trash")

type TaskService interface {
	Create(ctx context.Context, title string) (domain.Task, error)
	List(ctx context.Context, filter TaskFilter, order SortOrder) ([]domain.Task, error)
	Complete(ctx context.Context, id uuid.UUID) error
	Reopen(ctx context.Context, id uuid.UUID) error
	SoftDelete(ctx context.Context, id uuid.UUID) error
	Restore(ctx context.Context, id uuid.UUID) error
	HardDelete(ctx context.Context, id uuid.UUID) error
	EmptyTrash(ctx context.Context) error
}

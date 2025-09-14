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

type SortBy string

const (
	SortByCreatedAt   SortBy = "created_at"
	SortByPriority    SortBy = "priority"
	SortByCompletedAt SortBy = "completed_at"
	SortByDeletedAt   SortBy = "deleted_at"
)

var ErrTaskNotDeleted = errors.New("cannot hard delete a task that is not in trash")

type TaskService interface {
	Create(ctx context.Context, title string, priority *domain.Priority) (domain.Task, error)
	SetPriority(ctx context.Context, id uuid.UUID, priority domain.Priority) error
	List(ctx context.Context, filter TaskFilter, sortBy SortBy, order SortOrder) (
		[]domain.Task, error,
	)
	Complete(ctx context.Context, id uuid.UUID) error
	Reopen(ctx context.Context, id uuid.UUID) error
	SoftDelete(ctx context.Context, id uuid.UUID) error
	Restore(ctx context.Context, id uuid.UUID) error
	HardDelete(ctx context.Context, id uuid.UUID) error
	EmptyTrash(ctx context.Context) error
}

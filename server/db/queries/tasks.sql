-- name: CreateTask :one
INSERT INTO tasks (id, title)
VALUES ($1, $2)
RETURNING id, title, created_at, updated_at, completed_at, deleted_at;

-- name: ListTasks :many
SELECT id, title, created_at, updated_at, completed_at, deleted_at
FROM tasks
WHERE deleted_at IS NULL
ORDER BY
    CASE WHEN sqlc.arg('sort_order') = 'asc' THEN created_at END ASC,
    CASE WHEN sqlc.arg('sort_order') = 'desc' THEN created_at END DESC;

-- name: ListDeletedTasks :many
SELECT id, title, created_at, updated_at, completed_at, deleted_at
FROM tasks
WHERE deleted_at IS NOT NULL
ORDER BY
    CASE WHEN sqlc.arg('sort_order') = 'asc' THEN deleted_at END ASC,
    CASE WHEN sqlc.arg('sort_order') = 'desc' THEN deleted_at END DESC;

-- name: ListPendingTasks :many
SELECT id, title, created_at, updated_at, completed_at, deleted_at
FROM tasks
WHERE completed_at IS NULL AND deleted_at IS NULL
ORDER BY
    CASE WHEN sqlc.arg('sort_order') = 'asc' THEN created_at END ASC,
    CASE WHEN sqlc.arg('sort_order') = 'desc' THEN created_at END DESC;

-- name: ListCompletedTasks :many
SELECT id, title, created_at, updated_at, completed_at, deleted_at
FROM tasks
WHERE completed_at IS NOT NULL AND deleted_at IS NULL
ORDER BY
    CASE WHEN sqlc.arg('sort_order') = 'asc' THEN completed_at END ASC,
    CASE WHEN sqlc.arg('sort_order') = 'desc' THEN completed_at END DESC;

-- name: MarkTaskDone :exec
UPDATE tasks
SET completed_at = now(), updated_at = now()
WHERE id = $1 AND deleted_at IS NULL;

-- name: MarkTaskUndone :exec
UPDATE tasks
SET completed_at = NULL, updated_at = now()
WHERE id = $1 AND deleted_at IS NULL;

-- name: SoftDeleteTask :exec
UPDATE tasks
SET deleted_at = now(), updated_at = now()
WHERE id = $1 AND deleted_at IS NULL;

-- name: RestoreDeletedTask :exec
UPDATE tasks
SET deleted_at = NULL, updated_at = now()
WHERE id = $1 AND deleted_at IS NOT NULL;

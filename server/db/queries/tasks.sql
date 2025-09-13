-- name: CreateTask :one
INSERT INTO tasks (id, title)
VALUES ($1, $2)
RETURNING id, title, is_done, created_at, updated_at;

-- name: ListTasks :many
SELECT id, title, is_done, created_at, updated_at
FROM tasks
WHERE deleted_at IS NULL
ORDER BY
    CASE WHEN sqlc.arg('sort_order') = 'asc' THEN created_at END ASC,
    CASE WHEN sqlc.arg('sort_order') = 'desc' THEN created_at END DESC;

-- name: ListDeletedTasks :many
SELECT id, title, is_done, created_at, updated_at
FROM tasks
WHERE deleted_at IS NOT NULL
ORDER BY
    CASE WHEN sqlc.arg('sort_order') = 'asc' THEN created_at END ASC,
    CASE WHEN sqlc.arg('sort_order') = 'desc' THEN created_at END DESC;

-- name: ListActiveTasks :many
SELECT id, title, is_done, created_at, updated_at
FROM tasks
WHERE is_done = false AND deleted_at IS NULL
ORDER BY
    CASE WHEN sqlc.arg('sort_order') = 'asc' THEN created_at END ASC,
    CASE WHEN sqlc.arg('sort_order') = 'desc' THEN created_at END DESC;

-- name: ListCompletedTasks :many
SELECT id, title, is_done, created_at, updated_at
FROM tasks
WHERE is_done = true AND deleted_at IS NULL
ORDER BY
    CASE WHEN sqlc.arg('sort_order') = 'asc' THEN created_at END ASC,
    CASE WHEN sqlc.arg('sort_order') = 'desc' THEN created_at END DESC;

-- name: MarkTaskDone :exec
UPDATE tasks
SET is_done = true, updated_at = now()
WHERE id = $1 AND deleted_at IS NULL;

-- name: MarkTaskUndone :exec
UPDATE tasks
SET is_done = false, updated_at = now()
WHERE id = $1 AND deleted_at IS NULL;

-- name: SoftDeleteTask :exec
UPDATE tasks
SET deleted_at = now(), updated_at = now()
WHERE id = $1 AND deleted_at IS NULL;

-- name: RestoreDeletedTask :exec
UPDATE tasks
SET deleted_at = NULL, updated_at = now()
WHERE id = $1 AND deleted_at IS NOT NULL;

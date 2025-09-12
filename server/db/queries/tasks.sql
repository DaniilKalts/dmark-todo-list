-- name: CreateTask :one
INSERT INTO tasks (id, title)
VALUES ($1, $2)
RETURNING id, title, is_done, created_at, updated_at;

-- name: ListTasks :many
SELECT id, title, is_done, created_at, updated_at
FROM tasks
WHERE deleted_at IS NULL
ORDER BY created_at;

-- name: ListActiveTasks :many
SELECT id, title, is_done, created_at, updated_at
FROM tasks
WHERE is_done = false AND deleted_at IS NULL
ORDER BY created_at;

-- name: ListCompletedTasks :many
SELECT id, title, is_done, created_at, updated_at
FROM tasks
WHERE is_done = true AND deleted_at IS NULL
ORDER BY created_at;

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

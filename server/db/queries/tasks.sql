-- name: CreateTask :one
INSERT INTO tasks (id, title, priority)
VALUES ($1, $2, $3)
    RETURNING id, title, priority, created_at, updated_at, completed_at, deleted_at;

-- name: UpdateTaskPriority :exec
UPDATE tasks
SET priority = $2, updated_at = now()
WHERE id = $1 AND deleted_at IS NULL;

-- name: ListTasks :many
SELECT id, title, priority, created_at, updated_at, completed_at, deleted_at
FROM tasks
WHERE deleted_at IS NULL
ORDER BY
    CASE WHEN sqlc.arg('sort_by')='priority'   AND sqlc.arg('sort_order')='asc'  THEN priority   END ASC,
    CASE WHEN sqlc.arg('sort_by')='priority'   AND sqlc.arg('sort_order')='desc' THEN priority   END DESC,
    CASE WHEN sqlc.arg('sort_by')='created_at' AND sqlc.arg('sort_order')='asc'  THEN created_at END ASC,
    CASE WHEN sqlc.arg('sort_by')='created_at' AND sqlc.arg('sort_order')='desc' THEN created_at END DESC,
    id DESC;

-- name: ListDeletedTasks :many
SELECT id, title, priority, created_at, updated_at, completed_at, deleted_at
FROM tasks
WHERE deleted_at IS NOT NULL
ORDER BY
    CASE WHEN sqlc.arg('sort_by')='priority'   AND sqlc.arg('sort_order')='asc'  THEN priority   END ASC,
    CASE WHEN sqlc.arg('sort_by')='priority'   AND sqlc.arg('sort_order')='desc' THEN priority   END DESC,
    CASE WHEN sqlc.arg('sort_by')='deleted_at' AND sqlc.arg('sort_order')='asc'  THEN deleted_at END ASC,
    CASE WHEN sqlc.arg('sort_by')='deleted_at' AND sqlc.arg('sort_order')='desc' THEN deleted_at END DESC,
    id DESC;

-- name: ListPendingTasks :many
SELECT id, title, priority, created_at, updated_at, completed_at, deleted_at
FROM tasks
WHERE completed_at IS NULL AND deleted_at IS NULL
ORDER BY
    CASE WHEN sqlc.arg('sort_by')='priority'   AND sqlc.arg('sort_order')='asc'  THEN priority   END ASC,
    CASE WHEN sqlc.arg('sort_by')='priority'   AND sqlc.arg('sort_order')='desc' THEN priority   END DESC,
    CASE WHEN sqlc.arg('sort_by')='created_at' AND sqlc.arg('sort_order')='asc'  THEN created_at END ASC,
    CASE WHEN sqlc.arg('sort_by')='created_at' AND sqlc.arg('sort_order')='desc' THEN created_at END DESC,
    id DESC;

-- name: ListCompletedTasks :many
SELECT id, title, priority, created_at, updated_at, completed_at, deleted_at
FROM tasks
WHERE completed_at IS NOT NULL AND deleted_at IS NULL
ORDER BY
    CASE WHEN sqlc.arg('sort_by')='priority'     AND sqlc.arg('sort_order')='asc'  THEN priority     END ASC,
    CASE WHEN sqlc.arg('sort_by')='priority'     AND sqlc.arg('sort_order')='desc' THEN priority     END DESC,
    CASE WHEN sqlc.arg('sort_by')='completed_at' AND sqlc.arg('sort_order')='asc'  THEN completed_at END ASC,
    CASE WHEN sqlc.arg('sort_by')='completed_at' AND sqlc.arg('sort_order')='desc' THEN completed_at END DESC,
    id DESC;

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

-- name: HardDeleteTask :execrows
DELETE FROM tasks
WHERE id = $1 AND deleted_at IS NOT NULL;

-- name: EmptyTrash :exec
DELETE FROM tasks
WHERE deleted_at IS NOT NULL;
// DTO - структура, которая используется для передачи данных между разными слоями приложения
// В нашем случае от хенделера (http-запрос) к сервису (бизнес-логика)

package dto

import (
	"time"

	"github.com/google/uuid"
)

// DTO для создания задачи
type CreateTaskRequest struct {
	Title string `json:"title" validate:"required,min=5,max=40"`
}

// DTO для ответа при возврате задачи
type TaskResponse struct {
	ID        uuid.UUID `json:"id"`
	Title     string    `json:"title"`
	IsDone    bool      `json:"isDone"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

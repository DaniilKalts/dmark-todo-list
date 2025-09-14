// DTO - структура, которая используется для передачи данных между разными слоями приложения
// В нашем случае от хенделера (http-запрос) к сервису (бизнес-логика)

package dto

// DTO для создания задачи
type CreateTaskRequest struct {
	Title    string `json:"title" validate:"required,min=5,max=40"`
	Priority *int   `json:"priority" validate:"omitempty,oneof=1 2 3"`
}

// DTO для изменение приоритета задачи
type SetPriorityRequest struct {
	Priority int `json:"priority" validate:"required,oneof=1 2 3"`
}

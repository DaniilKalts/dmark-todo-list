package domain

import (
	"time"

	"github.com/google/uuid"
)

type Priority int16

const (
	PriorityLow Priority = iota + 1
	PriorityMedium
	PriorityHigh
)

type Task struct {
	// Вместо последовательности (Serial) буду использовать
	// универсально уникальный идентификатор.
	//
	// Таким образом получив ID не получится предсказать
	// кол-во задач у пользователя.
	ID uuid.UUID `json:"id"`

	Title       string     `json:"title"`
	Priority    Priority   `json:"priority"`
	CompletedAt *time.Time `json:"completedAt"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`

	// Soft delete будет помечать время удаления задания.
	//
	// Это необходимо для восстановления задания из корзины.
	//
	// Клиенту поле не возвращаем, т.к оно необходимо только на backend,
	// чтобы фильтровать неудаленные задачи.
	DeletedAt *time.Time `json:"-"`
}

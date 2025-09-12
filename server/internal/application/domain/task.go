package domain

import (
	"time"

	"github.com/google/uuid"
)

type Task struct {
	// Вместо последовательности (Serial) буду использовать
	// универсально уникальный идентификатор.
	//
	// Таким образом получив ID не получится предсказать
	// кол-во задач у пользователя.
	ID uuid.UUID `json:"id"`

	Title     string    `json:"title"`
	IsDone    bool      `json:"isDone"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`

	// Soft delete будет помечать время удаления задания.
	//
	// В перспективе если пользователь случайно удалит задание,
	// то он сможет обратиться в тех. поддержку и восстановить его.
	//
	// Клиенту поле не возвращаем, т.к оно необходимо только на backend,
	// чтобы фильтровать неудаленные задачи.
	DeletedAt *time.Time `json:"-"`
}

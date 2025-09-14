# DMARK To-Do List — Frontend

SPA (Single Page Application) приложение на React для работы с DMARK To-Do List API.

---

## ✨ Фичи (UI)

- Создание задач (валидация формы).
- Переключение приоритета (`3=High`, `2=Medium` (по умолчанию), `1=Low`).
- Страницы: Inbox, Pending, Completed, Trash.
- Фильтрация, сортировка и поиск по списку задач.
- Мягкое удаление/восстановление и полное удаление (с подтверждением).
- Поддержка смены темы (хук `useTheme`).
- Пустые состояния и сообщения об отсутствии задач.

---

## 🛠 Технический стек

- **Frontend:** React + React Router, JavaScript.
- **Стили:** Tailwind CSS.
- **API:** fetch к бэкенду DMARK To-Do List. 

---

## 📂 Структура проекта

```text
src
├── api
│   └── tasks.js                # функции для запросов к API (CRUD, фильтры, приоритет и т.д.)
├── App.css                     # глобальные стили приложения
├── App.jsx                     # корневой компонент + роуты/лейаут
├── assets
│   ├── fonts
│   │   ├── nunito-v16-latin-regular.woff2
│   │   └── OFL.txt
│   └── images
│       └── logo-universal.png
├── components                  # переиспользуемые UI-компоненты
│   ├── ConfirmDialog.jsx       # модальное подтверждение действий (trash / delete)
│   ├── EmptyState.jsx          # пустые состояния списков
│   ├── Sidebar.jsx             # навигация по страницам
│   ├── TaskFilters.jsx         # контролы фильтра/сортировки/поиска
│   ├── TaskForm.jsx            # форма создания задачи
│   ├── TaskItem.jsx            # одна задача (чекбокс, приоритет, меню)
│   └── TaskList.jsx            # список задач
├── hooks
│   ├── useTasks.js             # загрузка, мутации, счетчики; работа с API
│   └── useTheme.js             # переключение темы
├── main.jsx                    # входная точка Vite/ReactDOM.createRoot
├── pages                       # страницы (роуты)
│   ├── CompletedTasksPage.jsx
│   ├── InboxTasksPage.jsx
│   ├── PendingTasksPage.jsx
│   ├── SettingsPage.jsx
│   └── TrashPage.jsx
└── style.css                   # дополнительные стили (переменные/utility)
```

## 🚀 Запуск и сборка

```text
# установка зависимостей
npm install

# дев-режим (http://localhost:5173 по умолчанию)
npm run dev

# production-сборка (папка dist/)
npm run build

# предпросмотр prod-сборки
npm run preview
```

## 🖥️ Wails (desktop-режим)

> Бэкенд **обязательно** должен быть запущен (Docker Compose), т.к. фронт ходит в API по HTTP. <br />
> Необходимо зайти в директорию сервер, заполнить конфиги и использовать команду `make up-build`. <br />
> Подробнее можете ознакомиться в `server/README.md`.

**Запуск в dev**

1. Поднимите бэкенд: make up (в репозитории сервера).
2. В другом окне:
```bash
wails dev
```

**Production-сборка desktop**
```bash
# соберёт фронт и упакует бинарь
wails build
# бинарник будет в build/bin
```

P.S И да, не забудьте использовать `npm install`, чтобы стянуть все необходимые зависимости
# Multi-Stage building позволяет снизить размер конечного образа для запуска софта.

# 1 stage: сборка
FROM golang:1.25.1-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -ldflags="-s -w" -o dmark-todo-back ./cmd/server/main.go

# 2 stage: запуск
FROM alpine
WORKDIR /app
COPY --from=builder /app/dmark-todo-back .
USER 1000
EXPOSE 8080
ENTRYPOINT ["./dmark-todo-back"]

# P.S Для конечного образ выбрал дистрибутив линукса alpine по следующим причинам:
# 1. Он легковестный.
# 2. Можно зайти в контейнер и посмотреть файлы, переменные окружения, процессы.
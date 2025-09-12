package httphelpers

import (
	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
)

func ParseUUIDParam(ctx fiber.Ctx, name string) (uuid.UUID, error) {
	idStr := ctx.Params(name)

	return uuid.Parse(idStr)
}

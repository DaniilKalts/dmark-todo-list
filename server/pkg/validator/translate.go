package validatorutil

import (
	"fmt"
	"strings"

	"github.com/go-playground/validator/v10"
)

var fieldTranslations = map[string]string{
	"Title":    "заголовок",
	"Priority": "приоритет",
}

func TranslateValidationError(err error) string {
	if errs, ok := err.(validator.ValidationErrors); ok {
		for _, e := range errs {
			fieldName, ok := fieldTranslations[e.Field()]
			if !ok {
				fieldName = e.Field()
			}

			switch e.Tag() {
			case "required":
				return fmt.Sprintf("Поле %s обязательно", fieldName)
			case "min":
				return fmt.Sprintf(
					"Поле %s должно содержать минимум %s символов", fieldName, e.Param(),
				)
			case "max":
				return fmt.Sprintf(
					"Поле %s должно содержать не более %s символов", fieldName, e.Param(),
				)
			case "oneof":
				allowed := strings.ReplaceAll(e.Param(), " ", ", ")
				if e.Field() == "Priority" {
					return "Поле приоритет должно быть одним из: 1 (низкий), 2 (средний), 3 (высокий)"
				}
				return fmt.Sprintf("Поле %s должно быть одним из: %s", fieldName, allowed)
			}
		}
	}
	return "Некорректные данные"
}

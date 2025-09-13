package validatorutil

import (
	"fmt"

	"github.com/go-playground/validator/v10"
)

var fieldTranslations = map[string]string{
	"Title": "заголовок",
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
				return fmt.Sprintf("Поле \"%s\" обязательно", fieldName)
			case "min":
				return fmt.Sprintf(
					"Поле %s должно содержать минимум %s символов", fieldName, e.Param(),
				)
			case "max":
				return fmt.Sprintf(
					"Поле %s должно содержать не более %s символов", fieldName, e.Param(),
				)
			}
		}
	}
	return "Некорректные данные"
}

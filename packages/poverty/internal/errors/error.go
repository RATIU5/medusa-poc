package errors

import (
	"fmt"

	"github.com/RATIU5/medusa-poc/internal/constants"
)

type AppError struct {
	Code       constants.ErrorCode
	Message    string
	DevMessage string
	StatusCode int
	Err        error
}

func (e *AppError) Error() string {
	return fmt.Sprintf("%s: %s", e.Code, e.Message)
}

func New(code constants.ErrorCode, message, devMessage string, statusCode int, err error) *AppError {
	return &AppError{
		Code:       code,
		Message:    message,
		DevMessage: devMessage,
		StatusCode: statusCode,
		Err:        err,
	}
}

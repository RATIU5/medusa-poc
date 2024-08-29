package errors

import (
	"github.com/RATIU5/medusa-poc/internal/constants"
	"github.com/gofiber/fiber/v2"
)

func NewInvalidInputError(devMessage string, err error) *AppError {
	return New(constants.ErrCodeInvalidInput, "invalid input provided", devMessage, fiber.StatusBadRequest, err)
}

func NewUnauthorizedError(devMessage string, err error) *AppError {
	return New(constants.ErrCodeUnauthorized, "authentication required", devMessage, fiber.StatusUnauthorized, err)
}

func NewForbiddenError(devMessage string, err error) *AppError {
	return New(constants.ErrCodeForbidden, "access denied", devMessage, fiber.StatusForbidden, err)
}

func NewNotFoundError(devMessage string, err error) *AppError {
	return New(constants.ErrCodeNotFound, "resource not found", devMessage, fiber.StatusNotFound, err)
}

func NewInternalError(devMessage string, err error) *AppError {
	return New(constants.ErrCodeInternal, "an unexpected error occurred", devMessage, fiber.StatusInternalServerError, err)
}

func NewDatabaseError(devMessage string, err error) *AppError {
	return New(constants.ErrCodeDatabase, "an error occurred while processing your request", devMessage, fiber.StatusInternalServerError, err)
}

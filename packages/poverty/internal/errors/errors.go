package errors

import (
	"fmt"
	"strings"

	"github.com/RATIU5/medusa-poc/internal/constants"
	"github.com/RATIU5/medusa-poc/internal/logger"
	"github.com/gofiber/fiber/v2"
)




type AppError struct {
	Code        constants.ErrorCode
	Message     string
	DevMessage  string
	StatusCode  int
	Err         error
}

func (e *AppError) Error() string {
	return fmt.Sprintf("%s: %s", e.Code, e.Message)
}

func New(code constants.ErrorCode, message, devMessage string, statusCode int, err error) *AppError {
	return &AppError{
		Code:        code,
		Message:     message,
		DevMessage:  devMessage,
		StatusCode:  statusCode,
		Err:         err,
	}
}

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

func Handler(l *logger.Logger, c *fiber.Ctx, err error) error {
	if e, ok := err.(*AppError); ok {
		logPrettyError(l, e)
		return c.Status(e.StatusCode).JSON(fiber.Map{
			"error": e.Message,
			"code":  e.Code,
		})
	}

	logUnexpectedError(l, err)
	return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
		"error": "An unexpected error occurred",
		"code":  constants.ErrCodeInternal,
	})
}

func logPrettyError(l *logger.Logger, e *AppError) {
	const boxWidth = 50
	errorMsg := strings.Builder{}
	errorMsg.WriteString("\n╔" + strings.Repeat("═", boxWidth-2) + "╗\n")
	errorMsg.WriteString("║" + centerText(" Application Error ", boxWidth-2) + "║\n")
	errorMsg.WriteString("╠" + strings.Repeat("═", boxWidth-2) + "╣\n")
	
	writeWrappedField(&errorMsg, "Code", string(e.Code), boxWidth)
	writeWrappedField(&errorMsg, "Message", e.Message, boxWidth)
	writeWrappedField(&errorMsg, "Dev Message", e.DevMessage, boxWidth)
	writeWrappedField(&errorMsg, "Status Code", fmt.Sprintf("%d", e.StatusCode), boxWidth)
	if e.Err != nil {
		writeWrappedField(&errorMsg, "Error", e.Err.Error(), boxWidth)
	}
	
	errorMsg.WriteString("╚" + strings.Repeat("═", boxWidth-2) + "╝")

	l.Error(errorMsg.String())
}

func logUnexpectedError(l *logger.Logger, err error) {
	const boxWidth = 50
	errorMsg := strings.Builder{}
	errorMsg.WriteString("\n╔" + strings.Repeat("═", boxWidth-2) + "╗\n")
	errorMsg.WriteString("║" + centerText(" Unexpected Error ", boxWidth-2) + "║\n")
	errorMsg.WriteString("╠" + strings.Repeat("═", boxWidth-2) + "╣\n")
	
	writeWrappedField(&errorMsg, "Error", err.Error(), boxWidth)
	
	errorMsg.WriteString("╚" + strings.Repeat("═", boxWidth-2) + "╝")

	l.Error(errorMsg.String())
}

func writeWrappedField(sb *strings.Builder, fieldName, fieldValue string, boxWidth int) {
	sb.WriteString("║ " + fieldName + ": ")
	remainingWidth := boxWidth - 4 - len(fieldName)
	lines := wrapText(fieldValue, remainingWidth)
	for i, line := range lines {
		if i == 0 {
			sb.WriteString(line + strings.Repeat(" ", remainingWidth-len(line) - 1) + "║\n")
		} else {
			sb.WriteString("║ " + strings.Repeat(" ", len(fieldName)+2) + line + strings.Repeat(" ", remainingWidth-len(line)) + " ║\n")
		}
	}
}

func wrapText(text string, width int) []string {
	var lines []string
	line := ""
	words := strings.Fields(text)
	for _, word := range words {
		if len(line)+len(word) > width {
			lines = append(lines, line)
			line = word
		} else if line != "" {
			line += " " + word
		} else {
			line = word
		}
	}
	if line != "" {
		lines = append(lines, line)
	}
	return lines
}

func centerText(text string, width int) string {
	if len(text) >= width {
		return text[:width]
	}
	leftPad := (width - len(text)) / 2
	rightPad := width - len(text) - leftPad
	return strings.Repeat(" ", leftPad) + text + strings.Repeat(" ", rightPad)
}
package constants

const (
	EnvDatabaseConnection = "DATABASE_CONNECTION"
	EnvTokenSecretKey     = "JWT_SECRET_KEY"
)

type ErrorCode string

const (
	ErrCodeInvalidInput ErrorCode = "INVALID_INPUT"
	ErrCodeUnauthorized ErrorCode = "UNAUTHORIZED"
	ErrCodeForbidden    ErrorCode = "FORBIDDEN"
	ErrCodeNotFound     ErrorCode = "NOT_FOUND"
	ErrCodeInternal     ErrorCode = "INTERNAL_ERROR"
	ErrCodeDatabase     ErrorCode = "DATABASE_ERROR"
)

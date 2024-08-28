package constants

const (
	EnvDatabaseConnection = "DATABASE_CONNECTION"
	EnvDatabaseUser       = "DATABASE_USER"
	EnvDatabasePassword   = "DATABASE_PASSWORD"
	EnvDatabaseName       = "DATABASE_NAME"
	EnvVerbose            = "VERBOSE"
	EnvPort               = "PORT"
)

const (
	LogLevelDebug = "debug"
	LogLevelInfo  = "info"
	LogLevelWarn  = "warn"
	LogLevelError = "error"
	LogLevelFatal = "fatal"
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

package logger

import (
	"fmt"
	"os"
	"runtime"
	"strings"
	"time"

	"github.com/RATIU5/medusa-poc/internal/constants"
	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog"
)

type Logger struct {
	zlog zerolog.Logger
}

func NewLogger(level string) *Logger {
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	output := zerolog.ConsoleWriter{
		Out:        os.Stdout,
		TimeFormat: time.RFC3339,
		FormatCaller: func(i interface{}) string {
			return fmt.Sprintf("%s", i)
		},
	}
	zlog := zerolog.New(output).With().Timestamp().Logger()
	zlog = zlog.Level(getLogLevel(level))
	return &Logger{zlog: zlog}
}

func getLogLevel(level string) zerolog.Level {
	switch level {
	case constants.LogLevelDebug:
		return zerolog.DebugLevel
	case constants.LogLevelInfo:
		return zerolog.InfoLevel
	case constants.LogLevelWarn:
		return zerolog.WarnLevel
	case constants.LogLevelError:
		return zerolog.ErrorLevel
	case constants.LogLevelFatal:
		return zerolog.FatalLevel
	default:
		return zerolog.InfoLevel
	}
}

func (l *Logger) Debug(format string, args ...interface{}) {
	l.log(constants.LogLevelDebug, format, args...)
}

func (l *Logger) Info(format string, args ...interface{}) {
	l.log(constants.LogLevelInfo, format, args...)
}

func (l *Logger) Warn(format string, args ...interface{}) {
	l.log(constants.LogLevelWarn, format, args...)
}

func (l *Logger) Error(format string, args ...interface{}) {
	l.log(constants.LogLevelError, format, args...)
}

func (l *Logger) Fatal(format string, args ...interface{}) {
	l.log(constants.LogLevelFatal, format, args...)
}

func (l *Logger) getCaller() string {
	_, file, line, ok := runtime.Caller(3)
	if !ok {
		return "unknown:0"
	}
	parts := strings.Split(file, "/")
	if len(parts) > 2 {
		file = strings.Join(parts[len(parts)-3:], "/")
	}
	return fmt.Sprintf("%s:%d", file, line)
}

func (l *Logger) log(level, format string, args ...interface{}) {
	var event *zerolog.Event

	switch level {
	case constants.LogLevelDebug:
		event = l.zlog.Debug()
	case constants.LogLevelInfo:
		event = l.zlog.Info()
	case constants.LogLevelWarn:
		event = l.zlog.Warn()
	case constants.LogLevelError:
		event = l.zlog.Error()
	case constants.LogLevelFatal:
		event = l.zlog.Fatal()
	default:
		event = l.zlog.Info()
	}

	message := fmt.Sprintf(format, args...)
	event.Str("caller", l.getCaller()).Msg(message)
}

func Middleware(logger *Logger) fiber.Handler {
	return func(c *fiber.Ctx) error {
		c.Locals("logger", logger)
		start := time.Now()

		err := c.Next()

		logger.Info("Request processed - Method: %s, Path: %s, Status: %d, Latency: %dms, RequestID: %s",
			c.Method(), c.Path(), c.Response().StatusCode(), time.Since(start).Milliseconds(), c.GetRespHeader("X-Request-Id"))

		return err
	}
}
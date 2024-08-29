package config

import (
	"fmt"
	"os"
	"path/filepath"
	"reflect"
	"strconv"
	"strings"

	"github.com/RATIU5/medusa-poc/internal/constants"
	"github.com/fatih/color"
	"github.com/go-viper/mapstructure/v2"
	"github.com/joho/godotenv"
	"github.com/spf13/viper"
)

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	Logging  LoggingConfig
}

type ServerConfig struct {
	Host      string `mapstructure:"host" default:"localhost"`
	Port      int    `mapstructure:"port" default:"3000"`
	SecretKey string `mapstructure:"-"`
}

type DatabaseConfig struct {
	ConnectionUrl     string `mapstructure:"connection_url"`
	MinOpenConns      int    `mapstructure:"min_open_conns" default:"2"`
	MaxOpenConns      int    `mapstructure:"max_open_conns" default:"5"`
	MaxConnLifetime   int    `mapstructure:"max_conn_lifetime" default:"60"`
	MaxIdleLifetime   int    `mapstructure:"max_idle_lifetime" default:"30"`
	HealthCheckPeriod int    `mapstructure:"health_check_period" default:"5"`
	MaxRetries        int    `mapstructure:"max_retries" default:"3"`
	RetryDelay        int    `mapstructure:"retry_delay" default:"1"`
}

type LoggingConfig struct {
	Level string `mapstructure:"level" default:"info"`
}

func (c *Config) Print() {
	printStructPretty(reflect.ValueOf(c).Elem(), 0)
}

func Load() (*Config, error) {
	loadEnv()

	if err := loadConfigFile(); err != nil {
		return nil, fmt.Errorf("failed to load config file: %w", err)
	}

	var config Config
	decoderConfig := &mapstructure.DecoderConfig{
		Result:           &config,
		WeaklyTypedInput: true,
		DecodeHook: mapstructure.ComposeDecodeHookFunc(
			mapstructure.StringToTimeDurationHookFunc(),
			mapstructure.StringToSliceHookFunc(","),
		),
	}

	decoder, err := mapstructure.NewDecoder(decoderConfig)
	if err != nil {
		return nil, fmt.Errorf("failed to create decoder: %w", err)
	}

	if err := decoder.Decode(viper.AllSettings()); err != nil {
		return nil, fmt.Errorf("failed to decode config: %w", err)
	}

	if err := loadEnvVariables(&config); err != nil {
		return nil, fmt.Errorf("failed to load environment variables: %w", err)
	}

	setDefaultValues(&config)

	return &config, nil
}

func loadEnv() {
	pwd, err := os.Getwd()
	if err != nil {
		return
	}

	envPath := filepath.Join(pwd, ".env")
	godotenv.Load(envPath)
}

func loadConfigFile() error {
	viper.SetConfigType("toml")
	viper.SetConfigName("config")
	viper.AddConfigPath("tmp")
	viper.AutomaticEnv()

	return viper.ReadInConfig()
}

func loadEnvVariables(config *Config) error {
	requiredEnvVars := []string{
		constants.EnvDatabaseConnection,
		constants.EnvTokenSecretKey,
	}

	for _, envVar := range requiredEnvVars {
		if os.Getenv(envVar) == "" {
			return fmt.Errorf("required environment variable %s is not set", envVar)
		}
		switch envVar {
		case constants.EnvTokenSecretKey:
			config.Server.SecretKey = os.Getenv(envVar)
		case constants.EnvDatabaseConnection:
			config.Database.ConnectionUrl = os.Getenv(envVar)
		}
	}

	return nil
}

func setDefaultValues(config *Config) {
	setDefaultValue(reflect.ValueOf(config).Elem())
}

func setDefaultValue(v reflect.Value) {
	t := v.Type()

	for i := 0; i < v.NumField(); i++ {
		field := v.Field(i)
		fieldType := t.Field(i)

		if field.Kind() == reflect.Struct {
			setDefaultValue(field)
			continue
		}

		defaultValue := fieldType.Tag.Get("default")
		if defaultValue == "" {
			continue
		}

		if field.IsZero() {
			switch field.Kind() {
			case reflect.String:
				field.SetString(defaultValue)
			case reflect.Int:
				if intValue, err := strconv.Atoi(defaultValue); err == nil {
					field.SetInt(int64(intValue))
				}
			case reflect.Bool:
				if boolValue, err := strconv.ParseBool(defaultValue); err == nil {
					field.SetBool(boolValue)
				}
			case reflect.Float64:
				if floatValue, err := strconv.ParseFloat(defaultValue, 64); err == nil {
					field.SetFloat(floatValue)
				}
			case reflect.Slice:
				if defaultValue == "*" {
					field.Set(reflect.ValueOf([]string{"*"}))
				} else {
					values := strings.Split(defaultValue, ",")
					slice := reflect.MakeSlice(field.Type(), len(values), len(values))
					for i, v := range values {
						slice.Index(i).SetString(strings.TrimSpace(v))
					}
					field.Set(slice)
				}
			}
		}
	}
}

func printStructPretty(v reflect.Value, indent int) {
	t := v.Type()
	for i := 0; i < v.NumField(); i++ {
		field := t.Field(i)
		value := v.Field(i)

		if value.Kind() == reflect.Struct {
			color.New(color.FgCyan, color.Bold).Printf("%s%s:\n", strings.Repeat("  ", indent), field.Name)
			color.Unset()
			printStructPretty(value, indent+1)
		} else {
			color.New(color.FgGreen).Printf("%s%s: ", strings.Repeat("  ", indent), field.Name)
			color.Unset()
			fmt.Printf("%v\n", value.Interface())
		}
	}
	color.Unset()
}

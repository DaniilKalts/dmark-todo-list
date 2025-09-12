package config

import (
	"fmt"
	"strings"

	"github.com/joho/godotenv"
	"github.com/spf13/viper"
)

type PostgresConfig struct {
	Host     string `mapstructure:"host"`
	Port     int    `mapstructure:"port"`
	User     string `mapstructure:"user"`
	Password string `mapstructure:"password"`
	DB       string `mapstructure:"db"`
	SSLMode  string `mapstructure:"sslmode"`
}

type Config struct {
	PostgresConfig PostgresConfig `mapstructure:"postgres"`
}

func Load() (*Config, error) {
	var cfg Config

	// Подгружаем переменные окружения (.env)
	_ = godotenv.Load()

	v := viper.New()

	// Ставим дефолтные значения на случай, если .env файла нет
	v.SetDefault("postgres.host", "postgres")
	v.SetDefault("postgres.port", 5432)
	v.SetDefault("postgres.user", "postgres")
	v.SetDefault("postgres.password", "your_password")
	v.SetDefault("postgres.db", "dmark_db")
	v.SetDefault("postgres.sslmode", "disable")

	// Название, тип, местоположение файла с настройками инфраструктуры
	v.SetConfigName("config")
	v.SetConfigType("yaml")
	v.AddConfigPath(".")

	// Присваиваем значения из переменных окружения в config.yaml
	v.AutomaticEnv()
	v.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	// Присваиваем значения в структуру Config
	if err := v.Unmarshal(&cfg); err != nil {
		return nil, fmt.Errorf("unmarshaling config: %w", err)
	}

	return &cfg, nil
}

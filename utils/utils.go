package utils

import (
	"os"
	"net/http"
	"github.com/joho/godotenv"
)

func GetEnv(varName string) (string) {
	godotenv.Load()
	return (os.Getenv(varName))
}

func EnableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
}
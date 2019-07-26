package utils

import (
	"os"
	"net/http"
)

func getEnv(varName string) (string) {
	return (os.Getenv(varName))
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
}
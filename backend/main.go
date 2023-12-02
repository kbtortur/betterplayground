//go:generate go run build-frontend.go

package main

import (
	"embed"
	"log"
	"net/http"
)

//go:embed all:dist
var embedded embed.FS

func main() {
	srv := &http.Server{
		Addr:    ":3000",
		Handler: Router(),
	}

	log.Print("Listening on http://localhost:3000")
	srv.ListenAndServe()
}

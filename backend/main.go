//go:generate go run build-frontend.go

package main

import (
	"embed"
	"fmt"
	"net/http"
)

//go:embed all:web-dist
var embedded embed.FS

func main() {
	srv := &http.Server{
		Addr:    ":3000",
		Handler: Router(),
	}

	fmt.Println("Listening on http://localhost:3000")
	openURL("http://localhost:3000")
	srv.ListenAndServe()
}

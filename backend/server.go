package main

import (
	"io/fs"
	"net/http"
	"path/filepath"
	"strings"
)

type neuteredFileSystem struct {
	fs http.FileSystem
}

// disables directory listing
func (nfs neuteredFileSystem) Open(path string) (http.File, error) {
	f, err := nfs.fs.Open(path)
	if err != nil {
		return nil, err
	}

	s, err := f.Stat()
	if s.IsDir() {
		index := filepath.Join(path, "index.html")
		if _, err := nfs.fs.Open(index); err != nil {
			closeErr := f.Close()
			if closeErr != nil {
				return nil, closeErr
			}

			return nil, err
		}
	}

	return f, nil
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	if strings.HasPrefix(r.URL.Path, "/api") {
		http.NotFound(w, r)
		return
	}

	if r.URL.Path == "/favicon.ico" {
		rawFile, _ := embedded.ReadFile("web-dist/favicon.ico")
		w.Write(rawFile)
		return
	}

	rawFile, _ := embedded.ReadFile("web-dist/index.html")
	w.Write(rawFile)
}

func Router() http.Handler {
	mux := http.NewServeMux()

	// index page
	mux.HandleFunc("/", indexHandler)

	// static files
	staticFS, _ := fs.Sub(embedded, "web-dist")
	httpFS := http.FileServer(neuteredFileSystem{http.FS(staticFS)})
	mux.Handle("/static", http.NotFoundHandler())
	mux.Handle("/static/", httpFS)

	// api
	mux.HandleFunc("/api/v1/greeting", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello, there!"))
	})

	return mux
}

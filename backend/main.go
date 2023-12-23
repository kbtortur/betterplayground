//go:generate goreleaser --clean --snapshot

package main

import (
	"embed"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"
	"sync"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

//go:embed all:web-dist
var embedded embed.FS
var DEFAULT_PORT = 7823
var DEFAULT_ARGS = []string{
	"serve",
	// todo: fix this
	// "--dir", path.Join(execRoot(), "betterplayground_data"),
	"--http", "127.0.0.1:" + fmt.Sprint(DEFAULT_PORT),
}

func main() {
	var wg sync.WaitGroup

	app := pocketbase.New()
	webDist, err := fs.Sub(embedded, "web-dist")
	if err != nil {
		panic(err)
	}

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET("/*", apis.StaticDirectoryHandler(webDist, true))

		e.Router.GET("/hello/:name", func(c echo.Context) error {
			name := c.PathParam("name")

			return c.JSON(http.StatusOK, map[string]string{"message": "Hello " + name})
		})

		return nil
	})

	if len(os.Args) == 1 {
		os.Args = append(os.Args, DEFAULT_ARGS...)
	}

	wg.Add(1)
	go func() {
		defer wg.Done()

		if err := app.Start(); err != nil {
			log.Fatal(err)
		}
	}()
	defer wg.Wait()

	openURL("http://127.0.0.1:" + fmt.Sprint(DEFAULT_PORT))
	fmt.Println("Listening on http://127.0.0.1:" + fmt.Sprint(DEFAULT_PORT))
}

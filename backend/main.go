//go:generate goreleaser --clean --snapshot

package main

import (
	"embed"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"

	_ "github.com/vaaski/betterplayground/migrations"
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

	isGoRun := strings.HasPrefix(os.Args[0], os.TempDir())
	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		Automigrate: isGoRun,
	})

	wg.Add(1)
	go func() {
		defer wg.Done()

		if err := app.Start(); err != nil {
			log.Fatal(err)
		}
	}()
	defer wg.Wait()

	if !isGoRun {
		openURL("http://127.0.0.1:" + fmt.Sprint(DEFAULT_PORT))
	}

	fmt.Println("Listening on http://127.0.0.1:" + fmt.Sprint(DEFAULT_PORT))
}

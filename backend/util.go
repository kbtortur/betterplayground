package main

import (
	"os"
	"os/exec"
	"path"
	"runtime"
	"strings"
)

// https://gist.github.com/sevkin/9798d67b2cb9d07cb05f89f14ba682f8
// https://stackoverflow.com/questions/39320371/how-start-web-server-to-openURL-page-in-browser-in-golang
// openURL opens the specified URL in the default browser of the user.
func openURL(url string) error {
	var cmd string
	var args []string

	switch runtime.GOOS {
	case "windows":
		cmd = "cmd"
		args = []string{"/c", "start"}
	case "darwin":
		cmd = "open"
	default: // "linux", "freebsd", "openbsd", "netbsd"
		cmd = "xdg-open"
	}
	args = append(args, url)
	return exec.Command(cmd, args...).Start()
}

// gets the folder containing the executable
func execRoot() string {
	executablePath, _ := os.Executable()
	executableFolder := path.Join(executablePath, "..")

	if strings.HasPrefix(executableFolder, "/var/folders") {
		// the path for the executable is in some temp folder when using `go run .`
		// so we use the current working directory instead
		cwd, _ := os.Getwd()
		return cwd
	} else {
		return executableFolder
	}
}

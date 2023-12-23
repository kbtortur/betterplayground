package main

import (
	"os"
	"os/exec"
)

func main() {
	// This file is ignored by the build process.
	// It is only used to generate the frontend build.

	os.RemoveAll("web-dist")

	build := exec.Command("npm", "run", "build")
	build.Dir = "../frontend"
	build.Stdout = os.Stdout
	build.Stderr = os.Stderr

	err := build.Run()
	if err != nil {
		panic(err)
	}

	err = os.Rename("../frontend/dist", "web-dist")
}

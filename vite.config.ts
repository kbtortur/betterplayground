import { fileURLToPath, URL } from "node:url"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { visualizer } from "rollup-plugin-visualizer"

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    assetsDir: "static",
    target: "es2022",
  },
  plugins: [
    vue(),
    visualizer(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("src", import.meta.url)),
    },
  },
})

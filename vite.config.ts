import { fileURLToPath, URL } from "node:url"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { visualizer } from "rollup-plugin-visualizer"

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    assetsDir: "static",
    target: "es2022",
  },
  plugins: [
    vue(),
    AutoImport({
      dirs: ["./src/composables/**", "./src/stores/**"],
      imports: ["vue", "vue-router", "@vueuse/core"],
      vueTemplate: true,
    }),
    Components({}),
    visualizer(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("src", import.meta.url)),
    },
  },
})

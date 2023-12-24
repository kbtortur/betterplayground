import { fileURLToPath, URL } from "node:url"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import AutoImport from "unplugin-auto-import/vite"

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    assetsDir: "static",
  },
  plugins: [
    vue(),
    AutoImport({
      dts: true,
      dirs: ["./src/composables/*", "./src/stores/*"],
      imports: ["vue", "vue-router", "@vueuse/core"],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})

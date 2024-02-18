import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [vue()],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "../styles/global.scss";`,
        },
      },
    },
    test: {
      environment: "jsdom",
      globals: true,
      include: ["**/tests/*.{ts, js}"],
    },
  }
})

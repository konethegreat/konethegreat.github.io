import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "node:path"

// User site (konethegreat.github.io) is served from the domain root, so base is "/".
export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "./src") },
  },
  build: {
    target: "es2022",
    sourcemap: false,
    chunkSizeWarningLimit: 650,
  },
  server: { port: 5173 },
  preview: { port: 4173 },
})

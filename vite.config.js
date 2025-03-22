import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8026,
    proxy: {
      "/api/": "http://localhost:3003"
    },
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  }
})

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.VITE_BASE_PATH || "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    proxy: {
      '/api': {
        target: 'https://interview-platform-backend-i5jv.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  },
});

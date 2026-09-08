import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/welcome": "http://localhost:3000",
      "/welcome/json": "http://localhost:3000",
    },
  },
});

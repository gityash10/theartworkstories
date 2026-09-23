import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      "@": fileURLToPath(
        new URL("./story/src", import.meta.url),
      ),
    },
  },

  build: {
    rollupOptions: {
      input: {
        home: "pages/home/index.html",
        login: "pages/login/index.html",
        contribution: "pages/contribution/index.html",
        signup: "pages/signup/index.html",
        ourStory: "pages/our-story/index.html",
      },
    },
  },
});
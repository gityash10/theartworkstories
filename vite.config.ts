import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";
import { resolve } from "path";

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
        discover: "pages/app/discover/index.html",
        collections: "pages/app/collections/index.html",
        myCollections: "pages/app/my-collections/index.html",
        createCollection: "pages/app/create-collection/index.html",
        collection: "pages/app/collection/index.html",
        profile: resolve(__dirname, "pages/app/profile/index.html"),
        editProfile: resolve(__dirname, "pages/app/profile/edit/index.html"),
      },
    },
  },
});
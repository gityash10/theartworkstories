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
        settingsAccount: resolve( __dirname, "pages/app/settings/account/index.html", ),
        settingsPrivacy: resolve(  __dirname, "pages/app/settings/privacy/index.html",),
        settingsNotifications: resolve( __dirname, "pages/app/settings/notifications/index.html",),
         settingsAppearance: resolve(__dirname, "pages/app/settings/appearance/index.html",),
         settingsConnectedAccounts: resolve(__dirname, "pages/app/settings/connected-accounts/index.html",),
         settingsDataStorage: resolve(__dirname, "pages/app/settings/data-storage/index.html",),
         settingsSecurity: resolve(__dirname,  "pages/app/settings/security/index.html",),
         settingsHelpSupport: resolve(__dirname,  "pages/app/settings/help-support/index.html",
         ),
      },
    },
  },
});
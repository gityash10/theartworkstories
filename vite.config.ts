import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

// Resolve a path relative to this config file (works in ESM, unlike __dirname).
const page = (p: string) => fileURLToPath(new URL(`./${p}`, import.meta.url));

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
        profile: page("pages/app/profile/index.html"),
        editProfile: page("pages/app/profile/edit/index.html"),
        settingsAccount: page("pages/app/settings/account/index.html"),
        settingsPrivacy: page("pages/app/settings/privacy/index.html"),
        settingsNotifications: page("pages/app/settings/notifications/index.html"),
        settingsAppearance: page("pages/app/settings/appearance/index.html"),
        settingsConnectedAccounts: page("pages/app/settings/connected-accounts/index.html"),
        settingsDataStorage: page("pages/app/settings/data-storage/index.html"),
        settingsSecurity: page("pages/app/settings/security/index.html"),
        settingsHelpSupport: page("pages/app/settings/help-support/index.html"),
        notifications: page("pages/app/notifications/index.html"),
        explore: page("pages/app/explore/index.html"),
        storyofWeek: page("pages/app/story-of-week/index.html"),
        artists: page("pages/app/artists/index.html"),
        stories: page("pages/app/stories/index.html"),
      },
    },
  },
});

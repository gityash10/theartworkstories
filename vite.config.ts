import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

/*
 * All frontend source lives inside front-end/.
 *
 * The Vite root points at front-end/ so the absolute URLs used across the
 * pages (/assets/..., /pages/..., /story/src/...) resolve the same way in
 * dev and in production builds. This config file stays at the repository
 * root; paths below are relative to front-end/.
 */
export default defineConfig({
  root: fileURLToPath(new URL("./front-end", import.meta.url)),
  publicDir: fileURLToPath(new URL("./front-end/public", import.meta.url)),

  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": fileURLToPath(
        new URL("./front-end/story/src", import.meta.url),
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
        explore: "pages/app/explore/index.html",
        stories: "pages/app/stories/index.html",
        storyOfWeek: "pages/app/story-of-week/index.html",
        artists: "pages/app/artists/index.html",
        creators: "pages/app/creators/index.html",
        collections: "pages/app/collections/index.html",
        collection: "pages/app/collection/index.html",
        myCollections: "pages/app/my-collections/index.html",
        create: "pages/app/create/index.html",
        createCollection: "pages/app/create-collection/index.html",
        notifications: "pages/app/notifications/index.html",
        profile: "pages/app/profile/index.html",
        editProfile: "pages/app/profile/edit/index.html",

        settingsAccount: "pages/app/settings/account/index.html",
        settingsPrivacy: "pages/app/settings/privacy/index.html",
        settingsNotifications: "pages/app/settings/notifications/index.html",
        settingsAppearance: "pages/app/settings/appearance/index.html",
        settingsConnectedAccounts:
          "pages/app/settings/connected-accounts/index.html",
        settingsDataStorage: "pages/app/settings/data-storage/index.html",
        settingsSecurity: "pages/app/settings/security/index.html",
        settingsHelpSupport: "pages/app/settings/help-support/index.html",
      },
    },
  },
});

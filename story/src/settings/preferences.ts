/* ===============================================================
   SETTINGS PREFERENCES LAYER

   Typed localStorage helpers shared by every Settings page.
   All keys are prefixed with "the-artwork-stories-" so the
   Data & Storage page can enumerate/clear them safely.

   Existing app keys (reused, not duplicated):
   - the-artwork-stories-profile     (profile + account settings)
   - the-artwork-stories-collections (created collections)

   New settings keys introduced by this section:
   - the-artwork-stories-settings-privacy
   - the-artwork-stories-settings-notifications
   - the-artwork-stories-settings-appearance
   - the-artwork-stories-settings-connected
   - the-artwork-stories-settings-security
   =============================================================== */

import { useEffect } from "react";

const PREFIX = "the-artwork-stories-settings-";

/* ---------------------------------------------------------------
   LOW-LEVEL HELPERS
--------------------------------------------------------------- */

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);

    if (!raw) {
      return fallback;
    }

    return { ...fallback, ...(JSON.parse(raw) as Partial<T>) };
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Storage unavailable or full — fail silently. */
  }
}

export function listSettingsKeys(): string[] {
  const keys: string[] = [];

  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);

    if (key && key.startsWith(PREFIX)) {
      keys.push(key);
    }
  }

  return keys;
}

export function clearSettingsData(): number {
  const keys = listSettingsKeys();

  keys.forEach((key) => localStorage.removeItem(key));

  return keys.length;
}

/* ---------------------------------------------------------------
   PRIVACY
--------------------------------------------------------------- */

export type PrivacySettings = {
  profileVisibility: "public" | "community" | "private";
  showCollections: boolean;
  showLikedArtworks: boolean;
  showActivity: boolean;
  allowSearchIndexing: boolean;
};

export const DEFAULT_PRIVACY: PrivacySettings = {
  profileVisibility: "public",
  showCollections: true,
  showLikedArtworks: false,
  showActivity: true,
  allowSearchIndexing: true,
};

export function loadPrivacy(): PrivacySettings {
  return readJson(`${PREFIX}privacy`, DEFAULT_PRIVACY);
}

export function savePrivacy(value: PrivacySettings): void {
  writeJson(`${PREFIX}privacy`, value);
}

/* ---------------------------------------------------------------
   NOTIFICATIONS
--------------------------------------------------------------- */

export type NotificationSettings = {
  artworkComments: boolean;
  artworkLikes: boolean;
  mentions: boolean;
  newFollowers: boolean;
  collectionActivity: boolean;
  communityUpdates: boolean;
  featuredArtwork: boolean;
  newsletter: boolean;
};

export const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  artworkComments: true,
  artworkLikes: true,
  mentions: true,
  newFollowers: true,
  collectionActivity: false,
  communityUpdates: false,
  featuredArtwork: false,
  newsletter: false,
};

export function loadNotifications(): NotificationSettings {
  return readJson(`${PREFIX}notifications`, DEFAULT_NOTIFICATIONS);
}

export function saveNotifications(value: NotificationSettings): void {
  writeJson(`${PREFIX}notifications`, value);
}

/* ---------------------------------------------------------------
   APPEARANCE
--------------------------------------------------------------- */

export type ThemeMode = "light" | "dark" | "system";

export type AppearanceSettings = {
  theme: ThemeMode;
  accent: string;
  textSize: "small" | "default" | "large";
  language: string;
};

export const ACCENT_OPTIONS = [
  { id: "#24231f", label: "Espresso" },
  { id: "#8a5a2b", label: "Amber" },
  { id: "#3f6212", label: "Olive" },
  { id: "#7c2d12", label: "Terracotta" },
  { id: "#1e3a5f", label: "Ink Blue" },
];

export const DEFAULT_APPEARANCE: AppearanceSettings = {
  theme: "light",
  accent: ACCENT_OPTIONS[0].id,
  textSize: "default",
  language: "English",
};

export function loadAppearance(): AppearanceSettings {
  return readJson(`${PREFIX}appearance`, DEFAULT_APPEARANCE);
}

export function saveAppearance(value: AppearanceSettings): void {
  writeJson(`${PREFIX}appearance`, value);
}

/* ---------------------------------------------------------------
   APPEARANCE APPLICATION (scoped to Settings pages)

   Reads --tas-accent / text size / dark surface from CSS custom
   properties, so nothing outside the Settings section changes.
--------------------------------------------------------------- */

function resolveDarkSurface(theme: ThemeMode): boolean {
  if (theme === "dark") {
    return true;
  }

  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  return false;
}

export function applyAppearance(value: AppearanceSettings): void {
  const root = document.documentElement;

  root.style.setProperty("--tas-accent", value.accent);

  const textSizePx =
    value.textSize === "small"
      ? "14px"
      : value.textSize === "large"
        ? "17px"
        : "15px";

  root.style.setProperty("--tas-settings-text-size", textSizePx);

  const dark = resolveDarkSurface(value.theme);

  root.dataset.tasSettingsTheme = dark ? "dark" : "light";

  /* Keep "System" in sync if the OS theme changes mid-session. */
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const listener = () => {
    if (value.theme === "system") {
      root.dataset.tasSettingsTheme = media.matches ? "dark" : "light";
    }
  };

  media.addEventListener("change", listener);

  return () => media.removeEventListener("change", listener);
}

export function useAppliedAppearance(value: AppearanceSettings): void {
  useEffect(() => {
    const cleanup = applyAppearance(value);

    return () => cleanup?.();
  }, [value]);
}

/* ---------------------------------------------------------------
   CONNECTED ACCOUNTS (frontend-only mock state)
--------------------------------------------------------------- */

export type ConnectedKey = "google" | "email" | "phone";

export type ConnectedAccount = {
  key: ConnectedKey;
  connected: boolean;
  value: string;
};

export type ConnectedState = Record<ConnectedKey, ConnectedAccount>;

export const DEFAULT_CONNECTED: ConnectedState = {
  google: { key: "google", connected: false, value: "yash@gmail.com" },
  email: { key: "email", connected: true, value: "yash@example.com" },
  phone: { key: "phone", connected: false, value: "+91 98765 43210" },
};

export function loadConnected(): ConnectedState {
  return readJson(`${PREFIX}connected`, DEFAULT_CONNECTED);
}

export function saveConnected(value: ConnectedState): void {
  writeJson(`${PREFIX}connected`, value);
}

/* ---------------------------------------------------------------
   SECURITY (frontend-only states)
--------------------------------------------------------------- */

export type SecuritySettings = {
  twoFactorEnabled: boolean;
  otherSessionsSignedOutAt: string | null;
};

export const DEFAULT_SECURITY: SecuritySettings = {
  twoFactorEnabled: false,
  otherSessionsSignedOutAt: null,
};

export function loadSecurity(): SecuritySettings {
  return readJson(`${PREFIX}security`, DEFAULT_SECURITY);
}

export function saveSecurity(value: SecuritySettings): void {
  writeJson(`${PREFIX}security`, value);
}

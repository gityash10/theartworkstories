import { Bell, Heart, Mail, MessageCircle, Sparkles, Users } from "lucide-react";
import { useState } from "react";

import SettingsLayout from "./SettingsLayout";
import {
  DEFAULT_NOTIFICATIONS,
  loadNotifications,
  saveNotifications,
  type NotificationSettings,
} from "./preferences";
import { SavedBadge, Toggle, useSavedIndicator } from "./ui";

/* ===============================================================
   NOTIFICATION PREFERENCES

   This is NOT the notification inbox (that lives at
   /pages/app/notifications/index.html — untouched). These are
   the user's preferences, persisted to
   "the-artwork-stories-settings-notifications".
   =============================================================== */

type PrefKey = keyof NotificationSettings;

const SECTIONS: {
  title: string;
  description: string;
  items: {
    key: PrefKey;
    icon: React.ElementType;
    title: string;
    description: string;
  }[];
}[] = [
  {
    title: "Artwork Activity",
    description: "Stay updated when people interact with your artworks.",
    items: [
      {
        key: "artworkComments",
        icon: MessageCircle,
        title: "Artwork comments",
        description: "Get notified when someone comments on your artwork.",
      },
      {
        key: "artworkLikes",
        icon: Heart,
        title: "Artwork likes",
        description: "Get notified when someone likes your artwork.",
      },
      {
        key: "mentions",
        icon: Bell,
        title: "Mentions",
        description: "Get notified when someone mentions you.",
      },
    ],
  },
  {
    title: "Social Activity",
    description: "Keep up with people and collections you follow.",
    items: [
      {
        key: "newFollowers",
        icon: Users,
        title: "New followers",
        description: "Get notified when someone follows you.",
      },
      {
        key: "collectionActivity",
        icon: Bell,
        title: "Collection activity",
        description: "Updates from collections you follow.",
      },
    ],
  },
  {
    title: "The ArtWork Stories",
    description: "Occasional updates from the community.",
    items: [
      {
        key: "communityUpdates",
        icon: Sparkles,
        title: "Community updates",
        description: "Learn about new features and improvements.",
      },
      {
        key: "featuredArtwork",
        icon: Sparkles,
        title: "Featured artwork",
        description: "Know when an artwork gets featured.",
      },
      {
        key: "newsletter",
        icon: Mail,
        title: "Newsletter",
        description: "Receive occasional emails about art and stories.",
      },
    ],
  },
];

export default function Notifications() {
  const [settings, setSettings] =
    useState<NotificationSettings>(loadNotifications);
  const [savedFlash, flashSaved, savedLabel] = useSavedIndicator();

  const change = (key: PrefKey, value: boolean) => {
    const next = { ...settings, [key]: value };

    setSettings(next);
    saveNotifications(next);
    flashSaved();
  };

  const setAll = (value: boolean) => {
    const next = Object.fromEntries(
      Object.keys(settings).map((key) => [key, value]),
    ) as NotificationSettings;

    setSettings(next);
    saveNotifications(next);
    flashSaved(value ? "All notifications on" : "All notifications off");
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_NOTIFICATIONS);
    saveNotifications(DEFAULT_NOTIFICATIONS);
    flashSaved("Reset to defaults");
  };

  return (
    <SettingsLayout
      activeSection="notifications"
      title="Notifications"
      description="Choose what you want to be notified about."
    >
      <div className="space-y-6">
        {/* Global controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setAll(true)}
            className="h-10 rounded-xl border border-black/10 px-4 text-sm transition hover:bg-black/[0.03]"
          >
            Enable all
          </button>

          <button
            type="button"
            onClick={() => setAll(false)}
            className="h-10 rounded-xl border border-black/10 px-4 text-sm transition hover:bg-black/[0.03]"
          >
            Disable all
          </button>

          <button
            type="button"
            onClick={resetToDefaults}
            className="h-10 rounded-xl border border-black/10 px-4 text-sm transition hover:bg-black/[0.03]"
          >
            Reset to defaults
          </button>

          <SavedBadge show={savedFlash} label={savedLabel} />
        </div>

        {SECTIONS.map((section) => (
          <section
            key={section.title}
            className="tas-card overflow-hidden rounded-2xl border border-black/10 bg-white/45"
          >
            <div className="border-b border-black/10 px-6 py-5 sm:px-8">
              <h2 className="font-display text-2xl">{section.title}</h2>
              <p className="tas-muted mt-1 text-sm text-black/50">
                {section.description}
              </p>
            </div>

            <div className="divide-y divide-black/10">
              {section.items.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.key}
                    className="flex items-center gap-4 px-6 py-5 sm:px-8"
                  >
                    <Icon className="size-5 shrink-0 text-black/50" />

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="tas-muted mt-1 text-xs leading-5 text-black/45">
                        {item.description}
                      </p>
                    </div>

                    <Toggle
                      checked={settings[item.key]}
                      onChange={(value) => change(item.key, value)}
                      label={item.title}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        <p className="text-xs leading-5 text-black/40">
          Looking for your notification inbox instead?{" "}
          <a
            href="/pages/app/notifications/index.html"
            className="underline underline-offset-2 hover:text-black/70"
          >
            Open notifications
          </a>
          .
        </p>
      </div>
    </SettingsLayout>
  );
}

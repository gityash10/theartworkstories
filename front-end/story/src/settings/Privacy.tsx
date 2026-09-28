import { Eye, Globe2, Heart, Search, Users } from "lucide-react";
import { useState } from "react";

import SettingsLayout from "./SettingsLayout";
import { loadPrivacy, savePrivacy, type PrivacySettings } from "./preferences";
import { SavedBadge, Toggle, useSavedIndicator } from "./ui";

/* ===============================================================
   PRIVACY SETTINGS

   All controls persist instantly to localStorage
   ("the-artwork-stories-settings-privacy") with a subtle
   "Saved" confirmation.
   =============================================================== */

export default function Privacy() {
  const [settings, setSettings] = useState<PrivacySettings>(loadPrivacy);
  const [savedFlash, flashSaved, savedLabel] = useSavedIndicator();

  const change = (partial: Partial<PrivacySettings>) => {
    const next = { ...settings, ...partial };

    setSettings(next);
    savePrivacy(next);
    flashSaved();
  };

  return (
    <SettingsLayout
      activeSection="privacy"
      title="Privacy"
      description="Control who can see your profile and activity."
    >
      <div className="space-y-6">
        {/* Profile visibility */}
        <section className="tas-card overflow-hidden rounded-2xl border border-black/10 bg-white/45">
          <div className="border-b border-black/10 px-6 py-5 sm:px-8">
            <h2 className="font-display text-2xl">Profile Visibility</h2>
            <p className="tas-muted mt-1 text-sm text-black/50">
              Choose who can view your profile and artworks.
            </p>
          </div>

          <div className="space-y-3 p-6 sm:p-8">
            <VisibilityOption
              icon={Globe2}
              title="Public"
              description="Anyone can view your profile and artworks."
              selected={settings.profileVisibility === "public"}
              onSelect={() => change({ profileVisibility: "public" })}
            />

            <VisibilityOption
              icon={Users}
              title="Community Only"
              description="Only registered members can view your profile."
              selected={settings.profileVisibility === "community"}
              onSelect={() => change({ profileVisibility: "community" })}
            />

            <VisibilityOption
              icon={Eye}
              title="Private"
              description="Only you can view your profile."
              selected={settings.profileVisibility === "private"}
              onSelect={() => change({ profileVisibility: "private" })}
            />
          </div>
        </section>

        {/* Activity visibility */}
        <section className="tas-card overflow-hidden rounded-2xl border border-black/10 bg-white/45">
          <div className="border-b border-black/10 px-6 py-5 sm:px-8">
            <h2 className="font-display text-2xl">Activity Visibility</h2>
            <p className="tas-muted mt-1 text-sm text-black/50">
              Choose what other people can see about your activity.
            </p>
          </div>

          <div className="divide-y divide-black/10">
            <ToggleRow
              icon={Users}
              title="Show my collections"
              description="Allow others to see your collections."
              enabled={settings.showCollections}
              onChange={(value) => change({ showCollections: value })}
            />

            <ToggleRow
              icon={Heart}
              title="Show my liked artworks"
              description="Allow others to see artworks you like."
              enabled={settings.showLikedArtworks}
              onChange={(value) => change({ showLikedArtworks: value })}
            />

            <ToggleRow
              icon={Eye}
              title="Show my activity"
              description="Show follows, likes and other activity."
              enabled={settings.showActivity}
              onChange={(value) => change({ showActivity: value })}
            />
          </div>
        </section>

        {/* Search visibility */}
        <section className="tas-card rounded-2xl border border-black/10 bg-white/45 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <Search className="mt-0.5 size-5 shrink-0 text-black/55" />

            <div className="min-w-0 flex-1">
              <h2 className="font-display text-xl">Search Visibility</h2>
              <p className="tas-muted mt-1 text-sm text-black/50">
                Allow your profile to appear in search results.
              </p>
            </div>

            <Toggle
              checked={settings.allowSearchIndexing}
              label="Allow profile to appear in search"
              onChange={(value) => change({ allowSearchIndexing: value })}
            />
          </div>
        </section>

        <div className="flex justify-end">
          <SavedBadge show={savedFlash} label={savedLabel} />
        </div>
      </div>
    </SettingsLayout>
  );
}

function VisibilityOption({
  icon: Icon,
  title,
  description,
  selected = false,
  onSelect,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  selected?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition ${
        selected
          ? "border-black/20 bg-black/[0.035]"
          : "border-black/10 bg-white/30 hover:bg-white/60"
      }`}
    >
      <span
        className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full ${
          selected ? "text-white" : "tas-chip bg-black/[0.05]"
        }`}
        style={
          selected
            ? { backgroundColor: "var(--tas-accent, #24231f)" }
            : undefined
        }
      >
        <Icon className="size-4" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{title}</span>
        <span className="mt-1 block text-xs leading-5 text-black/45">
          {description}
        </span>
      </span>

      <span
        className={`mt-2 size-4 shrink-0 rounded-full border ${
          selected ? "ring-4 ring-black/5" : "border-black/20"
        }`}
        style={
          selected
            ? {
                borderColor: "var(--tas-accent, #24231f)",
                backgroundColor: "var(--tas-accent, #24231f)",
              }
            : undefined
        }
      />
    </button>
  );
}

function ToggleRow({
  icon: Icon,
  title,
  description,
  enabled,
  onChange,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-4 px-6 py-5 sm:px-8">
      <Icon className="size-5 shrink-0 text-black/50" />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="tas-muted mt-1 text-xs text-black/45">{description}</p>
      </div>

      <Toggle checked={enabled} onChange={onChange} label={title} />
    </div>
  );
}

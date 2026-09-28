import { Check, Globe2, Monitor, Moon, Palette, Sun } from "lucide-react";
import { useState } from "react";

import SettingsLayout from "./SettingsLayout";
import {
  ACCENT_OPTIONS,
  loadAppearance,
  saveAppearance,
  type AppearanceSettings,
  type ThemeMode,
} from "./preferences";
import { SavedBadge, useSavedIndicator } from "./ui";

/* ===============================================================
   APPEARANCE SETTINGS

   Preferences apply live to the Settings section only (via
   --tas-accent / --tas-settings-zoom / data-tas-settings-theme,
   see styles.css). The rest of the app keeps its exact design.
   =============================================================== */

export default function Appearance() {
  const [settings, setSettings] = useState<AppearanceSettings>(loadAppearance);
  const [savedFlash, flashSaved, savedLabel] = useSavedIndicator();

  const change = (partial: Partial<AppearanceSettings>) => {
    const next = { ...settings, ...partial };

    setSettings(next);
    saveAppearance(next);
    flashSaved();
  };

  return (
    <SettingsLayout
      activeSection="appearance"
      title="Appearance"
      description="Customize how The ArtWork Stories looks for you."
    >
      <div className="space-y-6">
        {/* Theme */}
        <section className="tas-card rounded-2xl border border-black/10 bg-white/45 p-6 sm:p-8">
          <h2 className="font-display text-2xl">Theme</h2>

          <p className="tas-muted mt-1 text-sm text-black/50">
            Choose how the website should appear.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <ThemeCard
              icon={Sun}
              label="Light"
              selected={settings.theme === "light"}
              onSelect={() => change({ theme: "light" as ThemeMode })}
            />

            <ThemeCard
              icon={Moon}
              label="Dark"
              selected={settings.theme === "dark"}
              onSelect={() => change({ theme: "dark" as ThemeMode })}
            />

            <ThemeCard
              icon={Monitor}
              label="System"
              selected={settings.theme === "system"}
              onSelect={() => change({ theme: "system" as ThemeMode })}
            />
          </div>

          <p className="mt-4 text-xs text-black/40">
            Dark mode applies to the Settings pages. Extending it across the
            whole app is planned with the theme rollout.
          </p>
        </section>

        {/* Accent colour */}
        <section className="tas-card rounded-2xl border border-black/10 bg-white/45 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <Palette className="size-5 text-black/55" />

            <div>
              <h2 className="font-display text-2xl">Accent Colour</h2>
              <p className="tas-muted mt-1 text-sm text-black/50">
                Used for highlights and primary buttons across Settings.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {ACCENT_OPTIONS.map((option) => {
              const selected = settings.accent === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  aria-label={`Accent colour ${option.label}`}
                  aria-pressed={selected}
                  onClick={() => change({ accent: option.id })}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
                    selected
                      ? "border-black/25 bg-black/[0.04]"
                      : "border-black/10 hover:bg-black/[0.03]"
                  }`}
                >
                  <span
                    className="flex size-6 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: option.id }}
                  >
                    {selected && <Check className="size-3" />}
                  </span>
                  {option.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Text size */}
        <section className="tas-card rounded-2xl border border-black/10 bg-white/45 p-6 sm:p-8">
          <h2 className="font-display text-2xl">Text Size</h2>

          <p className="tas-muted mt-1 text-sm text-black/50">
            Adjust the text size across Settings.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-2 rounded-xl bg-black/[0.035] p-1">
            {(
              [
                ["small", "Small"],
                ["default", "Default"],
                ["large", "Large"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => change({ textSize: value })}
                className={`rounded-lg px-4 py-3 text-sm transition ${
                  settings.textSize === value
                    ? "bg-white shadow-sm"
                    : "text-black/60 hover:bg-white/60"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Language */}
        <section className="tas-card rounded-2xl border border-black/10 bg-white/45 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <Globe2 className="mt-1 size-5 text-black/50" />

            <div className="min-w-0 flex-1">
              <h2 className="font-display text-2xl">Language</h2>

              <p className="tas-muted mt-1 text-sm text-black/50">
                Choose your preferred language.
              </p>

              <select
                value={settings.language}
                onChange={(event) => change({ language: event.target.value })}
                className="tas-input mt-5 h-11 w-full rounded-xl border border-black/10 bg-white/60 px-4 text-sm outline-none focus:border-black/25"
              >
                <option value="English">English</option>
              </select>

              <p className="mt-3 text-xs text-black/40">
                More languages arrive with the translation system.
              </p>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <SavedBadge show={savedFlash} label={savedLabel} />
        </div>
      </div>
    </SettingsLayout>
  );
}

function ThemeCard({
  icon: Icon,
  label,
  selected = false,
  onSelect,
}: {
  icon: React.ElementType;
  label: string;
  selected?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`relative flex min-h-[120px] flex-col items-center justify-center rounded-xl border transition ${
        selected
          ? "border-black/25 bg-[#f0e8db]"
          : "border-black/10 bg-white/30 hover:bg-white/60"
      }`}
    >
      {selected && (
        <span
          className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: "var(--tas-accent, #24231f)" }}
        >
          <Check className="size-3" />
        </span>
      )}

      <Icon className="size-6 text-black/60" />

      <span className="mt-3 text-sm">{label}</span>
    </button>
  );
}

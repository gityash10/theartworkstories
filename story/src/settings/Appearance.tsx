import { Check, Globe2, Monitor, Moon, Sun } from "lucide-react";
import SettingsLayout from "./SettingsLayout";

export default function Appearance() {
  return (
    <SettingsLayout
      activeSection="appearance"
      title="Appearance"
      description="Customize how The ArtWork Stories looks for you."
    >
      <div className="space-y-6">
        <section className="rounded-2xl border border-black/10 bg-white/45 p-6 sm:p-8">
          <h2 className="font-display text-2xl">Theme</h2>

          <p className="mt-1 text-sm text-black/50">
            Choose how the website should appear.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <ThemeCard icon={Sun} label="Light" selected />

            <ThemeCard icon={Moon} label="Dark" />

            <ThemeCard icon={Monitor} label="System" />
          </div>
        </section>

        <section className="rounded-2xl border border-black/10 bg-white/45 p-6 sm:p-8">
          <h2 className="font-display text-2xl">Text Size</h2>

          <p className="mt-1 text-sm text-black/50">
            Adjust the text size across the app.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-2 rounded-xl bg-black/[0.035] p-1">
            <button className="rounded-lg px-4 py-3 text-sm text-black/60 hover:bg-white">
              Small
            </button>

            <button className="rounded-lg bg-white px-4 py-3 text-sm shadow-sm">
              Medium
            </button>

            <button className="rounded-lg px-4 py-3 text-sm text-black/60 hover:bg-white">
              Large
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-black/10 bg-white/45 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <Globe2 className="mt-1 size-5 text-black/50" />

            <div className="min-w-0 flex-1">
              <h2 className="font-display text-2xl">Language</h2>

              <p className="mt-1 text-sm text-black/50">
                Choose your preferred language.
              </p>

              <select className="mt-5 h-11 w-full rounded-xl border border-black/10 bg-white/60 px-4 text-sm outline-none focus:border-black/25">
                <option>English</option>
              </select>
            </div>
          </div>
        </section>
      </div>
    </SettingsLayout>
  );
}

function ThemeCard({
  icon: Icon,
  label,
  selected = false,
}: {
  icon: React.ElementType;
  label: string;
  selected?: boolean;
}) {
  return (
    <button
      type="button"
      className={`relative flex min-h-[120px] flex-col items-center justify-center rounded-xl border transition ${
        selected
          ? "border-black/25 bg-[#f0e8db]"
          : "border-black/10 bg-white/30 hover:bg-white/60"
      }`}
    >
      {selected && (
        <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-[#24231f] text-white">
          <Check className="size-3" />
        </span>
      )}

      <Icon className="size-6 text-black/60" />

      <span className="mt-3 text-sm">{label}</span>
    </button>
  );
}
import { Eye, Globe2, Heart, Search, Users } from "lucide-react";
import SettingsLayout from "./SettingsLayout";

export default function Privacy() {
  return (
    <SettingsLayout
      activeSection="privacy"
      title="Privacy"
      description="Control who can see your profile and activity."
    >
      <div className="space-y-6">
        <section className="rounded-2xl border border-black/10 bg-white/45">
          <div className="border-b border-black/10 px-6 py-5 sm:px-8">
            <h2 className="font-display text-2xl">Profile Visibility</h2>
            <p className="mt-1 text-sm text-black/50">
              Choose who can view your profile and artworks.
            </p>
          </div>

          <div className="space-y-3 p-6 sm:p-8">
            <VisibilityOption
              icon={Globe2}
              title="Public"
              description="Anyone can view your profile and artworks."
              selected
            />

            <VisibilityOption
              icon={Users}
              title="Community Only"
              description="Only registered members can view your profile."
            />

            <VisibilityOption
              icon={Eye}
              title="Private"
              description="Only you can view your profile."
            />
          </div>
        </section>

        <section className="rounded-2xl border border-black/10 bg-white/45">
          <div className="border-b border-black/10 px-6 py-5 sm:px-8">
            <h2 className="font-display text-2xl">Activity Visibility</h2>
            <p className="mt-1 text-sm text-black/50">
              Choose what other people can see about your activity.
            </p>
          </div>

          <div className="divide-y divide-black/10">
            <ToggleRow
              icon={Users}
              title="Show my collections"
              description="Allow others to see your collections."
              enabled
            />

            <ToggleRow
              icon={Heart}
              title="Show my liked artworks"
              description="Allow others to see artworks you like."
            />

            <ToggleRow
              icon={Eye}
              title="Show my activity"
              description="Show follows, likes and other activity."
              enabled
            />
          </div>
        </section>

        <section className="rounded-2xl border border-black/10 bg-white/45 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <Search className="mt-0.5 size-5 shrink-0 text-black/55" />

            <div className="min-w-0 flex-1">
              <h2 className="font-display text-xl">Search Visibility</h2>
              <p className="mt-1 text-sm text-black/50">
                Allow your profile to appear in search results.
              </p>
            </div>

            <Toggle enabled />
          </div>
        </section>
      </div>
    </SettingsLayout>
  );
}

function VisibilityOption({
  icon: Icon,
  title,
  description,
  selected = false,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  selected?: boolean;
}) {
  return (
    <button
      type="button"
      className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition ${
        selected
          ? "border-black/20 bg-black/[0.035]"
          : "border-black/10 bg-white/30 hover:bg-white/60"
      }`}
    >
      <span
        className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full ${
          selected ? "bg-[#24231f] text-white" : "bg-black/[0.05]"
        }`}
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
          selected
            ? "border-[#24231f] bg-[#24231f] ring-4 ring-black/5"
            : "border-black/20"
        }`}
      />
    </button>
  );
}

function ToggleRow({
  icon: Icon,
  title,
  description,
  enabled = false,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  enabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 px-6 py-5 sm:px-8">
      <Icon className="size-5 shrink-0 text-black/50" />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-xs text-black/45">{description}</p>
      </div>

      <Toggle enabled={enabled} />
    </div>
  );
}

function Toggle({ enabled = false }: { enabled?: boolean }) {
  return (
    <span
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        enabled ? "bg-[#24231f]" : "bg-black/15"
      }`}
    >
      <span
        className={`absolute top-1 size-4 rounded-full bg-white shadow-sm transition ${
          enabled ? "left-6" : "left-1"
        }`}
      />
    </span>
  );
}
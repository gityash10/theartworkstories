import {
  BookOpen,
  ExternalLink,
  Flag,
  HelpCircle,
  MessageCircle,
  ShieldCheck,
  FileText,
} from "lucide-react";
import SettingsLayout from "./SettingsLayout";

export default function HelpSupport() {
  return (
    <SettingsLayout
      activeSection="help-support"
      title="Help & Support"
      description="Get help, report problems, or learn more about The ArtWork Stories."
    >
      <div className="space-y-6">
        <section className="overflow-hidden rounded-2xl border border-black/10 bg-white/45">
          <div className="border-b border-black/10 px-6 py-5 sm:px-8">
            <h2 className="font-display text-2xl">Help</h2>
            <p className="mt-1 text-sm text-black/50">
              Find answers and get help with The ArtWork Stories.
            </p>
          </div>

          <div className="divide-y divide-black/10">
            <HelpRow
              icon={BookOpen}
              title="Help Center"
              description="Browse guides and frequently asked questions."
            />

            <HelpRow
              icon={MessageCircle}
              title="Contact Support"
              description="Reach out if you need help with something."
            />

            <HelpRow
              icon={ShieldCheck}
              title="Community Guidelines"
              description="Learn about community rules and expectations."
            />

            <HelpRow
              icon={Flag}
              title="Report a Problem"
              description="Tell us about an issue you found."
            />

            <HelpRow
              icon={MessageCircle}
              title="Feedback"
              description="Share an idea or suggestion."
            />
          </div>
        </section>

        <section className="rounded-2xl border border-black/10 bg-white/45 p-6 sm:p-8">
          <h2 className="font-display text-2xl">Legal & Information</h2>

          <div className="mt-5 space-y-2">
            <SimpleLink label="Terms of Service" />
            <SimpleLink label="Privacy Policy" />
            <SimpleLink label="Community Guidelines" />
          </div>
        </section>

        <section className="rounded-2xl bg-[#e8ddca] p-6 sm:p-8">
          <HelpCircle className="size-7 text-black/55" />

          <h2 className="mt-5 font-display text-3xl">
            We're here to help.
          </h2>

          <p className="mt-2 max-w-[500px] text-sm leading-6 text-black/55">
            Have a question or feedback? We'd love to hear from you.
          </p>

          <button
            type="button"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#24231f] px-5 py-3 text-sm text-white hover:bg-black"
          >
            Contact Support
            <ExternalLink className="size-4" />
          </button>
        </section>
      </div>
    </SettingsLayout>
  );
}

function HelpRow({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-4 px-6 py-5 text-left transition hover:bg-black/[0.025] sm:px-8"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-black/[0.045]">
        <Icon className="size-4 text-black/55" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{title}</span>
        <span className="mt-1 block text-xs leading-5 text-black/45">
          {description}
        </span>
      </span>

      <span className="text-black/30">→</span>
    </button>
  );
}

function SimpleLink({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-black/65 hover:bg-black/[0.035] hover:text-black"
    >
      <FileText className="size-4" />
      <span className="flex-1">{label}</span>
      <ExternalLink className="size-3.5 text-black/30" />
    </button>
  );
}
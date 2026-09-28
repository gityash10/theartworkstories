import { Check, ExternalLink, Pencil, ShieldCheck } from "lucide-react";
import SettingsLayout from "./SettingsLayout";

export default function Account() {
  return (
    <SettingsLayout
      activeSection="account"
      title="Account"
      description="Manage your account information and profile details."
    >
      <div className="space-y-6">
        {/* Profile */}
        <section className="rounded-2xl border border-black/10 bg-white/45 p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative shrink-0">
              <div className="flex size-24 items-center justify-center overflow-hidden rounded-full bg-[#292723] font-display text-3xl text-white">
                Y
              </div>

              <button
                type="button"
                className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full border-2 border-[#f4eee2] bg-[#24231f] text-white"
              >
                <Pencil className="size-3.5" />
              </button>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                Profile
              </p>

              <h2 className="mt-2 font-display text-3xl">Yash Jain</h2>

              <p className="mt-1 text-sm text-black/50">@yashjain</p>

              <a
                href="../profile/index.html"
                className="mt-4 inline-flex items-center gap-2 text-sm underline underline-offset-4"
              >
                View Profile
                <ExternalLink className="size-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* Basic information */}
        <section className="rounded-2xl border border-black/10 bg-white/45">
          <div className="border-b border-black/10 px-6 py-5 sm:px-8">
            <h2 className="font-display text-2xl">Basic Information</h2>
            <p className="mt-1 text-sm text-black/50">
              Information visible on your ArtWork Stories profile.
            </p>
          </div>

          <div className="space-y-5 p-6 sm:p-8">
            <Field label="Name" value="Yash Jain" />

            <Field
              label="Username"
              value="yashjain"
              helper="This is how others see you on The ArtWork Stories."
            />

            <div>
              <label className="text-sm font-medium">Email</label>

              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <div className="flex h-11 flex-1 items-center rounded-xl border border-black/10 bg-white/50 px-4 text-sm">
                  yash@example.com
                </div>

                <Verified />
                <button className="h-11 rounded-xl border border-black/10 px-5 text-sm hover:bg-black/[0.03]">
                  Change
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Phone</label>

              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <div className="flex h-11 flex-1 items-center rounded-xl border border-black/10 bg-white/50 px-4 text-sm">
                  +91 98765 43210
                </div>

                <Verified />
                <button className="h-11 rounded-xl border border-black/10 px-5 text-sm hover:bg-black/[0.03]">
                  Change
                </button>
              </div>
            </div>

            <Field label="Location" value="Indore, Madhya Pradesh" />

            <div>
              <label className="text-sm font-medium">Website</label>

              <div className="mt-2 flex h-11 items-center rounded-xl border border-black/10 bg-white/50 px-4">
                <span className="min-w-0 flex-1 truncate text-sm text-black/70">
                  https://jainyashportfolio.vercel.app
                </span>

                <ExternalLink className="size-4 shrink-0 text-black/40" />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="../profile/edit/index.html"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#24231f] px-5 text-sm text-white hover:bg-black"
              >
                <Pencil className="size-4" />
                Edit Profile
              </a>
            </div>
          </div>
        </section>

        {/* Membership */}
        <section className="rounded-2xl border border-black/10 bg-white/45 p-6 sm:p-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-black/40">
            Account
          </p>

          <div className="mt-3 flex items-center justify-between gap-5">
            <div>
              <h2 className="font-display text-2xl">Member since</h2>
              <p className="mt-1 text-sm text-black/50">September 2026</p>
            </div>

            <ShieldCheck className="size-7 text-black/35" />
          </div>
        </section>
      </div>
    </SettingsLayout>
  );
}

function Field({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>

      <div className="mt-2 flex min-h-11 items-center rounded-xl border border-black/10 bg-white/50 px-4 text-sm">
        {value}
      </div>

      {helper && <p className="mt-1.5 text-xs text-black/40">{helper}</p>}
    </div>
  );
}

function Verified() {
  return (
    <span className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#e4f2e2] px-3 text-xs text-[#356c32]">
      <Check className="size-3.5" />
      Verified
    </span>
  );
}
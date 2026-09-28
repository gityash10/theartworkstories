import { CheckCircle2, Lock, Monitor, ShieldCheck } from "lucide-react";
import SettingsLayout from "./SettingsLayout";

export default function Security() {
  return (
    <SettingsLayout
      activeSection="security"
      title="Security"
      description="Keep your account secure."
    >
      <div className="space-y-6">
        <section className="rounded-2xl border border-black/10 bg-white/45 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <Lock className="size-5 text-black/55" />

            <div>
              <h2 className="font-display text-2xl">Password</h2>
              <p className="mt-1 text-sm text-black/50">
                Manage your account password.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="flex h-11 flex-1 items-center rounded-xl border border-black/10 bg-white/50 px-4 text-sm tracking-[0.3em]">
              ••••••••
            </div>

            <button className="h-11 rounded-xl border border-black/10 px-5 text-sm hover:bg-black/[0.03]">
              Change Password
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-black/10 bg-white/45 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-black/55" />

            <div className="min-w-0 flex-1">
              <h2 className="font-display text-2xl">
                Two-Factor Authentication
              </h2>

              <p className="mt-1 text-sm leading-6 text-black/50">
                Add an extra layer of security to your account.
              </p>
            </div>

            <Toggle />
          </div>

          <div className="mt-5 rounded-xl bg-[#e9f2f8] p-4 text-xs leading-5 text-[#31566f]">
            Two-factor authentication will be available when the account
            authentication system is connected.
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-black/10 bg-white/45">
          <div className="border-b border-black/10 px-6 py-5 sm:px-8">
            <h2 className="font-display text-2xl">Active Sessions</h2>
            <p className="mt-1 text-sm text-black/50">
              Manage where your account is currently signed in.
            </p>
          </div>

          <div className="divide-y divide-black/10">
            <Session
              current
              title="Windows · Chrome"
              location="Indore, India"
            />

            <Session title="Android · Chrome" location="India" />
          </div>

          <div className="border-t border-black/10 p-6 sm:p-8">
            <button className="w-full rounded-xl border border-red-200 bg-red-50 py-3 text-sm text-red-600 hover:bg-red-100">
              Sign out of all other devices
            </button>
          </div>
        </section>
      </div>
    </SettingsLayout>
  );
}

function Toggle() {
  return (
    <span className="relative h-6 w-11 shrink-0 rounded-full bg-black/15">
      <span className="absolute left-1 top-1 size-4 rounded-full bg-white shadow-sm" />
    </span>
  );
}

function Session({
  title,
  location,
  current = false,
}: {
  title: string;
  location: string;
  current?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 px-6 py-5 sm:px-8">
      <div className="flex size-10 items-center justify-center rounded-full bg-black/[0.05]">
        <Monitor className="size-5 text-black/50" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>

        <p className="mt-1 text-xs text-black/45">
          {location} · {current ? "Active now" : "Recently active"}
        </p>
      </div>

      {current && (
        <span className="inline-flex items-center gap-1.5 text-xs text-[#3b7437]">
          <CheckCircle2 className="size-3.5" />
          Current
        </span>
      )}
    </div>
  );
}
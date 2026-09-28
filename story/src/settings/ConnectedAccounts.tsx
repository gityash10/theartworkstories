import { Check, Github, Mail, Phone, Plus } from "lucide-react";
import SettingsLayout from "./SettingsLayout";

export default function ConnectedAccounts() {
  return (
    <SettingsLayout
      activeSection="connected-accounts"
      title="Connected Accounts"
      description="Manage the accounts you use to sign in."
    >
      <div className="space-y-6">
        <section className="overflow-hidden rounded-2xl border border-black/10 bg-white/45">
          <div className="border-b border-black/10 px-6 py-5 sm:px-8">
            <h2 className="font-display text-2xl">Your Accounts</h2>
            <p className="mt-1 text-sm text-black/50">
              These accounts can be used to access your ArtWork Stories
              account.
            </p>
          </div>

          <div className="divide-y divide-black/10">
            <AccountRow
              icon="google"
              title="Google"
              description="Sign in with Google."
              value="yash@gmail.com"
              connected
            />

            <AccountRow
              icon={<Mail className="size-5" />}
              title="Email"
              description="Sign in with your email address."
              value="yash@example.com"
              connected
            />

            <AccountRow
              icon={<Phone className="size-5" />}
              title="Phone"
              description="Sign in with your phone number."
              value="+91 98765 43210"
              connected
            />
          </div>
        </section>

        <section className="rounded-2xl border border-black/10 bg-white/45 p-6 sm:p-8">
          <h2 className="font-display text-2xl">Connect Another Account</h2>

          <p className="mt-1 text-sm text-black/50">
            Add another sign-in method to your account.
          </p>

          <div className="mt-5 space-y-3">
            <ConnectRow label="GitHub" icon={<Github className="size-5" />} />

            <ConnectRow label="Apple" icon={<span className="text-lg">●</span>} />
          </div>
        </section>

        <div className="rounded-xl border border-black/10 bg-black/[0.025] p-5 text-xs leading-5 text-black/45">
          Connected account functionality will be connected to Firebase when
          authentication is implemented.
        </div>
      </div>
    </SettingsLayout>
  );
}

function AccountRow({
  icon,
  title,
  description,
  value,
  connected,
}: {
  icon: React.ReactNode | "google";
  title: string;
  description: string;
  value: string;
  connected: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:px-8">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black/[0.05]">
        {icon === "google" ? (
          <span className="font-bold text-[#4285F4]">G</span>
        ) : (
          icon
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-xs text-black/45">{description}</p>
        <p className="mt-2 truncate text-xs text-black/55">{value}</p>
      </div>

      <div className="flex items-center gap-3">
        {connected && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#e4f2e2] px-3 py-1.5 text-[11px] text-[#356c32]">
            <Check className="size-3" />
            Connected
          </span>
        )}

        <button
          type="button"
          className="rounded-lg border border-black/10 px-4 py-2 text-xs hover:bg-black/[0.03]"
        >
          {connected ? "Disconnect" : "Connect"}
        </button>
      </div>
    </div>
  );
}

function ConnectRow({
  label,
  icon,
}: {
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-black/10 bg-white/35 p-4">
      <span className="flex size-9 items-center justify-center rounded-full bg-black/[0.05]">
        {icon}
      </span>

      <span className="flex-1 text-sm">{label}</span>

      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 px-4 py-2 text-xs hover:bg-black/[0.03]"
      >
        <Plus className="size-3.5" />
        Connect
      </button>
    </div>
  );
}
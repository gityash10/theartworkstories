import { Check, Mail, Phone, X } from "lucide-react";
import { useState } from "react";

import SettingsLayout from "./SettingsLayout";
import {
  loadConnected,
  saveConnected,
  type ConnectedKey,
  type ConnectedState,
} from "./preferences";
import { SavedBadge, useSavedIndicator } from "./ui";

/* ===============================================================
   CONNECTED ACCOUNTS

   Frontend-only. Connection state is local UI state persisted to
   "the-artwork-stories-settings-connected". No OAuth, no fake
   auth — every action states that real linking needs account
   integration (Firebase later).

   To swap in Firebase later: replace loadConnected/saveConnected
   with the provider-linking calls; the row UI stays the same.
   =============================================================== */

function AccountGlyph({ provider }: { provider: ConnectedKey }) {
  if (provider === "google") {
    return <span className="font-bold text-[#4285F4]">G</span>;
  }

  if (provider === "email") {
    return <Mail className="size-5 text-black/60" />;
  }

  return <Phone className="size-5 text-black/60" />;
}

export default function ConnectedAccounts() {
  const [accounts, setAccounts] = useState<ConnectedState>(loadConnected);
  const [savedFlash, flashSaved, savedLabel] = useSavedIndicator();

  const setConnection = (key: ConnectedKey, connected: boolean) => {
    const next: ConnectedState = {
      ...accounts,
      [key]: { ...accounts[key], connected },
    };

    setAccounts(next);
    saveConnected(next);
    flashSaved();
  };

  return (
    <SettingsLayout
      activeSection="connected-accounts"
      title="Connected Accounts"
      description="Manage the accounts you use to sign in."
    >
      <div className="space-y-6">
        <section className="tas-card overflow-hidden rounded-2xl border border-black/10 bg-white/45">
          <div className="border-b border-black/10 px-6 py-5 sm:px-8">
            <h2 className="font-display text-2xl">Your Accounts</h2>
            <p className="tas-muted mt-1 text-sm text-black/50">
              These accounts can be used to access your ArtWork Stories account.
            </p>
          </div>

          <div className="divide-y divide-black/10">
            {(Object.keys(accounts) as ConnectedKey[]).map((key) => {
              const account = accounts[key];

              return (
                <div
                  key={key}
                  className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:px-8"
                >
                  <div className="tas-chip flex size-10 shrink-0 items-center justify-center rounded-full bg-black/[0.05]">
                    <AccountGlyph provider={key} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">
                      {key === "google"
                        ? "Google"
                        : key === "email"
                          ? "Email"
                          : "Phone"}
                    </p>

                    <p className="tas-muted mt-1 text-xs text-black/45">
                      Sign in with your {key === "phone" ? "phone number" : key}
                      .
                    </p>

                    <p className="mt-2 truncate text-xs text-black/55">
                      {account.value}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    {account.connected ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#e4f2e2] px-3 py-1.5 text-[11px] text-[#356c32]">
                        <Check className="size-3" />
                        Connected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-black/[0.05] px-3 py-1.5 text-[11px] text-black/50">
                        <X className="size-3" />
                        Not connected
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => setConnection(key, !account.connected)}
                      className="rounded-lg border border-black/10 px-4 py-2 text-xs transition hover:bg-black/[0.03]"
                    >
                      {account.connected ? "Disconnect" : "Connect"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="rounded-xl border border-black/10 bg-black/[0.025] p-5 text-xs leading-5 text-black/45">
          Connection status is saved locally in your browser for now. Real
          account linking (Google sign-in, phone verification) will be enabled
          when authentication is integrated.
        </div>

        <div className="flex justify-end">
          <SavedBadge show={savedFlash} label={savedLabel} />
        </div>
      </div>
    </SettingsLayout>
  );
}

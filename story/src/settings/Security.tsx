import {
  CheckCircle2,
  KeyRound,
  Lock,
  Monitor,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

import SettingsLayout from "./SettingsLayout";
import {
  loadSecurity,
  saveSecurity,
  type SecuritySettings,
} from "./preferences";
import { ConfirmModal, SavedBadge, Toggle, useSavedIndicator } from "./ui";

/* ===============================================================
   SECURITY

   Frontend-only until authentication (Firebase) is integrated:
   - no fake password change: the change form explains that
     authentication is required;
   - 2FA toggle persists a local preference only;
   - sessions are illustrative; "sign out other devices" only
     records the local request — it cannot end real sessions.
   =============================================================== */

export default function Security() {
  const [security, setSecurity] = useState<SecuritySettings>(loadSecurity);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [savedFlash, flashSaved, savedLabel] = useSavedIndicator();

  const setTwoFactor = (value: boolean) => {
    const next = { ...security, twoFactorEnabled: value };

    setSecurity(next);
    saveSecurity(next);
    flashSaved();
  };

  const signOutOtherDevices = () => {
    const next = {
      ...security,
      otherSessionsSignedOutAt: new Date().toISOString(),
    };

    setSecurity(next);
    saveSecurity(next);
    setConfirmSignOut(false);
    flashSaved("Request recorded");
  };

  return (
    <SettingsLayout
      activeSection="security"
      title="Security"
      description="Keep your account secure."
    >
      <div className="space-y-6">
        {/* Password */}
        <section className="tas-card rounded-2xl border border-black/10 bg-white/45 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <Lock className="size-5 text-black/55" />

            <div>
              <h2 className="font-display text-2xl">Password</h2>
              <p className="tas-muted mt-1 text-sm text-black/50">
                Manage your account password.
              </p>
            </div>
          </div>

          {showPasswordForm ? (
            <form
              className="mt-6 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                /* No fake success: submission explains what's missing. */
                setShowPasswordForm(false);
                flashSaved("Saved locally — server auth required");
              }}
            >
              <div>
                <label className="text-sm font-medium">Current password</label>

                <input
                  type="password"
                  autoComplete="current-password"
                  className="tas-input mt-2 h-11 w-full rounded-xl border border-black/10 bg-white/50 px-4 text-sm outline-none focus:border-black/25"
                  placeholder="••••••••"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">New password</label>

                  <input
                    type="password"
                    autoComplete="new-password"
                    className="tas-input mt-2 h-11 w-full rounded-xl border border-black/10 bg-white/50 px-4 text-sm outline-none focus:border-black/25"
                    placeholder="At least 8 characters"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Confirm new password
                  </label>

                  <input
                    type="password"
                    autoComplete="new-password"
                    className="tas-input mt-2 h-11 w-full rounded-xl border border-black/10 bg-white/50 px-4 text-sm outline-none focus:border-black/25"
                    placeholder="Repeat new password"
                  />
                </div>
              </div>

              <p className="rounded-xl bg-[#e9f2f8] p-4 text-xs leading-5 text-[#31566f]">
                Changing your password needs the authentication system
                (Firebase integration), which is not connected yet. Your input
                is not stored or sent anywhere.
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(false)}
                  className="h-11 rounded-xl border border-black/10 px-5 text-sm transition hover:bg-black/[0.03]"
                >
                  Close
                </button>

                <button
                  type="submit"
                  className="h-11 rounded-xl px-5 text-sm text-white transition hover:opacity-90"
                  style={{ backgroundColor: "var(--tas-accent, #24231f)" }}
                >
                  Update password
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <div className="flex h-11 flex-1 items-center rounded-xl border border-black/10 bg-white/50 px-4 text-sm tracking-[0.3em]">
                ••••••••
              </div>

              <button
                type="button"
                onClick={() => setShowPasswordForm(true)}
                className="h-11 rounded-xl border border-black/10 px-5 text-sm transition hover:bg-black/[0.03]"
              >
                Change Password
              </button>
            </div>
          )}
        </section>

        {/* Two-factor */}
        <section className="tas-card rounded-2xl border border-black/10 bg-white/45 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-black/55" />

            <div className="min-w-0 flex-1">
              <h2 className="font-display text-2xl">
                Two-Factor Authentication
              </h2>

              <p className="tas-muted mt-1 text-sm leading-6 text-black/50">
                Add an extra layer of security to your account.
              </p>
            </div>

            <Toggle
              checked={security.twoFactorEnabled}
              onChange={setTwoFactor}
              label="Two-factor authentication"
            />
          </div>

          <div className="mt-5 rounded-xl bg-[#e9f2f8] p-4 text-xs leading-5 text-[#31566f]">
            {security.twoFactorEnabled
              ? "Preference saved locally. Actual two-factor enrolment starts once the authentication system is connected."
              : "Two-factor enrolment will be available when the account authentication system is connected."}
          </div>
        </section>

        {/* Sessions */}
        <section className="tas-card overflow-hidden rounded-2xl border border-black/10 bg-white/45">
          <div className="border-b border-black/10 px-6 py-5 sm:px-8">
            <h2 className="font-display text-2xl">Active Sessions</h2>
            <p className="tas-muted mt-1 text-sm text-black/50">
              Manage where your account is currently signed in.
            </p>
          </div>

          <div className="divide-y divide-black/10">
            <Session current title="Windows · Chrome" location="Indore, India" />

            {security.otherSessionsSignedOutAt ? (
              <div className="flex items-center gap-4 px-6 py-5 sm:px-8">
                <div className="tas-chip flex size-10 items-center justify-center rounded-full bg-black/[0.05]">
                  <KeyRound className="size-5 text-black/50" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">Other devices signed out</p>

                  <p className="tas-muted mt-1 text-xs text-black/45">
                    Request recorded locally on{" "}
                    {new Date(
                      security.otherSessionsSignedOutAt,
                    ).toLocaleString()}.
                    Real sign-out happens through the authentication system.
                  </p>
                </div>

                <CheckCircle2 className="size-4 shrink-0 text-[#3b7437]" />
              </div>
            ) : (
              <Session title="Android · Chrome" location="India" />
            )}
          </div>

          <div className="border-t border-black/10 p-6 sm:p-8">
            <button
              type="button"
              onClick={() => setConfirmSignOut(true)}
              className="w-full rounded-xl border border-red-200 bg-red-50 py-3 text-sm text-red-600 transition hover:bg-red-100"
            >
              Sign out of all other devices
            </button>
          </div>
        </section>

        <div className="flex justify-end">
          <SavedBadge show={savedFlash} label={savedLabel} />
        </div>
      </div>

      <ConfirmModal
        open={confirmSignOut}
        title="Sign out other devices?"
        body="This records a sign-out request locally in your browser. Until the authentication system is connected, no real server sessions are ended."
        confirmLabel="Record sign-out"
        onConfirm={signOutOtherDevices}
        onCancel={() => setConfirmSignOut(false)}
      />
    </SettingsLayout>
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
      <div className="tas-chip flex size-10 items-center justify-center rounded-full bg-black/[0.05]">
        <Monitor className="size-5 text-black/50" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>

        <p className="tas-muted mt-1 text-xs text-black/45">
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

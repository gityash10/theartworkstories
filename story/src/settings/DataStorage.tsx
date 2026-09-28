import {
  AlertTriangle,
  Download,
  FileDown,
  HardDrive,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

import SettingsLayout from "./SettingsLayout";
import {
  clearSettingsData,
  listSettingsKeys,
} from "./preferences";
import { ConfirmModal, SavedBadge, useSavedIndicator } from "./ui";

/* ===============================================================
   DATA & STORAGE

   Everything runs against the browser's localStorage only:
   - usage is computed from real stored bytes (with a mock media
     baseline, since images aren't stored locally);
   - "Download My Data" exports profile + settings + collections
     as JSON — nothing is sent anywhere;
   - "Clear Temporary Data" removes ONLY the app's own
     the-artwork-stories-* keys (never the whole storage).
   =============================================================== */

const PROFILE_KEY = "the-artwork-stories-profile";
const COLLECTIONS_KEY = "the-artwork-stories-collections";

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);

    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function bytesOf(key: string): number {
  return (localStorage.getItem(key) ?? "").length;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function downloadFile(name: string, content: string) {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = name;
  anchor.click();

  URL.revokeObjectURL(url);
}

export default function DataStorage() {
  const [savedFlash, flashSaved, savedLabel] = useSavedIndicator();
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const settingsKeys = useMemo(() => listSettingsKeys(), []);
  const settingsBytes = useMemo(
    () => settingsKeys.reduce((total, key) => total + bytesOf(key), 0),
    [settingsKeys],
  );

  const profileBytes = useMemo(() => bytesOf(PROFILE_KEY), []);
  const collectionsBytes = useMemo(() => bytesOf(COLLECTIONS_KEY), []);

  /* Mock media baseline — uploaded images live server-side later. */
  const mediaBytes = 80 * 1024 * 1024;
  const usedBytes = mediaBytes + profileBytes + collectionsBytes + settingsBytes;
  const quotaBytes = 1024 * 1024 * 1024;
  const usedPercent = Math.max(2, Math.round((usedBytes / quotaBytes) * 100));

  const downloadAllData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      note: "Local export from your browser. Nothing was sent to any server.",
      profile: readJson<Record<string, unknown>>(PROFILE_KEY, {}),
      collections: readJson<unknown[]>(COLLECTIONS_KEY, []),
      settings: Object.fromEntries(
        settingsKeys.map((key) => [
          key,
          readJson<unknown>(key, {}),
        ]),
      ),
    };

    downloadFile("the-artwork-stories-data.json", JSON.stringify(payload, null, 2));
    flashSaved("Data downloaded");
  };

  const exportCollections = () => {
    const collections = readJson<unknown[]>(COLLECTIONS_KEY, []);

    downloadFile(
      "the-artwork-stories-collections.json",
      JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          count: collections.length,
          collections,
        },
        null,
        2,
      ),
    );
    flashSaved("Collections exported");
  };

  const clearTemporaryData = () => {
    const removed = clearSettingsData();

    setConfirmClear(false);
    flashSaved(`Cleared ${removed} temp ${removed === 1 ? "item" : "items"}`);
  };

  return (
    <SettingsLayout
      activeSection="data-storage"
      title="Data & Storage"
      description="Manage your data and storage preferences."
    >
      <div className="space-y-6">
        {/* Storage usage */}
        <section className="tas-card rounded-2xl border border-black/10 bg-white/45 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <HardDrive className="size-5 text-black/55" />

            <div>
              <h2 className="font-display text-2xl">Storage Usage</h2>
              <p className="tas-muted mt-1 text-sm text-black/50">
                Your current storage usage.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-end justify-between">
              <span className="text-sm">
                {formatBytes(usedBytes)} used
              </span>
              <span className="text-xs text-black/40">
                {formatBytes(quotaBytes)}
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/[0.08]">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${usedPercent}%`,
                  backgroundColor: "var(--tas-accent, #24231f)",
                }}
              />
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <StorageItem
              label="Profile media"
              value={`${formatBytes(mediaBytes)} (est.)`}
            />
            <StorageItem
              label="Profile & settings"
              value={formatBytes(profileBytes + settingsBytes)}
            />
            <StorageItem
              label="Collections data"
              value={formatBytes(collectionsBytes)}
            />
          </div>
        </section>

        {/* Manage data */}
        <section className="tas-card overflow-hidden rounded-2xl border border-black/10 bg-white/45">
          <div className="border-b border-black/10 px-6 py-5 sm:px-8">
            <h2 className="font-display text-2xl">Manage Data</h2>
            <p className="tas-muted mt-1 text-sm text-black/50">
              Download or manage information associated with your account.
            </p>
          </div>

          <div className="divide-y divide-black/10">
            <ActionRow
              icon={Download}
              title="Download My Data"
              description="Get a copy of your profile, settings and collections as JSON."
              actionLabel="Download"
              onAction={downloadAllData}
            />

            <ActionRow
              icon={FileDown}
              title="Export Collections"
              description="Download your collections as a JSON file."
              actionLabel="Export"
              onAction={exportCollections}
            />

            <ActionRow
              icon={Trash2}
              title="Clear Temporary Data"
              description="Removes locally saved settings from this browser. Profile and collections are kept."
              actionLabel="Clear"
              onAction={() => setConfirmClear(true)}
            />
          </div>
        </section>

        {/* Danger zone */}
        <section className="rounded-2xl border border-red-200 bg-red-50/50 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle className="size-5" />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="font-display text-2xl text-red-700">
                Danger Zone
              </h2>

              <p className="mt-1 text-sm text-red-700/65">
                Permanently delete your account and associated data.
              </p>

              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
              >
                <Trash2 className="size-4" />
                Delete Account
              </button>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <SavedBadge show={savedFlash} label={savedLabel} />
        </div>
      </div>

      {/* Clear confirm */}
      <ConfirmModal
        open={confirmClear}
        title="Clear temporary data?"
        body="This removes the app's locally saved settings from this browser (notification, privacy, appearance and security preferences). Your profile and collections are not touched. This cannot be undone."
        confirmLabel="Clear data"
        tone="danger"
        onConfirm={clearTemporaryData}
        onCancel={() => setConfirmClear(false)}
      />

      {/* Delete confirm */}
      <ConfirmModal
        open={confirmDelete}
        title="Delete account?"
        body="Account deletion requires the account system (Firebase integration), which is not connected yet. Nothing will be deleted right now — your account and data stay exactly as they are. This page exists so the flow is ready once authentication is implemented."
        confirmLabel="I understand"
        onConfirm={() => setConfirmDelete(false)}
        onCancel={() => setConfirmDelete(false)}
      />
    </SettingsLayout>
  );
}

function StorageItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="tas-subtle rounded-xl bg-black/[0.025] p-4">
      <p className="text-xs text-black/45">{label}</p>
      <p className="mt-2 text-sm font-medium">{value}</p>
    </div>
  );
}

function ActionRow({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:px-8">
      <Icon className="size-5 shrink-0 text-black/50" />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="tas-muted mt-1 text-xs leading-5 text-black/45">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onAction}
        className="h-10 shrink-0 rounded-xl border border-black/10 px-4 text-sm transition hover:bg-black/[0.03]"
      >
        {actionLabel}
      </button>
    </div>
  );
}

import {
  Download,
  FileDown,
  HardDrive,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import SettingsLayout from "./SettingsLayout";

export default function DataStorage() {
  return (
    <SettingsLayout
      activeSection="data-storage"
      title="Data & Storage"
      description="Manage your data and storage preferences."
    >
      <div className="space-y-6">
        <section className="rounded-2xl border border-black/10 bg-white/45 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <HardDrive className="size-5 text-black/55" />

            <div>
              <h2 className="font-display text-2xl">Storage Usage</h2>
              <p className="mt-1 text-sm text-black/50">
                Your current storage usage.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-end justify-between">
              <span className="text-sm">120 MB used</span>
              <span className="text-xs text-black/40">1 GB</span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/[0.08]">
              <div className="h-full w-[12%] rounded-full bg-[#24231f]" />
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <StorageItem label="Profile media" value="80 MB" />
            <StorageItem label="Uploaded artworks" value="32 MB" />
            <StorageItem label="Other data" value="8 MB" />
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-black/10 bg-white/45">
          <div className="border-b border-black/10 px-6 py-5 sm:px-8">
            <h2 className="font-display text-2xl">Manage Data</h2>
            <p className="mt-1 text-sm text-black/50">
              Download or manage information associated with your account.
            </p>
          </div>

          <div className="divide-y divide-black/10">
            <ActionRow
              icon={Download}
              title="Download My Data"
              description="Get a copy of your account data."
            />

            <ActionRow
              icon={FileDown}
              title="Export Collections"
              description="Download your collections as a file."
            />

            <ActionRow
              icon={Trash2}
              title="Clear Temporary Data"
              description="Remove cached and temporary data."
            />
          </div>
        </section>

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
                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="size-4" />
                Delete Account
              </button>
            </div>
          </div>
        </section>
      </div>
    </SettingsLayout>
  );
}

function StorageItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-black/[0.025] p-4">
      <p className="text-xs text-black/45">{label}</p>
      <p className="mt-2 text-sm font-medium">{value}</p>
    </div>
  );
}

function ActionRow({
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
      <Icon className="size-5 shrink-0 text-black/50" />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-xs text-black/45">{description}</p>
      </div>

      <span className="text-black/35">→</span>
    </button>
  );
}
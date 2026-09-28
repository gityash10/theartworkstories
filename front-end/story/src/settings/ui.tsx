import { Check } from "lucide-react";
import {
  useCallback,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";

/* ===============================================================
   SHARED SETTINGS UI PRIMITIVES

   Small building blocks reused by every Settings page so the
   behaviour (persistence, confirmations, theming) stays uniform.

   Theming: components read --tas-accent (set by SettingsLayout
   from the Appearance preferences) so the accent colour applies
   to Settings without touching the rest of the app.
   =============================================================== */

/* ---------------------------------------------------------------
   TOGGLE
--------------------------------------------------------------- */

export function Toggle({
  checked,
  onChange,
  disabled = false,
  label,
}: {
  checked: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      style={{
        backgroundColor: checked
          ? "var(--tas-accent, #24231f)"
          : "rgba(0, 0, 0, 0.15)",
      }}
      className="relative h-6 w-11 shrink-0 rounded-full transition disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span
        className={`absolute top-1 size-4 rounded-full bg-white shadow-sm transition-all ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

/* ---------------------------------------------------------------
   SAVED CONFIRMATION
--------------------------------------------------------------- */

export function useSavedIndicator(
  timeout = 2200,
): [boolean, (label?: string) => void, string] {
  const [visible, setVisible] = useState(false);
  const [lastLabel, setLastLabel] = useState("Saved");
  const timer = useRef<number | undefined>(undefined);

  const flash = useCallback(
    (label = "Saved") => {
      setLastLabel(label);
      setVisible(true);

      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setVisible(false), timeout);
    },
    [timeout],
  );

  return [visible, flash, lastLabel];
}

export function SavedBadge({
  show,
  label = "Saved",
}: {
  show: boolean;
  label?: string;
}) {
  return (
    <span
      aria-live="polite"
      className={`inline-flex items-center gap-1.5 rounded-full bg-[#e4f2e2] px-3 py-1.5 text-[11px] font-medium text-[#356c32] transition ${
        show ? "opacity-100" : "pointer-events-none translate-y-0.5 opacity-0"
      }`}
    >
      <Check className="size-3" />
      {label}
    </span>
  );
}

/* ---------------------------------------------------------------
   CARD / SECTION
--------------------------------------------------------------- */

export function Card({
  title,
  description,
  children,
  padded = false,
  tone = "default",
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  padded?: boolean;
  tone?: "default" | "danger";
}) {
  return (
    <section
      className={`tas-card overflow-hidden rounded-2xl border ${
        tone === "danger"
          ? "border-red-200 bg-red-50/50"
          : "border-black/10 bg-white/45"
      }`}
    >
      {title && (
        <div className="border-b border-black/10 px-6 py-5 sm:px-8">
          <h2 className="tas-heading font-display text-2xl">{title}</h2>

          {description && (
            <p className="tas-muted mt-1 text-sm text-black/50">
              {description}
            </p>
          )}
        </div>
      )}

      <div className={padded ? "p-6 sm:p-8" : ""}>{children}</div>
    </section>
  );
}

/* ---------------------------------------------------------------
   INPUTS
--------------------------------------------------------------- */

export function TextInput({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`tas-input h-11 w-full rounded-xl border border-black/10 bg-white/50 px-4 text-sm text-[#1d1b1a] outline-none transition placeholder:text-black/35 focus:border-black/25 focus:bg-white/80 ${className}`}
    />
  );
}

export function TextArea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`tas-input min-h-[96px] w-full resize-y rounded-xl border border-black/10 bg-white/50 px-4 py-3 text-sm leading-6 text-[#1d1b1a] outline-none transition placeholder:text-black/35 focus:border-black/25 focus:bg-white/80 ${className}`}
    />
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="text-sm font-medium">{children}</label>;
}

export function FieldHelper({ children }: { children: ReactNode }) {
  return <p className="tas-muted mt-1.5 text-xs text-black/40">{children}</p>;
}

/* ---------------------------------------------------------------
   CONFIRM MODAL
--------------------------------------------------------------- */

export function ConfirmModal({
  open,
  title,
  body,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "neutral",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  body: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "neutral" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-5 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-[460px] rounded-2xl bg-[#f4eee2] p-6 shadow-2xl sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="font-display text-2xl">{title}</h2>

        <div className="mt-2 text-sm leading-6 text-black/55">{body}</div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="h-11 rounded-xl border border-black/10 px-5 text-sm transition hover:bg-black/[0.03]"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`h-11 rounded-xl px-5 text-sm text-white transition ${
              tone === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : "hover:opacity-90"
            }`}
            style={
              tone === "danger"
                ? undefined
                : { backgroundColor: "var(--tas-accent, #24231f)" }
            }
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   VERIFIED PILL
--------------------------------------------------------------- */

export function VerifiedPill({ label = "Verified" }: { label?: string }) {
  return (
    <span className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#e4f2e2] px-3 text-xs text-[#356c32]">
      <Check className="size-3.5" />
      {label}
    </span>
  );
}

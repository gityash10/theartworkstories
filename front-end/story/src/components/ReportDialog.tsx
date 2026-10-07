/*
 * Report UI — a reusable "Report" trigger plus the dialog that
 * files a report through the reports data layer.
 *
 * The dialog follows the product's modal pattern (fixed backdrop,
 * rounded panel, header with a close button) and is deliberately
 * self-contained: each trigger owns its own open/success state, so
 * a page can drop one next to an artwork, a collection, a comment
 * or a comment author without wiring anything up.
 *
 * Duplicate handling is explicit. The data layer derives the
 * report ID from target + reporter + reason, so a second identical
 * report is structurally impossible; this component checks the
 * user's own deterministic document when a reason is picked and
 * shows an "already reported" state instead of offering a write
 * that cannot happen.
 */

import { useEffect, useState, type FormEvent } from "react";

import { Flag, X } from "lucide-react";

import {
  REPORT_DESCRIPTION_MAX,
  REPORT_REASON_LABELS,
  REPORT_REASONS,
  createReport,
  hasReportedTarget,
  type ReportReason,
  type ReportTargetType,
} from "../data/firestore/reports";

type ReportButtonProps = {
  targetType: ReportTargetType;

  targetId: string;

  /** Noun used in the copy, e.g. "artwork", "comment", "user". */
  targetLabel: string;

  /** "pill" matches the page action rows; "icon" matches row tools. */
  variant?: "pill" | "icon";

  /** Trigger text/tooltip; defaults to "Report". */
  label?: string;
};

export default function ReportButton({
  targetType,
  targetId,
  targetLabel,
  variant = "pill",
  label = "Report",
}: ReportButtonProps) {
  const [open, setOpen] = useState(false);

  const [reason, setReason] = useState<ReportReason | null>(null);

  const [description, setDescription] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [checking, setChecking] = useState(false);

  const [alreadyReported, setAlreadyReported] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  const [error, setError] = useState<string | null>(null);

  /*
   * When a reason is chosen, find out whether this exact report
   * already exists. This reads only the user's own deterministic
   * document, never the collection.
   */
  useEffect(() => {
    if (!open || !reason) {
      return;
    }

    let cancelled = false;

    setChecking(true);

    hasReportedTarget({ targetType, targetId, reason })
      .then((reported) => {
        if (!cancelled) {
          setAlreadyReported(reported);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setChecking(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open, reason, targetType, targetId]);

  /* Escape closes the dialog, like any other modal surface. */
  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const close = () => {
    setOpen(false);

    setReason(null);

    setDescription("");

    setAlreadyReported(false);

    setSubmitted(false);

    setError(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!reason || submitting || alreadyReported) {
      return;
    }

    setSubmitting(true);

    setError(null);

    try {
      const result = await createReport({
        targetType,

        targetId,

        reason,

        description: description || null,
      });

      setAlreadyReported(result.alreadyReported);

      setSubmitted(true);
    } catch (submitError) {
      /*
       * Validation and rules failures are shown as they are —
       * no false success, no swallowing.
       */
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We couldn't send your report — please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = Boolean(reason) && !submitting && !checking && !alreadyReported;

  return (
    <>
      {variant === "icon" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          title={label}
          aria-label={label}
          className="rounded-full p-2 text-black/40 transition hover:bg-black/[0.05] hover:text-black"
        >
          <Flag className="size-3.5" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-black/15 px-4 py-2.5 text-sm transition hover:bg-black hover:text-white"
        >
          <Flag className="size-4" />
          {label}
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/45 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`Report ${targetLabel}`}
        >
          <div className="max-h-[92vh] w-full max-w-xl overflow-hidden rounded-t-[2rem] bg-[#f5f1e8] shadow-2xl sm:rounded-[2rem]">
            <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
              <h2 className="font-display text-2xl">
                Report {targetLabel}
              </h2>

              <button
                type="button"
                onClick={close}
                aria-label="Close report dialog"
                className="flex size-9 items-center justify-center rounded-full border border-black/10 transition hover:bg-black hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="max-h-[calc(92vh-88px)] overflow-y-auto px-6 py-6">
              {submitted ? (
                <div>
                  <p className="text-sm leading-6 text-black/70">
                    {alreadyReported
                      ? "You have already reported this. Our team has your report and will review it."
                      : "Thanks — your report has been sent for review."}
                  </p>

                  <p className="mt-3 text-xs leading-5 text-black/45">
                    Reports are private. The person you reported is not told
                    who filed it.
                  </p>

                  <button
                    type="button"
                    onClick={close}
                    className="mt-6 inline-flex h-10 items-center rounded-full bg-black px-5 text-sm text-white transition hover:bg-black/80"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <fieldset>
                    <legend className="text-xs uppercase tracking-[0.2em] text-black/45">
                      Why are you reporting this?
                    </legend>

                    <div className="mt-4 space-y-2">
                      {REPORT_REASONS.map((value) => (
                        <label
                          key={value}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                            reason === value
                              ? "border-black/40 bg-white"
                              : "border-black/10 bg-white/60 hover:bg-white"
                          }`}
                        >
                          <input
                            type="radio"
                            name="report-reason"
                            value={value}
                            checked={reason === value}
                            onChange={() => {
                              setError(null);

                              setAlreadyReported(false);

                              setReason(value);
                            }}
                            className="size-4 accent-black"
                          />

                          {REPORT_REASON_LABELS[value]}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <label className="mt-6 block">
                    <span className="text-xs uppercase tracking-[0.2em] text-black/45">
                      Anything else? (optional)
                    </span>

                    <textarea
                      value={description}
                      onChange={(event) => {
                        setDescription(event.target.value);

                        setError(null);
                      }}
                      rows={4}
                      maxLength={REPORT_DESCRIPTION_MAX}
                      placeholder="Add any detail that helps us review this."
                      className="mt-3 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm leading-6 transition focus:border-black/40 focus:outline-none"
                    />

                    <span className="mt-1 block text-xs text-black/40">
                      {description.length}/{REPORT_DESCRIPTION_MAX}
                    </span>
                  </label>

                  {reason && alreadyReported && (
                    <p className="mt-4 rounded-xl border border-black/10 bg-white/70 px-4 py-3 text-sm text-black/65">
                      You have already reported this for this reason.
                    </p>
                  )}

                  {error && (
                    <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </p>
                  )}

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      disabled={!canSubmit}
                      className="inline-flex h-10 items-center rounded-full bg-black px-5 text-sm text-white transition hover:bg-black/80 disabled:opacity-50"
                    >
                      {submitting ? "Sending…" : "Submit report"}
                    </button>

                    <button
                      type="button"
                      onClick={close}
                      disabled={submitting}
                      className="inline-flex h-10 items-center rounded-full border border-black/10 bg-white px-5 text-sm transition hover:bg-black/[0.03] disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  </div>

                  <p className="mt-4 text-xs leading-5 text-black/45">
                    Reports are private — the person you report is not told who
                    filed it.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

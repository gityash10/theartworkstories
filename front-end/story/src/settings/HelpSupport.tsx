import {
  BookOpen,
  ChevronDown,
  ExternalLink,
  Flag,
  Heart,
  HelpCircle,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

import SettingsLayout from "./SettingsLayout";
import { SavedBadge, useSavedIndicator } from "./ui";

/* ===============================================================
   HELP & SUPPORT

   Every action has a real destination — no dead buttons:
   - Help Center expands an inline FAQ (no help page exists);
   - Contact / Report use mailto: links;
   - Community Guidelines opens the existing Contribute page;
   - Feedback saves locally with a thank-you confirmation;
   - Terms / Privacy Policy open readable modals (no dedicated
     legal pages exist, so no broken routes are invented).
   =============================================================== */

const SUPPORT_EMAIL = "support@theartworkstories.example";

const FAQ_ITEMS = [
  {
    question: "How do I share an artwork?",
    answer:
      "Open the sidebar and choose “Share an Artwork”, or use the Share buttons on Discover. You'll be asked whether the work is your own or someone else's, then guided through adding the artwork and its story.",
  },
  {
    question: "How do collections work?",
    answer:
      "From Profile, open My Collections and use “Create Collection”. Give it a title, description and visibility, then add artworks from any artwork or collection page.",
  },
  {
    question: "Can I edit my profile later?",
    answer:
      "Yes. Use Account → Edit Profile or the Edit button on your profile page. Changes are saved to your browser immediately and reflected on your profile.",
  },
  {
    question: "Where do my settings apply?",
    answer:
      "Privacy, notification and appearance preferences are saved on this device and apply across the app as their features roll out.",
  },
];

export default function HelpSupport() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [legalModal, setLegalModal] = useState<"terms" | "privacy" | null>(
    null,
  );
  const [feedback, setFeedback] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [savedFlash, flashSaved, savedLabel] = useSavedIndicator();

  const sendFeedback = () => {
    if (!feedback.trim()) {
      return;
    }

    try {
      localStorage.setItem(
        "the-artwork-stories-settings-feedback",
        JSON.stringify({
          message: feedback.trim(),
          sentAt: new Date().toISOString(),
        }),
      );
    } catch {
      /* Storage unavailable — still show the confirmation. */
    }

    setFeedbackSent(true);
    setFeedback("");
    flashSaved("Thank you — feedback received");
  };

  return (
    <SettingsLayout
      activeSection="help-support"
      title="Help & Support"
      description="Get help, report problems, or learn more about The ArtWork Stories."
    >
      <div className="space-y-6">
        {/* Help Center (inline FAQ) */}
        <section className="tas-card overflow-hidden rounded-2xl border border-black/10 bg-white/45">
          <div className="border-b border-black/10 px-6 py-5 sm:px-8">
            <h2 className="font-display text-2xl">Help Center</h2>
            <p className="tas-muted mt-1 text-sm text-black/50">
              Browse guides and frequently asked questions.
            </p>
          </div>

          <div className="divide-y divide-black/10">
            {FAQ_ITEMS.map((item, index) => {
              const open = openFaq === index;

              return (
                <div key={item.question}>
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : index)}
                    className="flex w-full items-center gap-4 px-6 py-5 text-left transition hover:bg-black/[0.025] sm:px-8"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-black/[0.045]">
                      <BookOpen className="size-4 text-black/55" />
                    </span>

                    <span className="min-w-0 flex-1 text-sm font-medium">
                      {item.question}
                    </span>

                    <ChevronDown
                      className={`size-4 shrink-0 text-black/35 transition ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {open && (
                    <p className="px-6 pb-5 pl-[76px] text-sm leading-6 text-black/55 sm:px-8 sm:pl-[88px]">
                      {item.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact & community */}
        <section className="tas-card overflow-hidden rounded-2xl border border-black/10 bg-white/45">
          <div className="border-b border-black/10 px-6 py-5 sm:px-8">
            <h2 className="font-display text-2xl">Get in touch</h2>
            <p className="tas-muted mt-1 text-sm text-black/50">
              Reach out or explore how the community works.
            </p>
          </div>

          <div className="divide-y divide-black/10">
            <LinkRow
              icon={Mail}
              title="Contact Support"
              description="Email the team and get a reply in your inbox."
              href={`mailto:${SUPPORT_EMAIL}?subject=Support%20request%20—%20The%20ArtWork%20Stories`}
            />

            <LinkRow
              icon={ShieldCheck}
              title="Community Guidelines"
              description="Learn how the community works and what we expect."
              href="/pages/contribution/index.html"
            />

            <LinkRow
              icon={Flag}
              title="Report a Problem"
              description="Tell us about an issue you found."
              href={`mailto:${SUPPORT_EMAIL}?subject=Problem%20report%20—%20The%20ArtWork%20Stories`}
            />
          </div>
        </section>

        {/* Feedback */}
        <section className="tas-card rounded-2xl border border-black/10 bg-white/45 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <Heart className="size-5 text-black/55" />

            <div>
              <h2 className="font-display text-2xl">Feedback</h2>
              <p className="tas-muted mt-1 text-sm text-black/50">
                Share an idea or suggestion — we read every note.
              </p>
            </div>
          </div>

          {feedbackSent ? (
            <div className="mt-5 rounded-xl bg-[#e4f2e2] p-5 text-sm leading-6 text-[#356c32]">
              Thank you — your feedback was received. It's stored on this device
              for now and will reach the team as soon as the backend is
              connected.
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              <textarea
                value={feedback}
                onChange={(event) => setFeedback(event.target.value)}
                placeholder="What could be better? What do you love?"
                className="tas-input min-h-[96px] w-full resize-y rounded-xl border border-black/10 bg-white/50 px-4 py-3 text-sm leading-6 outline-none focus:border-black/25"
              />

              <button
                type="button"
                onClick={sendFeedback}
                className="h-11 rounded-xl px-5 text-sm text-white transition hover:opacity-90"
                style={{ backgroundColor: "var(--tas-accent, #24231f)" }}
              >
                Send feedback
              </button>
            </div>
          )}
        </section>

        {/* Legal */}
        <section className="tas-card rounded-2xl border border-black/10 bg-white/45 p-6 sm:p-8">
          <h2 className="font-display text-2xl">Legal & Information</h2>

          <div className="mt-5 space-y-2">
            <button
              type="button"
              onClick={() => setLegalModal("terms")}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-black/65 transition hover:bg-black/[0.035] hover:text-black"
            >
              <BookOpen className="size-4" />
              <span className="flex-1">Terms of Service</span>
              <ExternalLink className="size-3.5 text-black/30" />
            </button>

            <button
              type="button"
              onClick={() => setLegalModal("privacy")}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-black/65 transition hover:bg-black/[0.035] hover:text-black"
            >
              <ShieldCheck className="size-4" />
              <span className="flex-1">Privacy Policy</span>
              <ExternalLink className="size-3.5 text-black/30" />
            </button>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-[#e8ddca] p-6 sm:p-8">
          <HelpCircle className="size-7 text-black/55" />

          <h2 className="mt-5 font-display text-3xl">We're here to help.</h2>

          <p className="mt-2 max-w-[500px] text-sm leading-6 text-black/55">
            Have a question or feedback? We'd love to hear from you.
          </p>

          <a
            href={`mailto:${SUPPORT_EMAIL}?subject=Hello%20—%20The%20ArtWork%20Stories`}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#24231f] px-5 py-3 text-sm text-white transition hover:bg-black"
          >
            Contact Support
            <ExternalLink className="size-4" />
          </a>
        </section>

        <div className="flex justify-end">
          <SavedBadge show={savedFlash} label={savedLabel} />
        </div>
      </div>

      {/* Legal modal */}
      {legalModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-5 backdrop-blur-sm"
          onClick={() => setLegalModal(null)}
        >
          <div
            className="tas-modal max-h-[80vh] w-full max-w-[560px] overflow-y-auto rounded-2xl bg-[#f4eee2] p-6 shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-display text-2xl">
                {legalModal === "terms" ? "Terms of Service" : "Privacy Policy"}
              </h2>

              <button
                type="button"
                onClick={() => setLegalModal(null)}
                aria-label="Close"
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-black/[0.05] transition hover:bg-black/[0.1]"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm leading-6 text-black/60">
              {legalModal === "terms" ? (
                <>
                  <p>
                    The ArtWork Stories is a community for sharing artworks and
                    the stories behind them. By using the app you agree to share
                    only work you created or have permission to share, and to
                    credit original creators wherever possible.
                  </p>
                  <p>
                    Content that is harmful, misleading or misattributed may be
                    removed. These terms will be expanded into their own page as
                    the platform grows.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Your profile information, collections and preferences are
                    stored locally in your browser. Nothing is sent to a server
                    today — uploads, sync and analytics arrive with the backend
                    integration.
                  </p>
                  <p>
                    You can export or clear your data at any time from{" "}
                    <strong>Data & Storage</strong> in Settings.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </SettingsLayout>
  );
}

function LinkRow({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex w-full items-center gap-4 px-6 py-5 transition hover:bg-black/[0.025] sm:px-8"
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
    </a>
  );
}

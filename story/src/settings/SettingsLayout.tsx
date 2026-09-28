import {
  Bell,
  Bookmark,
  ChevronDown,
  Compass,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Settings as SettingsIcon,
  User,
  X,
  Shield,
  Palette,
  Link2,
  Database,
  HelpCircle,
  Lock,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import {
  loadAppearance,
  useAppliedAppearance,
} from "./preferences";

type SettingsSection =
  | "account"
  | "privacy"
  | "notifications"
  | "appearance"
  | "connected-accounts"
  | "data-storage"
  | "security"
  | "help-support";

interface SettingsLayoutProps {
  activeSection: SettingsSection;
  title: string;
  description: string;
  children: ReactNode;
}

const settingsItems: {
  id: SettingsSection;
  label: string;
  href: string;
  icon: React.ElementType;
}[] = [
  {
    id: "account",
    label: "Account",
    href: "../account/index.html",
    icon: User,
  },
  {
    id: "privacy",
    label: "Privacy",
    href: "../privacy/index.html",
    icon: Lock,
  },
  {
    id: "notifications",
    label: "Notifications",
    href: "../notifications/index.html",
    icon: Bell,
  },
  {
    id: "appearance",
    label: "Appearance",
    href: "../appearance/index.html",
    icon: Palette,
  },
  {
    id: "connected-accounts",
    label: "Connected Accounts",
    href: "../connected-accounts/index.html",
    icon: Link2,
  },
  {
    id: "data-storage",
    label: "Data & Storage",
    href: "../data-storage/index.html",
    icon: Database,
  },
  {
    id: "security",
    label: "Security",
    href: "../security/index.html",
    icon: Shield,
  },
  {
    id: "help-support",
    label: "Help & Support",
    href: "../help-support/index.html",
    icon: HelpCircle,
  },
];

export default function SettingsLayout({
  activeSection,
  title,
  description,
  children,
}: SettingsLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareQuestionOpen, setShareQuestionOpen] = useState(false);

  /*
   * Apply the saved appearance preferences (accent, text size,
   * theme) to the Settings section. Scoped via CSS custom
   * properties so nothing outside Settings changes.
   */
  const appearance = useMemo(() => loadAppearance(), []);
  useAppliedAppearance(appearance);

  useEffect(() => {
    return () => {
      delete document.documentElement.dataset.tasSettingsTheme;
    };
  }, []);

  const openShareQuestion = () => {
    setShareQuestionOpen(true);
  };

  const closeShareQuestion = () => {
    setShareQuestionOpen(false);
  };

  const continueToCreate = (type: "own" | "other") => {
    window.location.href = `../../create/index.html?type=${type}`;
  };

  return (
    <div className="tas-settings-root min-h-screen bg-[#f4eee2] text-[#211f1b]">
      {/* =========================================================
          DESKTOP GLOBAL SIDEBAR
          Same visual language as Discover
          ========================================================= */}

      <aside
        className={`fixed left-0 top-0 z-50 hidden h-screen flex-col bg-[#1d1c19] text-[#f5efe4] transition-all duration-300 lg:flex ${
          sidebarOpen ? "w-[220px]" : "w-[72px]"
        }`}
      >
        {/* Logo */}
        <div
          className={`border-b border-white/10 py-7 transition-all ${
            sidebarOpen ? "px-7" : "px-3"
          }`}
        >
          <a
            href="../../home/index.html"
            className={`block font-display leading-[0.95] ${
              sidebarOpen ? "text-[24px]" : "text-center text-[18px]"
            }`}
          >
            {sidebarOpen ? (
              <>
                The ArtWork
                <br />
                Stories
              </>
            ) : (
              "TAS"
            )}
          </a>
        </div>

        {/* Sidebar toggle */}
        <button
          type="button"
          onClick={() => setSidebarOpen((value) => !value)}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          className={`absolute -right-3 top-[78px] flex size-7 items-center justify-center rounded-full border border-white/10 bg-[#24231f] text-white shadow-lg transition hover:scale-105 ${
            sidebarOpen ? "" : "rotate-180"
          }`}
        >
          {sidebarOpen ? (
            <PanelLeftClose className="size-3.5" />
          ) : (
            <PanelLeftOpen className="size-3.5" />
          )}
        </button>

        {/* Global navigation */}
        <nav className="mt-8 flex flex-col gap-2 px-3">
          <a
            href="../../discover/index.html"
            title="Discover"
            className={`flex items-center rounded-md py-3 text-sm text-white/70 transition hover:bg-white/5 hover:text-white ${
              sidebarOpen ? "gap-4 px-5" : "justify-center px-0"
            }`}
          >
            <Compass className="size-5 shrink-0" />
            {sidebarOpen && <span>Discover</span>}
          </a>

          <a
            href="../../collections/index.html"
            title="Collections"
            className={`flex items-center rounded-md py-3 text-sm text-white/70 transition hover:bg-white/5 hover:text-white ${
              sidebarOpen ? "gap-4 px-5" : "justify-center px-0"
            }`}
          >
            <Bookmark className="size-5 shrink-0" />
            {sidebarOpen && <span>Collections</span>}
          </a>

          <div className="my-2 h-px bg-white/10" />

          <button
            type="button"
            onClick={openShareQuestion}
            title="Share an Artwork"
            className={`flex w-full items-center rounded-md py-3 text-left text-sm text-white/70 transition hover:bg-white/5 hover:text-white ${
              sidebarOpen ? "gap-4 px-5" : "justify-center px-0"
            }`}
          >
            <Plus className="size-5 shrink-0" />
            {sidebarOpen && <span>Share an Artwork</span>}
          </button>

          <div className="my-2 h-px bg-white/10" />

          <a
            href="../../profile/index.html"
            title="Profile"
            className={`flex items-center rounded-md py-3 text-sm text-white/70 transition hover:bg-white/5 hover:text-white ${
              sidebarOpen ? "gap-4 px-5" : "justify-center px-0"
            }`}
          >
            <User className="size-5 shrink-0" />
            {sidebarOpen && <span>Profile</span>}
          </a>

          <a
            href="../account/index.html"
            title="Settings"
            className="flex items-center rounded-md bg-white/10 py-3 text-sm"
          >
            <span
              className={
                sidebarOpen
                  ? "flex items-center gap-4 px-5"
                  : "flex w-full justify-center px-0"
              }
            >
              <SettingsIcon className="size-5 shrink-0" />
              {sidebarOpen && <span>Settings</span>}
            </span>
          </a>
        </nav>

        {/* Quote */}
        {sidebarOpen && (
          <div className="mt-auto px-7 pb-8">
            <div className="mb-5 h-px bg-white/10" />

            <p className="font-display text-sm leading-6 text-white/55">
              “Art is a conversation
              <br />
              across time.”
            </p>

            <div className="mt-5 h-px w-8 bg-white/40" />
          </div>
        )}
      </aside>

      {/* =========================================================
          MOBILE HEADER
          ========================================================= */}

      <header className="relative flex h-16 items-center justify-between border-b border-black/10 bg-[#f4eee2] px-5 lg:hidden">
        <a
          href="../../home/index.html"
          className="font-display text-xl leading-none"
        >
          The ArtWork Stories
        </a>

        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          className="rounded-full p-2"
          aria-label="Open menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </button>

        {menuOpen && (
          <div className="absolute right-5 top-14 z-50 w-56 overflow-hidden rounded-xl border border-black/10 bg-[#24231f] p-2 text-white shadow-xl">
            <a
              href="../../discover/index.html"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-white/10"
              onClick={() => setMenuOpen(false)}
            >
              <Compass className="size-4" />
              Discover
            </a>

            <a
              href="../../collections/index.html"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-white/10"
              onClick={() => setMenuOpen(false)}
            >
              <Bookmark className="size-4" />
              Collections
            </a>

            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                openShareQuestion();
              }}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm hover:bg-white/10"
            >
              <Plus className="size-4" />
              Share an Artwork
            </button>

            <a
              href="../../profile/index.html"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-white/10"
              onClick={() => setMenuOpen(false)}
            >
              <User className="size-4" />
              Profile
            </a>

            <a
              href="../account/index.html"
              className="flex items-center gap-3 rounded-lg bg-white/10 px-4 py-3 text-sm"
              onClick={() => setMenuOpen(false)}
            >
              <SettingsIcon className="size-4" />
              Settings
            </a>
          </div>
        )}
      </header>

      {/* =========================================================
          MAIN
          ========================================================= */}

      <main
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-[220px]" : "lg:ml-[72px]"
        }`}
      >
        

        {/* Content */}
        <div className="mx-auto max-w-[1250px] px-5 py-8 sm:px-8 lg:px-10">
          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-[0.25em] text-black/40">
              Settings
            </p>

            <h1 className="mt-2 font-display text-4xl sm:text-5xl">
              {title}
            </h1>

            <p className="mt-2 max-w-[650px] text-sm leading-6 text-black/50">
              {description}
            </p>
          </div>

          {/* Settings sub-navigation (mobile): horizontally scrollable */}
          <nav
            className="tas-settings-subnav mb-6 -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:hidden"
            aria-label="Settings sections"
          >
            {settingsItems.map((item) => {
              const Icon = item.icon;
              const active = item.id === activeSection;

              return (
                <a
                  key={item.id}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition ${
                    active
                      ? "border-transparent text-white"
                      : "border-black/10 bg-white/45 text-black/65 hover:bg-white/70"
                  }`}
                  style={
                    active
                      ? { backgroundColor: "var(--tas-accent, #24231f)" }
                      : undefined
                  }
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          <div className="grid gap-7 lg:grid-cols-[245px_minmax(0,1fr)]">
            {/* Settings navigation */}
            <aside className="hidden h-fit rounded-2xl border border-black/10 bg-white/35 p-3 lg:block">
              <p className="px-4 pb-3 pt-2 text-[10px] uppercase tracking-[0.22em] text-black/35">
                Settings
              </p>

              <nav className="space-y-1">
                {settingsItems.map((item) => {
                  const Icon = item.icon;
                  const active = item.id === activeSection;

                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                        active
                          ? "bg-[#24231f] text-white"
                          : "text-black/65 hover:bg-black/[0.045] hover:text-black"
                      }`}
                    >
                      <Icon className="size-[17px] shrink-0" />
                      <span>{item.label}</span>
                    </a>
                  );
                })}
              </nav>
            </aside>

            {/* Current setting */}
            <section className="min-w-0">{children}</section>
          </div>
        </div>
      </main>

      {/* =========================================================
          SHARE QUESTION
          ========================================================= */}

      {shareQuestionOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-5 backdrop-blur-sm"
          onClick={closeShareQuestion}
        >
          <div
            className="relative w-full max-w-[520px] rounded-3xl bg-[#f4eee2] p-7 shadow-2xl sm:p-9"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeShareQuestion}
              aria-label="Close"
              className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-full bg-black/[0.05] transition hover:bg-black/[0.1]"
            >
              <X className="size-4" />
            </button>

            <p className="text-[10px] uppercase tracking-[0.25em] text-black/40">
              Before you share
            </p>

            <h2 className="mt-4 max-w-[430px] font-display text-[clamp(2rem,5vw,3.2rem)] leading-[0.95]">
              Whose artwork
              <br />
              are you sharing?
            </h2>

            <p className="mt-5 max-w-[430px] text-sm leading-6 text-black/55">
              This helps us show the right information and give proper context
              to every artwork shared on The ArtWork Stories.
            </p>

            <div className="mt-8 grid gap-3">
              <button
                type="button"
                onClick={() => continueToCreate("own")}
                className="group rounded-2xl border border-black/10 bg-white/40 p-5 text-left transition hover:-translate-y-0.5 hover:border-black/20 hover:bg-white/70"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-2xl">
                      I created this artwork
                    </p>

                    <p className="mt-2 text-xs leading-5 text-black/50">
                      Share your own work and tell the story behind what you
                      created.
                    </p>
                  </div>

                  <span className="text-xl transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => continueToCreate("other")}
                className="group rounded-2xl border border-black/10 bg-white/40 p-5 text-left transition hover:-translate-y-0.5 hover:border-black/20 hover:bg-white/70"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-2xl">
                      I’m sharing someone else’s artwork
                    </p>

                    <p className="mt-2 text-xs leading-5 text-black/50">
                      Give credit, add the source, and share the story or
                      context behind the work.
                    </p>
                  </div>

                  <span className="text-xl transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-black/45"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
import {
  Bookmark,
  Compass,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Settings,
  User,
} from "lucide-react";
import { useState } from "react";

type AppSidebarProps = {
  /**
   * Which item is highlighted as the current page.
   */
  active: "discover" | "collections" | "profile";
};

export default function AppSidebar({ active }: AppSidebarProps) {
  const [open, setOpen] = useState(true);

  const linkClass = (isActive: boolean) =>
    `flex items-center rounded-md py-3 text-sm transition ${
      isActive
        ? "bg-white/10 text-white"
        : "text-white/70 hover:bg-white/5 hover:text-white"
    } ${open ? "gap-4 px-5" : "justify-center px-0"}`;

  return (
    <aside
      className={`fixed left-0 top-0 z-50 hidden h-screen flex-col bg-[#1d1c19] text-[#f5efe4] transition-all duration-300 lg:flex ${
        open ? "w-[220px]" : "w-[72px]"
      }`}
    >
      {/* LOGO */}
      <div
        className={`border-b border-white/10 py-7 transition-all ${
          open ? "px-7" : "px-3"
        }`}
      >
        <a
          href="../../home/index.html"
          className={`block font-display leading-[0.95] ${
            open ? "text-[24px]" : "text-center text-[18px]"
          }`}
        >
          {open ? (
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

      {/* SIDEBAR TOGGLE */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        className={`absolute -right-3 top-[78px] flex size-7 items-center justify-center rounded-full border border-white/10 bg-[#24231f] text-white shadow-lg transition hover:scale-105 ${
          open ? "" : "rotate-180"
        }`}
      >
        {open ? (
          <PanelLeftClose className="size-3.5" />
        ) : (
          <PanelLeftOpen className="size-3.5" />
        )}
      </button>

      {/* NAVIGATION */}
      <nav className="mt-8 flex flex-col gap-2 px-3">
        <a
          href="../discover/index.html"
          title="Discover"
          className={linkClass(active === "discover")}
        >
          <Compass className="size-5 shrink-0" />
          {open && <span>Discover</span>}
        </a>

        <a
          href="../collections/index.html"
          title="Collections"
          className={linkClass(active === "collections")}
        >
          <Bookmark className="size-5 shrink-0" />
          {open && <span>Collections</span>}
        </a>

        <div className="my-2 h-px bg-white/10" />

        <a
          href="../create/index.html?from=collection-pages"
          title="Share an Artwork"
          className={linkClass(false)}
        >
          <Plus className="size-5 shrink-0" />
          {open && <span>Share an Artwork</span>}
        </a>

        <div className="my-2 h-px bg-white/10" />

        <a
          href="../profile/index.html"
          title="Profile"
          className={linkClass(active === "profile")}
        >
          <User className="size-5 shrink-0" />
          {open && <span>Profile</span>}
        </a>

        <a
          href="../settings/account/index.html"
          title="Settings"
          className={linkClass(false)}
        >
          <Settings className="size-5 shrink-0" />
          {open && <span>Settings</span>}
        </a>
      </nav>

      {/* SIDEBAR QUOTE */}
      {open && (
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
  );
}

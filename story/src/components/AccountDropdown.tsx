import { LogOut, Settings, User } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

type AccountDropdownProps = {
  /**
   * The existing account trigger markup (avatar, greeting, chevron).
   * It is rendered inside the toggle button unchanged.
   */
  children: ReactNode;
  /**
   * Optional extra classes for the wrapper, e.g. visibility classes
   * such as "hidden sm:flex" used on some headers.
   */
  className?: string;
};

/* ===============================================================
   ACCOUNT DROPDOWN

   Wraps the account button found in each page's top header and
   opens a small menu anchored to it (right-aligned).

   - Click the account button to open / close.
   - Click anywhere outside to close (document-level pointerdown).
   - Press Escape to close.
   - Profile and Settings are plain <a> links; Log out is a
     frontend-only placeholder (no auth yet).
   =============================================================== */

export default function AccountDropdown({
  children,
  className = "",
}: AccountDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Close on outside click and Escape while the menu is open.
  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (
        rootRef.current &&
        event.target instanceof Node &&
        !rootRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const itemClass =
    "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-[#1d1b1a] transition hover:bg-black/5";

  return (
    <div ref={rootRef} className={`relative ${className}`.trim()}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-3 rounded-full transition hover:bg-black/5"
      >
        {children}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+10px)] z-50 w-56 overflow-hidden rounded-xl border border-black/10 bg-[#faf7f0] p-2 shadow-lg"
        >
          <a href="/pages/app/profile/index.html" role="menuitem" className={itemClass}>
            <User className="size-4" />
            Profile
          </a>

          <a
            href="/pages/app/settings/account/index.html"
            role="menuitem"
            className={itemClass}
          >
            <Settings className="size-4" />
            Settings
          </a>

          <div className="my-2 h-px bg-black/10" role="presentation" />

          <button
            type="button"
            role="menuitem"
            onClick={() => setOpen(false)}
            className={`${itemClass} w-full text-left`}
          >
            <LogOut className="size-4" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

import { getUnreadNotificationCount } from "../data/firestore/notifications";

import { auth } from "../firebase";

/*
 * Header notification bell with a live unread badge from
 * Firestore (getUnreadNotificationCount). Renders the same
 * Bell icon as before — pages keep their existing anchor
 * styling — and adds a small dark badge only when there are
 * unread notifications.
 *
 * To avoid excessive Firestore reads the count is fetched once
 * on mount, refreshed on window focus and on a slow 60s
 * interval while the tab is visible. It is a header indicator,
 * not the source of truth for the notifications page (which
 * recomputes from its own list).
 */

function NotificationsBell() {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      try {
        await auth.authStateReady();

        const user = auth.currentUser;

        if (!user) {
          if (!cancelled) {
            setUnread(0);
          }

          return;
        }

        const count = await getUnreadNotificationCount(user.uid);

        if (!cancelled) {
          setUnread(count);
        }
      } catch (error) {
        /* The bell is an indicator — failures stay silent. */
        console.error("Failed to load unread notification count:", error);
      }
    }

    refresh();

    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    }, 60000);

    const onFocus = () => refresh();

    window.addEventListener("focus", onFocus);

    document.addEventListener("visibilitychange", onFocus);

    return () => {
      cancelled = true;

      window.clearInterval(interval);

      window.removeEventListener("focus", onFocus);

      document.removeEventListener("visibilitychange", onFocus);
    };
  }, []);

  return (
    <span className="relative inline-flex">
      <Bell className="size-5" />

      {unread > 0 && (
        <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#292723] px-1 text-[10px] font-medium leading-none text-white">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </span>
  );
}

export default NotificationsBell;

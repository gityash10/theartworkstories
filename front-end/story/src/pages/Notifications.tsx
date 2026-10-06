import React, { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Compass,
  Heart,
  MessageCircle,
  Bookmark,
  Settings,
  UserPlus,
  Users,
} from "lucide-react";

import {
  listUserNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type Notification as FirestoreNotification,
  type NotificationType,
} from "../data/firestore/notifications";

import { getUserProfile } from "../data/firestore/users";

import { auth } from "../firebase";

/*
 * Notifications — Firestore-backed.
 *
 * Data comes from notifications/{notificationId} (recipient =
 * the signed-in user). Actor display names resolve from
 * users/{uid}; an unloadable profile degrades to "Someone"
 * without breaking the page. Mark-as-read writes only the read
 * field. Unread styling, filter tabs, empty states and the
 * page design are unchanged from the previous mock-driven page.
 */

type ActorInfo = { displayName: string; photoURL: string };

type NotificationView = FirestoreNotification & {
  actorName: string;
  actorPhoto: string;
};

const iconMap: Record<NotificationType, React.ReactNode> = {
  like: <Heart size={20} />,
  comment: <MessageCircle size={20} />,
  follow: <UserPlus size={20} />,
  save: <Bookmark size={20} />,
};

/*
 * Reuses the existing icon color classes — "save" maps onto the
 * collection (bookmark) styling.
 */
const notificationIconClass: Record<NotificationType, string> = {
  like: "notification-icon like",
  comment: "notification-icon comment",
  follow: "notification-icon follow",
  save: "notification-icon collection",
};

function NotificationIcon({ type }: { type: NotificationType }) {
  return <div className={notificationIconClass[type]}>{iconMap[type]}</div>;
}

function timestampToIso(value: unknown): string | null {
  if (value && typeof value === "object" && "toDate" in value) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }

  return null;
}

function formatRelativeTime(date: string | null) {
  if (!date) {
    return "Just now";
  }

  const millis = new Date(date).getTime();

  const minutes = Math.floor((Date.now() - millis) / 60000);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function targetHref(notification: FirestoreNotification): string | null {
  if (notification.targetType === "artwork") {
    return `/pages/app/artwork/index.html?id=${encodeURIComponent(
      notification.targetId,
    )}`;
  }

  if (notification.targetType === "collection") {
    return `/pages/app/collection/index.html?id=${encodeURIComponent(
      notification.targetId,
    )}`;
  }

  return null;
}

async function resolveActors(
  notifications: FirestoreNotification[],
): Promise<Record<string, ActorInfo>> {
  const uniqueActorIds = [
    ...new Set(notifications.map((notification) => notification.actorId)),
  ];

  const profiles = await Promise.all(
    uniqueActorIds.map(async (actorId) => {
      try {
        const profile = await getUserProfile(actorId);

        return [
          actorId,
          {
            displayName: profile?.displayName ?? "",
            photoURL: profile?.photoURL ?? "",
          },
        ] as const;
      } catch {
        /* Graceful degradation — unknown actor. */
        return [actorId, { displayName: "", photoURL: "" }] as const;
      }
    }),
  );

  return Object.fromEntries(profiles);
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<
    NotificationView[] | null
  >(null);

  const [loadError, setLoadError] = useState(false);

  const [filter, setFilter] = useState<"all" | "unread">("all");

  const [actingId, setActingId] = useState<string | null>(null);

  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        await auth.authStateReady();

        const user = auth.currentUser;

        if (!user) {
          return;
        }

        const loaded = await listUserNotifications(user.uid);

        if (cancelled) {
          return;
        }

        const actors = await resolveActors(loaded);

        if (cancelled) {
          return;
        }

        setNotifications(
          loaded.map((notification) => ({
            ...notification,

            actorName: actors[notification.actorId]?.displayName ?? "",

            actorPhoto: actors[notification.actorId]?.photoURL ?? "",
          })),
        );
      } catch (error) {
        console.error("Failed to load notifications:", error);

        if (!cancelled) {
          setLoadError(true);

          setNotifications([]);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const unreadCount = useMemo(
    () =>
      (notifications ?? []).filter((notification) => !notification.read)
        .length,
    [notifications],
  );

  const visibleNotifications = useMemo(() => {
    if (filter === "unread") {
      return (notifications ?? []).filter(
        (notification) => !notification.read,
      );
    }

    return notifications ?? [];
  }, [filter, notifications]);

  const markAsRead = async (id: string) => {
    if (actingId) {
      return;
    }

    setActingId(id);

    try {
      const user = auth.currentUser;

      if (!user) {
        return;
      }

      await markNotificationAsRead(id, user.uid);

      setNotifications((current) =>
        (current ?? []).map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification,
        ),
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    } finally {
      setActingId(null);
    }
  };

  const markAllAsRead = async () => {
    if (markingAll) {
      return;
    }

    setMarkingAll(true);

    try {
      const user = auth.currentUser;

      if (!user) {
        return;
      }

      await markAllNotificationsAsRead(user.uid);

      setNotifications((current) =>
        (current ?? []).map((notification) => ({
          ...notification,
          read: true,
        })),
      );
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <div className="notifications-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .notifications-page {
          min-height: 100vh;
          background: #f5f0e7;
          color: #171714;
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        .notifications-layout {
          min-height: 100vh;
          display: flex;
        }

        /* SIDEBAR */

        .notifications-sidebar {
          width: 242px;
          min-width: 242px;
          background: #1d1d1b;
          color: #fff;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          z-index: 100;
        }

        .sidebar-brand {
          height: 107px;
          padding: 20px 26px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          font-family: Georgia, "Times New Roman", serif;
          font-size: 28px;
          line-height: 0.95;
        }

        .sidebar-nav {
          padding: 38px 12px 0;
        }

        .sidebar-section {
          padding: 0 0 18px;
          margin-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .sidebar-link {
          width: 100%;
          min-height: 50px;
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 0 18px;
          color: #d9d5ce;
          text-decoration: none;
          border-radius: 5px;
          font-size: 16px;
          transition:
            background 0.2s ease,
            color 0.2s ease;
        }

        .sidebar-link:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
        }

        .sidebar-link svg {
          flex-shrink: 0;
        }

        .sidebar-footer {
          margin-top: auto;
          padding: 26px;
        }

        .sidebar-quote {
          color: #cfc8bd;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 15px;
          line-height: 1.6;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.16);
        }

        /* MAIN */

        .notifications-main {
          width: calc(100% - 242px);
          margin-left: 242px;
          min-height: 100vh;
        }

        /* CONTENT */

        .notifications-content {
          max-width: 950px;
          margin: 0 auto;
          padding: 58px 30px 80px;
        }

        .page-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 34px;
        }

        .page-heading h1 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 42px;
          font-weight: 400;
          letter-spacing: -0.7px;
        }

        .page-heading p {
          margin: 10px 0 0;
          color: #777169;
          font-size: 16px;
        }

        .mark-all-button {
          border: 1px solid #d8d1c6;
          background: #fffdf9;
          color: #36332e;
          padding: 10px 15px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          white-space: nowrap;
        }

        .mark-all-button:hover {
          background: #eee9df;
        }

        .notification-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 15px;
        }

        .filter-tabs {
          display: flex;
          gap: 5px;
          background: #ebe6dd;
          border-radius: 9px;
          padding: 4px;
        }

        .filter-tab {
          border: none;
          background: transparent;
          padding: 8px 16px;
          border-radius: 6px;
          color: #716c64;
          cursor: pointer;
          font-size: 14px;
        }

        .filter-tab.active {
          background: #fffdf9;
          color: #1f1e1b;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .unread-count {
          color: #817b72;
          font-size: 14px;
        }

        .notification-list {
          background: #fffdf9;
          border: 1px solid #ded8cd;
          border-radius: 14px;
          overflow: hidden;
        }

        .notification-item {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 22px 24px;
          border-bottom: 1px solid #e7e1d8;
          position: relative;
          transition: background 0.2s ease;
        }

        .notification-item:last-child {
          border-bottom: none;
        }

        .notification-item:hover {
          background: #faf7f1;
        }

        .notification-item.unread {
          background: #faf6ed;
        }

        .notification-item.unread::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: #292824;
        }

        .notification-icon {
          width: 46px;
          height: 46px;
          min-width: 46px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-icon.like {
          background: #f0dfd9;
          color: #9b4b3a;
        }

        .notification-icon.comment {
          background: #e2e9df;
          color: #52664e;
        }

        .notification-icon.follow {
          background: #e4e1ec;
          color: #5c5575;
        }

        .notification-icon.mention {
          background: #e5e9e9;
          color: #536568;
        }

        .notification-icon.collection {
          background: #ebe2d4;
          color: #806541;
        }

        .notification-body {
          min-width: 0;
          flex: 1;
        }

        .notification-title {
          margin: 0 0 5px;
          font-size: 15px;
          font-weight: 600;
          color: #24231f;
        }

        .notification-description {
          margin: 0;
          color: #777169;
          font-size: 14px;
          line-height: 1.45;
        }

        .notification-time {
          margin-top: 8px;
          color: #999289;
          font-size: 12px;
        }

        .notification-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .notification-action {
          width: 34px;
          height: 34px;
          border: 1px solid #ddd6cc;
          border-radius: 7px;
          background: #fffdf9;
          color: #716c64;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-action:hover {
          background: #eee9df;
          color: #24231f;
        }

        .empty-state {
          padding: 75px 25px;
          text-align: center;
        }

        .empty-icon {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          margin: 0 auto 18px;
          background: #eee9df;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #777169;
        }

        .empty-state h2 {
          margin: 0 0 8px;
          font-family: Georgia, "Times New Roman", serif;
          font-weight: 400;
          font-size: 25px;
        }

        .empty-state p {
          margin: 0;
          color: #817b72;
        }

        /* MOBILE */

        @media (max-width: 900px) {
          .notifications-sidebar {
            position: relative;
            width: 100%;
            min-width: 0;
            min-height: auto;
            height: auto;
          }

          .notifications-layout {
            display: block;
          }

          .notifications-main {
            width: 100%;
            margin-left: 0;
          }

          .sidebar-brand {
            height: auto;
          }

          .sidebar-nav {
            padding: 15px 12px;
          }

          .sidebar-section {
            margin-bottom: 10px;
            padding-bottom: 10px;
          }

          .sidebar-footer {
            display: none;
          }
        }

        @media (max-width: 600px) {
          .notifications-content {
            padding: 35px 16px 60px;
          }

          .page-heading {
            flex-direction: column;
          }

          .page-heading h1 {
            font-size: 34px;
          }

          .notification-toolbar {
            align-items: flex-start;
            gap: 12px;
            flex-direction: column;
          }

          .notification-item {
            align-items: flex-start;
            padding: 18px 16px;
            gap: 13px;
          }

          .notification-icon {
            width: 40px;
            height: 40px;
            min-width: 40px;
          }

          .notification-icon svg {
            width: 17px;
            height: 17px;
          }

          .notification-actions {
            align-self: center;
          }
        }
      `}</style>

      <div className="notifications-layout">
        <aside className="notifications-sidebar">
          <div className="sidebar-brand">
            The ArtWork
            <br />
            Stories
          </div>

          <nav className="sidebar-nav">
            <div className="sidebar-section">
              <a className="sidebar-link" href="/pages/app/discover/index.html">
                <Compass size={20} />
                <span>Discover</span>
              </a>

              <a
                className="sidebar-link"
                href="/pages/app/collections/index.html"
              >
                <Bookmark size={20} />
                <span>Collections</span>
              </a>
            </div>

            <div className="sidebar-section">
              <a className="sidebar-link" href="/pages/app/create/index.html">
                <span style={{ fontSize: 27, lineHeight: 1 }}>+</span>
                <span>Share an Artwork</span>
              </a>
            </div>

            <div className="sidebar-section">
              <a className="sidebar-link" href="/pages/app/profile/index.html">
                <Users size={20} />
                <span>Profile</span>
              </a>

              <a
                className="sidebar-link"
                href="/pages/app/settings/account/index.html"
              >
                <Settings size={20} />
                <span>Settings</span>
              </a>
            </div>
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-quote">
              “Art is a conversation
              <br />
              across time.”
            </div>
          </div>
        </aside>

        <main className="notifications-main">
          <section className="notifications-content">
            <div className="page-heading">
              <div>
                <h1>Notifications</h1>

                <p>Stay up to date with what is happening around your art.</p>
              </div>

              {unreadCount > 0 && (
                <button
                  className="mark-all-button"
                  onClick={markAllAsRead}
                  disabled={markingAll}
                >
                  <CheckCheck size={17} />
                  {markingAll ? "Marking…" : "Mark all as read"}
                </button>
              )}
            </div>

            <div className="notification-toolbar">
              <div className="filter-tabs">
                <button
                  className={`filter-tab ${filter === "all" ? "active" : ""}`}
                  onClick={() => setFilter("all")}
                >
                  All
                </button>

                <button
                  className={`filter-tab ${
                    filter === "unread" ? "active" : ""
                  }`}
                  onClick={() => setFilter("unread")}
                >
                  Unread
                </button>
              </div>

              <span className="unread-count">{unreadCount} unread</span>
            </div>

            <div className="notification-list">
              {notifications === null ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Bell size={25} />
                  </div>

                  <h2>Loading notifications…</h2>

                  <p>Fetching what is happening around your art.</p>
                </div>
              ) : loadError ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Bell size={25} />
                  </div>

                  <h2>Notifications unavailable</h2>

                  <p>
                    They could not be loaded — please refresh the page to try
                    again.
                  </p>
                </div>
              ) : visibleNotifications.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Bell size={25} />
                  </div>

                  <h2>You’re all caught up</h2>

                  <p>
                    {filter === "unread"
                      ? "There are no unread notifications right now."
                      : "No notifications yet — activity on your art will show up here."}
                  </p>
                </div>
              ) : (
                visibleNotifications.map((notification) => {
                  const href = targetHref(notification);

                  return (
                    <article
                      key={notification.id}
                      className={`notification-item ${
                        !notification.read ? "unread" : ""
                      }`}
                    >
                      <NotificationIcon type={notification.type} />

                      <div className="notification-body">
                        <h3 className="notification-title">
                          {href ? (
                            <a
                              href={href}
                              style={{
                                color: "inherit",
                                textDecoration: "none",
                              }}
                            >
                              {notification.actorName.trim() || "Someone"}
                            </a>
                          ) : (
                            notification.actorName.trim() || "Someone"
                          )}
                        </h3>

                        <p className="notification-description">
                          {href ? (
                            <a
                              href={href}
                              style={{
                                color: "inherit",
                                textDecoration: "none",
                              }}
                            >
                              {notification.message}
                            </a>
                          ) : (
                            notification.message
                          )}
                        </p>

                        <div className="notification-time">
                          {formatRelativeTime(
                            timestampToIso(notification.createdAt),
                          )}
                        </div>
                      </div>

                      {!notification.read && (
                        <div className="notification-actions">
                          <button
                            className="notification-action"
                            onClick={() => markAsRead(notification.id)}
                            disabled={actingId === notification.id}
                            aria-label="Mark as read"
                            title="Mark as read"
                          >
                            <Check size={17} />
                          </button>
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

/*
 * Cloud Firestore data layer — notifications.
 *
 * Collection: notifications/{notificationId} with an
 * auto-generated Firestore document ID. One document per event:
 *   { recipientId, actorId, type, targetType, targetId,
 *     message, read, createdAt }
 *
 * Supported types: "like" | "follow" | "save" | "comment".
 * Targets: "artwork" | "collection".
 *
 * Self-actions never notify: createNotification() returns null
 * when actorId === recipientId, and notifyTargetOwner() resolves
 * the target owner server-side (from Firestore, never from
 * client data) and skips silently when the actor owns the
 * target. The actor identity is always the authenticated
 * Firebase user — a mismatching actorId is rejected before any
 * write, and the security rules re-validate server-side.
 *
 * Actor profile data is NOT denormalized into notifications;
 * the UI resolves display names from users/{uid}.
 *
 * Unread counts derive from notification documents with
 * getCountFromServer — no counter on users/{uid}.
 *
 * Firestore is initialized once in firebase.ts (`db`).
 */

import {
  collection,
  doc,
  getDocs,
  getCountFromServer,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  type Timestamp,
} from "firebase/firestore";

import { auth, db } from "../../firebase";

import { getArtwork } from "./artworks";

import { getCollection } from "./collections";

export const NOTIFICATION_TYPES = [
  "like",
  "follow",
  "save",
  "comment",
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export type NotificationTargetType = "artwork" | "collection";

/** Newest-first page size for the notifications list. */
export const NOTIFICATIONS_PAGE_SIZE = 50;

/*
 * notifications/{notificationId}
 */
export interface Notification {
  id: string;

  /** Firebase Auth UID of the user who should see this event. */
  recipientId: string;

  /** Firebase Auth UID of the user who triggered the event. */
  actorId: string;

  type: NotificationType;

  targetType: NotificationTargetType;

  /** Firestore document ID of the liked/followed/saved/commented entity. */
  targetId: string;

  /**
   * Actor-neutral action phrase (e.g. "liked your artwork.");
   * the UI prefixes the resolved actor display name.
   */
  message: string;

  read: boolean;

  createdAt: Timestamp | null;
}

export type CreateNotificationInput = {
  recipientId: string;

  actorId: string;

  type: NotificationType;

  targetType: NotificationTargetType;

  targetId: string;

  message: string;
};

/**
 * Validate the caller's identity: the passed actorId must match
 * the authenticated Firebase user, otherwise the operation is
 * rejected before any write happens.
 */
async function requireMatchingActor(actorId: string): Promise<string> {
  await auth.authStateReady();

  const uid = auth.currentUser?.uid;

  if (!uid) {
    throw new Error("notification requires an authenticated user");
  }

  if (uid !== actorId) {
    throw new Error("notification actorId must match the authenticated user");
  }

  return uid;
}

/**
 * Create a notification document. Self-actions (actor ===
 * recipient) are deliberately skipped — they return null
 * instead of writing. Returns the new document ID, or null
 * when skipped.
 */
export async function createNotification(
  input: CreateNotificationInput,
): Promise<string | null> {
  const uid = await requireMatchingActor(input.actorId);

  if (input.recipientId === uid) {
    return null;
  }

  const payload = {
    recipientId: input.recipientId,

    actorId: uid,

    type: input.type,

    targetType: input.targetType,

    targetId: input.targetId,

    message: input.message,

    read: false,

    createdAt: serverTimestamp(),
  };

  const reference = doc(collection(db, "notifications"));

  await setDoc(reference, payload);

  return reference.id;
}

/**
 * Notify the owner of a target about an actor's action. The
 * owner is resolved from Firestore (artworks/collections), so
 * the client can never pick the recipient. Self-actions are
 * skipped. Failures are logged, never thrown — notification
 * creation must not break the primary user action.
 */
export async function notifyTargetOwner(params: {
  actorId: string;

  type: NotificationType;

  targetType: NotificationTargetType;

  targetId: string;

  message: string;
}): Promise<void> {
  try {
    const owner =
      params.targetType === "artwork"
        ? (await getArtwork(params.targetId))?.ownerId
        : (await getCollection(params.targetId))?.ownerId;

    if (!owner || owner === params.actorId) {
      return;
    }

    await createNotification({
      recipientId: owner,

      actorId: params.actorId,

      type: params.type,

      targetType: params.targetType,

      targetId: params.targetId,

      message: params.message,
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
}

/** Newest-first; pending server timestamps sort as newest. */
function sortByNewestFirst(notifications: Notification[]): Notification[] {
  return [...notifications].sort((a, b) => {
    const aMillis = a.createdAt
      ? a.createdAt.toMillis()
      : Number.MAX_SAFE_INTEGER;

    const bMillis = b.createdAt
      ? b.createdAt.toMillis()
      : Number.MAX_SAFE_INTEGER;

    return bMillis - aMillis;
  });
}

function mapSnapshot(snapshot: {
  docs: { id: string; data: () => Record<string, unknown> }[];
}): Notification[] {
  return snapshot.docs.map(
    (documentSnapshot) =>
      ({
        id: documentSnapshot.id,
        ...documentSnapshot.data(),
      }) as Notification,
  );
}

/**
 * List the user's notifications, newest first, capped at
 * NOTIFICATIONS_PAGE_SIZE. Falls back to an unordered fetch +
 * client-side sort when the composite index (recipientId +
 * createdAt) is missing.
 */
export async function listUserNotifications(
  userId: string,
): Promise<Notification[]> {
  await auth.authStateReady();

  const uid = auth.currentUser?.uid;

  if (!uid || uid !== userId) {
    throw new Error("notifications can only be listed by their recipient");
  }

  const notificationsCollection = collection(db, "notifications");

  async function fetchOrdered() {
    const snapshot = await getDocs(
      query(
        notificationsCollection,
        where("recipientId", "==", uid),
        orderBy("createdAt", "desc"),
        limit(NOTIFICATIONS_PAGE_SIZE),
      ),
    );

    return mapSnapshot(snapshot);
  }

  async function fetchAndSortLocally() {
    const snapshot = await getDocs(
      query(
        notificationsCollection,
        where("recipientId", "==", uid),
        limit(NOTIFICATIONS_PAGE_SIZE),
      ),
    );

    return sortByNewestFirst(mapSnapshot(snapshot));
  }

  try {
    return await fetchOrdered();
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "failed-precondition"
    ) {
      console.warn(
        "Notification list needs a Firestore composite index; sorting client-side.",
        error,
      );

      return fetchAndSortLocally();
    }

    throw error;
  }
}

/** Mark one of the user's own notifications as read. */
export async function markNotificationAsRead(
  notificationId: string,
  userId: string,
): Promise<void> {
  await auth.authStateReady();

  const uid = auth.currentUser?.uid;

  if (!uid || uid !== userId) {
    throw new Error("notifications can only be updated by their recipient");
  }

  await updateDoc(doc(db, "notifications", notificationId), {
    read: true,
  });
}

/**
 * Mark every unread notification of the user as read in one
 * batched write. No-op when there is nothing unread.
 */
export async function markAllNotificationsAsRead(
  userId: string,
): Promise<void> {
  await auth.authStateReady();

  const uid = auth.currentUser?.uid;

  if (!uid || uid !== userId) {
    throw new Error("notifications can only be updated by their recipient");
  }

  const unreadSnapshot = await getDocs(
    query(
      collection(db, "notifications"),
      where("recipientId", "==", uid),
      where("read", "==", false),
    ),
  );

  if (unreadSnapshot.empty) {
    return;
  }

  const batch = writeBatch(db);

  for (const documentSnapshot of unreadSnapshot.docs) {
    batch.update(documentSnapshot.ref, { read: true });
  }

  await batch.commit();
}

/** Unread count, derived from notification documents. */
export async function getUnreadNotificationCount(
  userId: string,
): Promise<number> {
  await auth.authStateReady();

  const uid = auth.currentUser?.uid;

  if (!uid || uid !== userId) {
    throw new Error("notifications can only be counted by their recipient");
  }

  async function countWithQuery() {
    const snapshot = await getCountFromServer(
      query(
        collection(db, "notifications"),
        where("recipientId", "==", uid),
        where("read", "==", false),
      ),
    );

    return snapshot.data().count;
  }

  async function countLocally() {
    const snapshot = await getDocs(
      query(
        collection(db, "notifications"),
        where("recipientId", "==", uid),
        where("read", "==", false),
      ),
    );

    return snapshot.size;
  }

  try {
    return await countWithQuery();
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "failed-precondition"
    ) {
      console.warn(
        "Unread notification count needs a Firestore composite index; counting client-side.",
        error,
      );

      return countLocally();
    }

    throw error;
  }
}

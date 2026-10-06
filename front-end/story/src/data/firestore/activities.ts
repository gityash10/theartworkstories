/*
 * Cloud Firestore data layer — activities.
 *
 * Collection: activities/{activityId} with an auto-generated
 * Firestore document ID. One document per action:
 *   { actorId, type, targetType, targetId, metadata?, createdAt }
 *
 * An activity records something the signed-in user did — it is
 * the actor's own history, not an alert addressed to somebody
 * else (see notifications.ts for those). The actor is never a
 * parameter: it is always the authenticated Firebase user, so a
 * caller cannot record an action on behalf of another account,
 * and the security rules re-validate actorId server-side.
 *
 * Actor profiles and target titles are NOT denormalized into
 * activity documents: the UI resolves the actor from users/{uid}
 * and target titles from artworks/collections at render time, so
 * renamed, renamed-away or deleted targets are always shown
 * truthfully.
 *
 * Only actions that already exist in the product are recorded,
 * and only positive ones — unliking, unsaving, unfollowing,
 * deleting, views, page opens and auth events are deliberately
 * not activities.
 *
 * Counts derive from getCountFromServer — no counter is kept on
 * users/{uid}.
 *
 * createActivity() never throws: failures are logged and
 * reported as null so that recording an activity can never break
 * the primary user action that triggered it.
 *
 * Firestore is initialized once in firebase.ts (`db`).
 */

import {
  collection,

  doc,

  getCountFromServer,

  getDocs,

  limit,

  orderBy,

  query,

  serverTimestamp,

  setDoc,

  where,

  type Timestamp,
} from "firebase/firestore";

import { auth, db } from "../../firebase";

export const ACTIVITY_TYPES = [
  "artwork_created",

  "artwork_liked",

  "artwork_saved",

  "artwork_commented",

  "collection_created",

  "collection_liked",

  "collection_saved",

  "collection_followed",
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export type ActivityTargetType = "artwork" | "collection";

/** Newest-first page size for the profile Activity tab. */
export const ACTIVITIES_PAGE_SIZE = 30;

/*
 * activities/{activityId}
 */
export interface Activity {
  id: string;

  actorId: string;

  type: ActivityType;

  targetType: ActivityTargetType;

  targetId: string;

  /** Optional, small, non-identifying extras. Never profile data. */
  metadata?: Record<string, unknown> | null;

  createdAt: Timestamp | null;
}

export interface CreateActivityInput {
  type: ActivityType;

  targetId: string;

  metadata?: Record<string, unknown>;
}

/**
 * Every supported activity type names its target kind in its
 * prefix (artwork_* / collection_*), so the type/targetType pair
 * can never drift apart. The security rules enforce the same
 * mapping server-side.
 */
export function activityTargetType(type: ActivityType): ActivityTargetType {
  return type.startsWith("artwork_") ? "artwork" : "collection";
}

/**
 * Record an activity for the signed-in user. The actor is always
 * the authenticated Firebase user — there is no actorId
 * parameter, so no caller can impersonate another account.
 *
 * Returns the new document ID, or null when the activity could
 * not be recorded. Never throws: a failed activity write is
 * logged for developers and otherwise ignored, so that liking,
 * saving, following, commenting or creating something can never
 * be reported as failed because of activity bookkeeping.
 */
export async function createActivity(
  input: CreateActivityInput,
): Promise<string | null> {
  try {
    await auth.authStateReady();

    const uid = auth.currentUser?.uid;

    if (!uid) {
      console.error("Failed to create activity: no authenticated user.");

      return null;
    }

    if (!input.targetId || !input.targetId.trim()) {
      console.error("Failed to create activity: targetId is required.");

      return null;
    }

    const reference = doc(collection(db, "activities"));

    await setDoc(reference, {
      actorId: uid,

      type: input.type,

      targetType: activityTargetType(input.type),

      targetId: input.targetId,

      ...(input.metadata ? { metadata: input.metadata } : {}),

      createdAt: serverTimestamp(),
    });

    return reference.id;
  } catch (error) {
    console.error("Failed to create activity:", error);

    return null;
  }
}

/*
 * The signed-in user's own id. Activities are a private history,
 * so reads are only ever allowed for the actor.
 */
async function requireActor(userId: string): Promise<string> {
  await auth.authStateReady();

  const uid = auth.currentUser?.uid;

  if (!uid) {
    throw new Error("activity requires an authenticated user");
  }

  if (uid !== userId) {
    throw new Error("activities can only be read by their actor");
  }

  return uid;
}

function mapSnapshot(snapshot: {
  docs: { id: string; data: () => Record<string, unknown> }[];
}): Activity[] {
  return snapshot.docs.map(
    (documentSnapshot) =>
      ({
        id: documentSnapshot.id,

        ...documentSnapshot.data(),
      }) as Activity,
  );
}

/** Newest-first; pending server timestamps sort as newest. */
function sortByNewestFirst(activities: Activity[]): Activity[] {
  return [...activities].sort((a, b) => {
    const aMillis = a.createdAt
      ? a.createdAt.toMillis()
      : Number.MAX_SAFE_INTEGER;

    const bMillis = b.createdAt
      ? b.createdAt.toMillis()
      : Number.MAX_SAFE_INTEGER;

    return bMillis - aMillis;
  });
}

/**
 * List the user's own activities, newest first, capped at
 * ACTIVITIES_PAGE_SIZE. Falls back to an unordered fetch +
 * client-side sort when the composite index (actorId + createdAt)
 * is missing.
 */
export async function listUserActivities(userId: string): Promise<Activity[]> {
  const uid = await requireActor(userId);

  const activitiesCollection = collection(db, "activities");

  async function fetchOrdered() {
    const snapshot = await getDocs(
      query(
        activitiesCollection,

        where("actorId", "==", uid),

        orderBy("createdAt", "desc"),

        limit(ACTIVITIES_PAGE_SIZE),
      ),
    );

    return mapSnapshot(snapshot);
  }

  async function fetchAndSortLocally() {
    const snapshot = await getDocs(
      query(
        activitiesCollection,

        where("actorId", "==", uid),

        limit(ACTIVITIES_PAGE_SIZE),
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
        "Activity list needs a Firestore composite index; sorting client-side.",
        error,
      );

      return fetchAndSortLocally();
    }

    throw error;
  }
}

/**
 * How many activities the user has recorded. A server-side count
 * over the actor's own documents — no client-writable counter on
 * users/{uid}.
 */
export async function getUserActivityCount(userId: string): Promise<number> {
  const uid = await requireActor(userId);

  const snapshot = await getCountFromServer(
    query(collection(db, "activities"), where("actorId", "==", uid)),
  );

  return snapshot.data().count;
}

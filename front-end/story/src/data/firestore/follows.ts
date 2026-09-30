/*
 * Cloud Firestore data layer — follows.
 *
 * Collection: follows/{followId} with a deterministic document
 * ID of the form `${targetType}_${targetId}_follower_${uid}`.
 * The ID itself prevents duplicates: following twice writes the
 * same document, unfollowing deletes that exact document.
 *
 * Target types supported by the existing application:
 *   - "collection" → targetId is a collections/{collectionId} ID
 *
 * User/creator follows are deferred until real user-profile
 * targets exist (the Creators page currently shows demo
 * creators without Firestore user documents).
 *
 * The followerId is always taken from the authenticated Firebase
 * user (auth.currentUser.uid); it is never accepted from the
 * caller, and the security rules validate it server-side.
 *
 * Counts are derived from follow documents (no denormalized
 * counters). Firestore is initialized once in firebase.ts (`db`).
 */

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getCountFromServer,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  type Timestamp,
} from "firebase/firestore";

import { auth, db } from "../../firebase";

export const FOLLOW_TARGET_TYPES = ["collection"] as const;

export type FollowTargetType = (typeof FOLLOW_TARGET_TYPES)[number];

/*
 * follows/${targetType}_${targetId}_follower_${uid}
 */
export interface Follow {
  id: string;

  targetType: FollowTargetType;

  /** Firestore document ID of the followed entity. */
  targetId: string;

  /** Firebase Auth UID of the user who followed. */
  followerId: string;

  createdAt: Timestamp | null;
}

/** Get the follow document reference for a target + user. */
export function getFollowDocRef(
  targetType: FollowTargetType,
  targetId: string,
  uid: string,
) {
  return doc(db, "follows", `${targetType}_${targetId}_follower_${uid}`);
}

/** Follow a target on behalf of the authenticated user (idempotent). */
export async function followTarget(
  targetType: FollowTargetType,
  targetId: string,
): Promise<void> {
  const uid = auth.currentUser?.uid;

  if (!uid) {
    throw new Error("follow requires an authenticated user");
  }

  await setDoc(
    getFollowDocRef(targetType, targetId, uid),
    {
      targetType,

      targetId,

      followerId: uid,

      createdAt: serverTimestamp(),
    },
    { merge: false },
  );
}

/** Unfollow: delete the exact deterministic document. */
export async function unfollowTarget(
  targetType: FollowTargetType,
  targetId: string,
): Promise<void> {
  const uid = auth.currentUser?.uid;

  if (!uid) {
    throw new Error("unfollow requires an authenticated user");
  }

  await deleteDoc(getFollowDocRef(targetType, targetId, uid));
}

/** Whether the authenticated user follows the target. */
export async function hasFollowed(
  targetType: FollowTargetType,
  targetId: string,
): Promise<boolean> {
  const uid = auth.currentUser?.uid;

  if (!uid) {
    throw new Error("hasFollowed requires an authenticated user");
  }

  const snapshot = await getDoc(getFollowDocRef(targetType, targetId, uid));

  return snapshot.exists();
}

/** Follower count for one target, derived from follow documents. */
export async function getFollowerCount(
  targetType: FollowTargetType,
  targetId: string,
): Promise<number> {
  const snapshot = await getCountFromServer(
    query(
      collection(db, "follows"),
      where("targetType", "==", targetType),
      where("targetId", "==", targetId),
    ),
  );

  return snapshot.data().count;
}

/** Follows made by one user, newest first. */
export async function listUserFollows(
  uid: string,
  targetType: FollowTargetType,
): Promise<Follow[]> {
  const followsCollection = collection(db, "follows");

  const constraints = [
    where("followerId", "==", uid),
    where("targetType", "==", targetType),
  ];

  function mapSnapshot(snapshot: {
    docs: { id: string; data: () => Record<string, unknown> }[];
  }): Follow[] {
    return snapshot.docs.map(
      (documentSnapshot) =>
        ({ id: documentSnapshot.id, ...documentSnapshot.data() }) as Follow,
    );
  }

  try {
    const snapshot = await getDocs(
      query(followsCollection, ...constraints, orderBy("createdAt", "desc")),
    );

    return mapSnapshot(snapshot);
  } catch (error) {
    /*
     * The followerId+targetType+createdAt combination needs a
     * composite index; until it exists, fall back to an
     * unordered query and sort client-side.
     */
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "failed-precondition"
    ) {
      console.warn(
        "User follow list needs a Firestore composite index; returning client-sorted results.",
        error,
      );

      const snapshot = await getDocs(query(followsCollection, ...constraints));

      return mapSnapshot(snapshot).sort((a, b) => {
        const aTime = a.createdAt?.toMillis() ?? 0;

        const bTime = b.createdAt?.toMillis() ?? 0;

        return bTime - aTime;
      });
    }

    throw error;
  }
}

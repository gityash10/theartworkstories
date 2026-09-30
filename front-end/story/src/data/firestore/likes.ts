/*
 * Cloud Firestore data layer — likes.
 *
 * Collection: likes/{likeId} with a deterministic document ID of
 * the form `${targetType}_${targetId}_user_${uid}`. The ID itself
 * prevents duplicates: liking twice writes the same document, and
 * unliking deletes that exact document.
 *
 * One model covers every likeable entity through targetType:
 *   - "artwork"    → targetId is an artworks/{artworkId} ID
 *   - "collection" → targetId is a collections/{collectionId} ID
 *
 * The userId is always taken from the authenticated Firebase
 * user (auth.currentUser.uid); it is never accepted from the
 * caller, and the security rules validate it server-side.
 *
 * Counts are derived from like documents (no denormalized
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

export const LIKE_TARGET_TYPES = ["artwork", "collection"] as const;

export type LikeTargetType = (typeof LIKE_TARGET_TYPES)[number];

/*
 * likes/{targetType}_{targetId}_user_{uid}
 */
export interface Like {
  id: string;

  targetType: LikeTargetType;

  /** Firestore document ID of the liked entity. */
  targetId: string;

  /** Firebase Auth UID of the user who liked. */
  userId: string;

  createdAt: Timestamp | null;
}

function requireUid(): string {
  const uid = auth.currentUser?.uid;

  if (!uid) {
    throw new Error("like requires an authenticated user");
  }

  return uid;
}

export function getLikeDocRef(
  targetType: LikeTargetType,
  targetId: string,
  uid: string,
) {
  return doc(db, "likes", `${targetType}_${targetId}_user_${uid}`);
}

/** Like a target on behalf of the authenticated user (idempotent). */
export async function likeTarget(
  targetType: LikeTargetType,
  targetId: string,
): Promise<void> {
  const uid = requireUid();

  await setDoc(
    getLikeDocRef(targetType, targetId, uid),
    {
      targetType,

      targetId,

      userId: uid,

      createdAt: serverTimestamp(),
    },
    { merge: false },
  );
}

/** Remove the authenticated user's like for a target (idempotent). */
export async function unlikeTarget(
  targetType: LikeTargetType,
  targetId: string,
): Promise<void> {
  const uid = requireUid();

  await deleteDoc(getLikeDocRef(targetType, targetId, uid));
}

/** Whether the authenticated user has liked the target. */
export async function hasLiked(
  targetType: LikeTargetType,
  targetId: string,
): Promise<boolean> {
  const uid = requireUid();

  const snapshot = await getDoc(getLikeDocRef(targetType, targetId, uid));

  return snapshot.exists();
}

/** Live like count for one target, derived from like documents. */
export async function getLikeCount(
  targetType: LikeTargetType,
  targetId: string,
): Promise<number> {
  const snapshot = await getCountFromServer(
    query(
      collection(db, "likes"),
      where("targetType", "==", targetType),
      where("targetId", "==", targetId),
    ),
  );

  return snapshot.data().count;
}

/*
 * Like counts for many targets of one type, in a single query
 * per 30-ID chunk (Firestore whereIn limit). Returns a map —
 * targets with zero likes are simply absent.
 */
export async function getLikeCounts(
  targetType: LikeTargetType,
  targetIds: string[],
): Promise<Map<string, number>> {
  const counts = new Map<string, number>();

  const uniqueIds = [...new Set(targetIds)];

  for (let index = 0; index < uniqueIds.length; index += 30) {
    const chunk = uniqueIds.slice(index, index + 30);

    if (chunk.length === 0) {
      continue;
    }

    const snapshot = await getDocs(
      query(
        collection(db, "likes"),
        where("targetType", "==", targetType),
        where("targetId", "in", chunk),
      ),
    );

    for (const documentSnapshot of snapshot.docs) {
      const data = documentSnapshot.data() as {
        targetId?: string;
      };

      if (data.targetId) {
        counts.set(data.targetId, (counts.get(data.targetId) ?? 0) + 1);
      }
    }
  }

  return counts;
}

/** All likes of one type made by a user, newest first. */
export async function listUserLikes(
  uid: string,
  targetType: LikeTargetType,
): Promise<Like[]> {
  const likesCollection = collection(db, "likes");

  const constraints = [
    where("userId", "==", uid),
    where("targetType", "==", targetType),
  ];

  function mapSnapshot(snapshot: {
    docs: { id: string; data: () => Record<string, unknown> }[];
  }): Like[] {
    return snapshot.docs.map(
      (documentSnapshot) =>
        ({ id: documentSnapshot.id, ...documentSnapshot.data() }) as Like,
    );
  }

  try {
    const snapshot = await getDocs(
      query(likesCollection, ...constraints, orderBy("createdAt", "desc")),
    );

    return mapSnapshot(snapshot);
  } catch (error) {
    /*
     * The userId+targetType+createdAt combination needs a
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
        "User like list needs a Firestore composite index; returning client-sorted results.",
        error,
      );

      const snapshot = await getDocs(query(likesCollection, ...constraints));

      return mapSnapshot(snapshot).sort((a, b) => {
        const aTime = a.createdAt?.toMillis() ?? 0;

        const bTime = b.createdAt?.toMillis() ?? 0;

        return bTime - aTime;
      });
    }

    throw error;
  }
}

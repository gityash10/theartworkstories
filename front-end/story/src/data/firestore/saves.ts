/*
 * Cloud Firestore data layer — saves.
 *
 * Collections (deterministic document IDs of the form
 * `${targetId}_user_${uid}`, mirroring the likes layer):
 *   artworkSaves/{artworkId}_user_{uid}    { artworkId, userId, createdAt }
 *   collectionSaves/{collectionId}_user_{uid} { collectionId, userId, createdAt }
 *
 * The deterministic ID makes duplicate saves structurally
 * impossible: saving twice writes the same document, and
 * unsaving deletes that exact document.
 *
 * The userId is always validated against the authenticated
 * Firebase user (auth.currentUser.uid); callers pass the uid
 * they believe is active, but a mismatch throws instead of
 * writing on someone else's behalf, and the security rules
 * re-validate server-side.
 *
 * Counts are derived from save documents (no denormalized
 * counters, no client-writable artworks.saves/collections.saves
 * fields). Firestore is initialized once in firebase.ts (`db`).
 *
 * Single-equality count queries run on Firestore's automatic
 * single-field indexes — no composite index is required.
 */

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getCountFromServer,
  query,
  serverTimestamp,
  setDoc,
  where,
  type Timestamp,
} from "firebase/firestore";

import { auth, db } from "../../firebase";

export type SaveTargetType = "artwork" | "collection";

/*
 * artworkSaves/{targetId}_user_{uid}
 * collectionSaves/{targetId}_user_{uid}
 */
export interface Save {
  id: string;

  /** Firestore document ID of the saved entity. */
  targetId: string;

  /** Firebase Auth UID of the user who saved. */
  userId: string;

  createdAt: Timestamp | null;
}

/**
 * Resolve the caller's identity: the passed userId must match
 * the authenticated Firebase user, otherwise the operation is
 * rejected before any write happens.
 */
async function requireMatchingUid(userId: string): Promise<string> {
  await auth.authStateReady();

  const uid = auth.currentUser?.uid;

  if (!uid) {
    throw new Error("save requires an authenticated user");
  }

  if (uid !== userId) {
    throw new Error("save userId must match the authenticated user");
  }

  return uid;
}

function saveCollectionName(targetType: SaveTargetType): string {
  return targetType === "artwork" ? "artworkSaves" : "collectionSaves";
}

function getSaveDocRef(targetType: SaveTargetType, targetId: string, uid: string) {
  return doc(db, saveCollectionName(targetType), `${targetId}_user_${uid}`);
}

/** Save an artwork on behalf of the authenticated user (idempotent). */
export async function saveArtwork(
  artworkId: string,
  userId: string,
): Promise<void> {
  const uid = await requireMatchingUid(userId);

  await setDoc(
    getSaveDocRef("artwork", artworkId, uid),
    {
      artworkId,

      userId: uid,

      createdAt: serverTimestamp(),
    },
    { merge: false },
  );
}

/** Remove the authenticated user's artwork save (idempotent). */
export async function unsaveArtwork(
  artworkId: string,
  userId: string,
): Promise<void> {
  const uid = await requireMatchingUid(userId);

  await deleteDoc(getSaveDocRef("artwork", artworkId, uid));
}

/** Whether the user has saved the artwork. */
export async function hasSavedArtwork(
  artworkId: string,
  userId: string,
): Promise<boolean> {
  const uid = await requireMatchingUid(userId);

  const snapshot = await getDoc(getSaveDocRef("artwork", artworkId, uid));

  return snapshot.exists();
}

/** Save count for one artwork, derived from artworkSaves documents. */
export async function getArtworkSaveCount(artworkId: string): Promise<number> {
  const snapshot = await getCountFromServer(
    query(
      collection(db, "artworkSaves"),
      where("artworkId", "==", artworkId),
    ),
  );

  return snapshot.data().count;
}

/** Save a collection on behalf of the authenticated user (idempotent). */
export async function saveCollection(
  collectionId: string,
  userId: string,
): Promise<void> {
  const uid = await requireMatchingUid(userId);

  await setDoc(
    getSaveDocRef("collection", collectionId, uid),
    {
      collectionId,

      userId: uid,

      createdAt: serverTimestamp(),
    },
    { merge: false },
  );
}

/** Remove the authenticated user's collection save (idempotent). */
export async function unsaveCollection(
  collectionId: string,
  userId: string,
): Promise<void> {
  const uid = await requireMatchingUid(userId);

  await deleteDoc(getSaveDocRef("collection", collectionId, uid));
}

/** Whether the user has saved the collection. */
export async function hasSavedCollection(
  collectionId: string,
  userId: string,
): Promise<boolean> {
  const uid = await requireMatchingUid(userId);

  const snapshot = await getDoc(getSaveDocRef("collection", collectionId, uid));

  return snapshot.exists();
}

/** Save count for one collection, derived from collectionSaves documents. */
export async function getCollectionSaveCount(
  collectionId: string,
): Promise<number> {
  const snapshot = await getCountFromServer(
    query(
      collection(db, "collectionSaves"),
      where("collectionId", "==", collectionId),
    ),
  );

  return snapshot.data().count;
}

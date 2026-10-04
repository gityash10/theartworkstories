/*
 * Cloud Firestore data layer — views.
 *
 * Collections:
 *   artworkViews/{viewId}    { artworkId, viewerId, createdAt }
 *   collectionViews/{viewId} { collectionId, viewerId, createdAt }
 *
 * Document IDs are deterministic within one page lifecycle:
 *   `${targetId}_viewer_${uid}_${pageLoadToken}`
 *
 * pageLoadToken is generated once when this module first loads
 * in the browser. Consequences:
 *   - React Strict Mode double-invoked effects (and any other
 *     repeated call during the same lifecycle) compute the SAME
 *     viewId, and a module-level Set skips the redundant write
 *     entirely — one page open produces exactly one document.
 *   - A page refresh reloads the module, producing a fresh
 *     token and therefore a new document — a refresh counts as
 *     another view, which is the chosen semantics.
 *
 * The viewerId is always taken from the authenticated Firebase
 * user (auth.currentUser.uid); it is never accepted from the
 * caller, and the security rules validate it server-side.
 *
 * Counts are derived from view documents (no denormalized
 * counters, no client-writable artworks.views/collections.views
 * fields). Firestore is initialized once in firebase.ts (`db`).
 *
 * Single-equality count queries run on Firestore's automatic
 * single-field indexes — no composite index is required.
 */

import {
  collection,
  doc,
  getCountFromServer,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { auth, db } from "../../firebase";

/**
 * One token per browser page load (module evaluation). Shared by
 * every write in this lifecycle so duplicate effect executions
 * collapse onto one document.
 */
const pageLoadToken = `${Date.now().toString(36)}-${Math.random()
  .toString(36)
  .slice(2, 10)}`;

/** View documents already written during this page lifecycle. */
const recordedThisLoad = new Set<string>();

async function recordView(
  collectionName: "artworkViews" | "collectionViews",
  targetField: "artworkId" | "collectionId",
  targetId: string,
): Promise<boolean> {
  await auth.authStateReady();

  const uid = auth.currentUser?.uid;

  if (!uid) {
    // Unauthenticated visitors never create view documents.
    return false;
  }

  const viewId = `${targetId}_viewer_${uid}_${pageLoadToken}`;
  const key = `${collectionName}/${viewId}`;

  if (recordedThisLoad.has(key)) {
    // Same page lifecycle (Strict Mode / re-render) — already
    // written (or in flight); never write it twice.
    return true;
  }

  recordedThisLoad.add(key);

  try {
    await setDoc(
      doc(db, collectionName, viewId),
      {
        [targetField]: targetId,

        viewerId: uid,

        createdAt: serverTimestamp(),
      },
      { merge: false },
    );

    return true;
  } catch (error) {
    // The write failed — allow a retry later in this lifecycle.
    recordedThisLoad.delete(key);

    throw error;
  }
}

/**
 * Record that the authenticated user opened an artwork detail
 * page. Safe to call from a page-level effect: unauthenticated
 * callers are a silent no-op, and repeated calls within the
 * same page lifecycle write at most one document.
 *
 * Returns true when a view document exists for this lifecycle
 * (written now or earlier), false when it was skipped because
 * there is no authenticated user.
 */
export function recordArtworkView(artworkId: string): Promise<boolean> {
  return recordView("artworkViews", "artworkId", artworkId);
}

/**
 * Record that the authenticated user opened a collection detail
 * page. Same contract as recordArtworkView.
 */
export function recordCollectionView(collectionId: string): Promise<boolean> {
  return recordView("collectionViews", "collectionId", collectionId);
}

/** View count for one artwork, derived from artworkViews documents. */
export async function getArtworkViewCount(artworkId: string): Promise<number> {
  const snapshot = await getCountFromServer(
    query(
      collection(db, "artworkViews"),
      where("artworkId", "==", artworkId),
    ),
  );

  return snapshot.data().count;
}

/** View count for one collection, derived from collectionViews documents. */
export async function getCollectionViewCount(
  collectionId: string,
): Promise<number> {
  const snapshot = await getCountFromServer(
    query(
      collection(db, "collectionViews"),
      where("collectionId", "==", collectionId),
    ),
  );

  return snapshot.data().count;
}

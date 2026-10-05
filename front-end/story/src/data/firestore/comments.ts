/*
 * Cloud Firestore data layer — comments.
 *
 * Collection: comments/{commentId} with an auto-generated
 * Firestore document ID (addDoc), mirroring the artworks layer.
 * One document per comment:
 *   { artworkId, userId, text, createdAt, updatedAt }
 *
 * The userId is always validated against the authenticated
 * Firebase user (auth.currentUser.uid) — a caller-supplied
 * userId that does not match is rejected before any write, and
 * the security rules re-validate everything server-side.
 *
 * No denormalized user profiles are stored in comment documents;
 * the UI resolves author information from users/{uid}.
 * Counts are derived with getCountFromServer (no client-writable
 * artworks.comments counter).
 *
 * Ordering: listArtworkComments orders by createdAt desc
 * (newest first). where(artworkId) + orderBy(createdAt) needs a
 * composite index; when Firestore reports failed-precondition
 * the layer falls back to an unordered fetch sorted client-side
 * (same pattern as listArtworks / listUserLikes).
 *
 * Firestore is initialized once in firebase.ts (`db`).
 */

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getCountFromServer,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Timestamp,
} from "firebase/firestore";

import { auth, db } from "../../firebase";

/** Hard limit for comment text. Mirrored in firestore.rules. */
export const COMMENT_MAX_LENGTH = 2000;

/*
 * comments/{commentId}
 */
export interface Comment {
  id: string;

  /** Firestore document ID of the commented artwork. */
  artworkId: string;

  /** Firebase Auth UID of the comment author. */
  userId: string;

  text: string;

  createdAt: Timestamp | null;

  updatedAt: Timestamp | null;
}

export type CommentValidationResult =
  | { ok: true; value: string }
  | { ok: false; error: string };

/**
 * Shared comment-text validation (UI + data layer): trim, reject
 * empty/whitespace-only text, enforce the maximum length. Never
 * truncates — invalid input returns a clear error instead.
 */
export function validateCommentText(input: string): CommentValidationResult {
  const trimmed = (input ?? "").trim();

  if (trimmed.length === 0) {
    return { ok: false, error: "Comment cannot be empty." };
  }

  if (trimmed.length > COMMENT_MAX_LENGTH) {
    return {
      ok: false,
      error: `Comment is too long — the limit is ${COMMENT_MAX_LENGTH} characters.`,
    };
  }

  return { ok: true, value: trimmed };
}

/**
 * Resolve the caller's identity: the passed userId (when given)
 * must match the authenticated Firebase user, otherwise the
 * operation is rejected before any write happens.
 */
async function requireMatchingUid(userId?: string): Promise<string> {
  await auth.authStateReady();

  const uid = auth.currentUser?.uid;

  if (!uid) {
    throw new Error("comment requires an authenticated user");
  }

  if (userId !== undefined && uid !== userId) {
    throw new Error("comment userId must match the authenticated user");
  }

  return uid;
}

/**
 * Create a comment on an artwork. Returns the new Firestore
 * document ID. The stored userId is always the authenticated
 * user's UID — never client-supplied data.
 */
export async function createComment(
  artworkId: string,
  userId: string,
  text: string,
): Promise<string> {
  const uid = await requireMatchingUid(userId);

  const validation = validateCommentText(text);

  if (!validation.ok) {
    throw new Error(validation.error);
  }

  const payload = {
    artworkId,

    userId: uid,

    text: validation.value,

    createdAt: serverTimestamp(),

    updatedAt: serverTimestamp(),
  };

  const reference = await addDoc(collection(db, "comments"), payload);

  return reference.id;
}

/**
 * Edit a comment's text. Only the owner may update; artworkId
 * and userId are never rewritten, and updatedAt moves
 * server-side. Editing never creates a new document.
 */
export async function updateComment(
  commentId: string,
  userId: string,
  text: string,
): Promise<void> {
  const uid = await requireMatchingUid(userId);

  const validation = validateCommentText(text);

  if (!validation.ok) {
    throw new Error(validation.error);
  }

  await updateDoc(doc(db, "comments", commentId), {
    text: validation.value,

    updatedAt: serverTimestamp(),
  });
}

/** Delete the user's own comment. */
export async function deleteComment(
  commentId: string,
  userId: string,
): Promise<void> {
  const uid = await requireMatchingUid(userId);

  await deleteDoc(doc(db, "comments", commentId));
}

/** Newest-first with pending server timestamps treated as newest. */
function sortByNewestFirst(comments: Comment[]): Comment[] {
  return [...comments].sort((a, b) => {
    const aMillis = a.createdAt ? a.createdAt.toMillis() : Number.MAX_SAFE_INTEGER;

    const bMillis = b.createdAt ? b.createdAt.toMillis() : Number.MAX_SAFE_INTEGER;

    return bMillis - aMillis;
  });
}

/**
 * List an artwork's comments, newest first. Falls back to an
 * unordered fetch + client-side sort when the composite index
 * (artworkId + createdAt) is missing.
 */
export async function listArtworkComments(
  artworkId: string,
): Promise<Comment[]> {
  const commentsCollection = collection(db, "comments");

  async function fetchOrdered() {
    const snapshot = await getDocs(
      query(
        commentsCollection,
        where("artworkId", "==", artworkId),
        orderBy("createdAt", "desc"),
      ),
    );

    return snapshot.docs.map(
      (documentSnapshot) =>
        ({
          id: documentSnapshot.id,
          ...documentSnapshot.data(),
        }) as Comment,
    );
  }

  async function fetchAndSortLocally() {
    const snapshot = await getDocs(
      query(commentsCollection, where("artworkId", "==", artworkId)),
    );

    return sortByNewestFirst(
      snapshot.docs.map(
        (documentSnapshot) =>
          ({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          }) as Comment,
      ),
    );
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
        "Comment list needs a Firestore composite index; sorting client-side.",
        error,
      );

      return fetchAndSortLocally();
    }

    throw error;
  }
}

/** Comment count for one artwork, derived from comment documents. */
export async function getCommentCount(artworkId: string): Promise<number> {
  const snapshot = await getCountFromServer(
    query(collection(db, "comments"), where("artworkId", "==", artworkId)),
  );

  return snapshot.data().count;
}

/*
 * Cloud Firestore data layer — collections.
 *
 * Collection: collections/{collectionId} — Firestore document IDs
 * are the collection IDs. Ownership always comes from the
 * authenticated Firebase user; a client-provided owner id is
 * never trusted.
 *
 * Artwork membership stores {artworkId, position, addedAt}
 * entries — artwork documents are referenced by ID, never
 * copied. Adding an artwork verifies that the artwork document
 * exists first. Missing/deleted artwork references are resolved
 * (and skipped) by the pages, not here.
 *
 * Members/collaborators and like/follow/save/view counters are
 * NOT part of this layer yet — those depend on the future
 * Likes/Follows migrations and remain deferred.
 *
 * Firestore is initialized once in story/src/firebase.ts (`db`).
 */

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type FieldValue,
  type QueryConstraint,
  type Timestamp,
} from "firebase/firestore";

import { db } from "../../firebase";

import { getArtwork } from "./artworks";

export type { CollectionVisibility } from "../../types/collection";

export interface CollectionArtworkEntry {
  /** Firestore artwork document ID. */
  artworkId: string;

  /** Position inside the collection. Lower number = earlier. */
  position: number;

  addedAt: string;
}

/*
 * collections/{collectionId}
 */
export interface FirestoreCollection {
  id: string;

  /** Firebase Auth UID of the owner. Immutable after creation. */
  ownerId: string;

  title: string;

  description: string;

  /** Cover image reference; null until image uploads exist. */
  coverImage: string | null;

  visibility: "public" | "private";

  tags: string[];

  /** Artwork membership ordered by position. */
  artworks: CollectionArtworkEntry[];

  /** Server timestamp set when the document is first created. */
  createdAt: FieldValue | Timestamp | null;

  /** Server timestamp refreshed on every write through this layer. */
  updatedAt: FieldValue | Timestamp | null;
}

export type CreateCollectionInput = Pick<
  FirestoreCollection,
  "title" | "description" | "coverImage" | "visibility" | "tags"
>;

function getCollectionDocRef(collectionId: string) {
  return doc(db, "collections", collectionId);
}

/*
 * Create a collection owned by the authenticated user. `uid`
 * must come from auth.currentUser.uid — never from form data.
 * Returns the new Firestore document ID.
 */
export async function createCollection(
  input: CreateCollectionInput,
  uid: string,
): Promise<string> {
  const payload = {
    ownerId: uid,

    title: input.title,

    description: input.description,

    coverImage: input.coverImage,

    visibility: input.visibility === "private" ? "private" : "public",

    tags: input.tags ?? [],

    artworks: [] as CollectionArtworkEntry[],

    createdAt: serverTimestamp(),

    updatedAt: serverTimestamp(),
  };

  const reference = await addDoc(collection(db, "collections"), payload);

  return reference.id;
}

/** Read a single collection. Returns null when it does not exist. */
export async function getCollection(
  collectionId: string,
): Promise<FirestoreCollection | null> {
  const snapshot = await getDoc(getCollectionDocRef(collectionId));

  if (!snapshot.exists()) {
    return null;
  }

  return { id: snapshot.id, ...snapshot.data() } as FirestoreCollection;
}

function mapDocs(
  docs: { id: string; data: () => Record<string, unknown> }[],
): FirestoreCollection[] {
  return docs.map(
    (documentSnapshot) =>
      ({
        id: documentSnapshot.id,
        ...documentSnapshot.data(),
      }) as FirestoreCollection,
  );
}

async function listWithFallback(
  constraints: QueryConstraint[],
): Promise<FirestoreCollection[]> {
  const collectionRef = collection(db, "collections");

  try {
    const snapshot = await getDocs(
      query(collectionRef, ...constraints, orderBy("createdAt", "desc")),
    );

    return mapDocs(snapshot.docs);
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "failed-precondition"
    ) {
      console.warn(
        "Collection list needs a Firestore composite index; returning unordered results.",
        error,
      );

      const snapshot = await getDocs(query(collectionRef, ...constraints));

      return mapDocs(snapshot.docs);
    }

    throw error;
  }
}

/** All public collections, newest first. */
export async function listPublicCollections(): Promise<FirestoreCollection[]> {
  return listWithFallback([where("visibility", "==", "public")]);
}

/** All collections owned by one user, newest first. */
export async function listUserCollections(
  uid: string,
): Promise<FirestoreCollection[]> {
  return listWithFallback([where("ownerId", "==", uid)]);
}

/** Update collection fields; updatedAt is refreshed server-side. */
export async function updateCollection(
  collectionId: string,
  updates: {
    title?: string;
    description?: string;
    coverImage?: string | null;
    visibility?: "public" | "private";
    tags?: string[];
  },
): Promise<void> {
  await updateDoc(getCollectionDocRef(collectionId), {
    ...updates,
    ...(updates.visibility !== undefined
      ? {
          visibility:
            updates.visibility === "private" ? "private" : "public",
        }
      : {}),
    updatedAt: serverTimestamp(),
  });
}

/** Delete a collection document. */
export async function deleteCollection(collectionId: string): Promise<void> {
  await deleteDoc(getCollectionDocRef(collectionId));
}

/*
 * Rewrite the artwork membership array with refreshed positions
 * and an updated timestamp. Membership is always modified on a
 * freshly read document so positions stay consistent.
 */
async function writeArtworkMembership(
  collectionId: string,
  artworks: CollectionArtworkEntry[],
): Promise<void> {
  await updateDoc(getCollectionDocRef(collectionId), {
    artworks,

    updatedAt: serverTimestamp(),
  });
}

/**
 * Add an artwork to a collection. The artwork document must
 * exist in Firestore; nothing is copied — only its document ID
 * is stored.
 */
export async function addArtworkToCollection(
  collectionId: string,
  artworkId: string,
): Promise<FirestoreCollection | null> {
  const artwork = await getArtwork(artworkId);

  if (!artwork) {
    throw new Error(
      `Artwork ${artworkId} does not exist — it cannot be added to a collection.`,
    );
  }

  const snapshot = await getDoc(getCollectionDocRef(collectionId));

  if (!snapshot.exists()) {
    return null;
  }

  const existing = (snapshot.data().artworks ??
    []) as CollectionArtworkEntry[];

  if (existing.some((item) => item.artworkId === artworkId)) {
    return { id: snapshot.id, ...snapshot.data() } as FirestoreCollection;
  }

  const artworks = [
    ...existing,
    {
      artworkId,

      position: existing.length,

      addedAt: new Date().toISOString(),
    },
  ];

  await writeArtworkMembership(collectionId, artworks);

  return getCollection(collectionId);
}

/** Remove an artwork reference and re-position the remaining ones. */
export async function removeArtworkFromCollection(
  collectionId: string,
  artworkId: string,
): Promise<FirestoreCollection | null> {
  const snapshot = await getDoc(getCollectionDocRef(collectionId));

  if (!snapshot.exists()) {
    return null;
  }

  const existing = (snapshot.data().artworks ??
    []) as CollectionArtworkEntry[];

  const artworks = existing
    .filter((item) => item.artworkId !== artworkId)
    .map((item, index) => ({ ...item, position: index }));

  await writeArtworkMembership(collectionId, artworks);

  return getCollection(collectionId);
}

/** Move an artwork from one position to another. */
export async function reorderCollectionArtwork(
  collectionId: string,
  fromIndex: number,
  toIndex: number,
): Promise<FirestoreCollection | null> {
  const snapshot = await getDoc(getCollectionDocRef(collectionId));

  if (!snapshot.exists()) {
    return null;
  }

  const existing = (snapshot.data().artworks ??
    []) as CollectionArtworkEntry[];

  const artworks = [...existing].sort((a, b) => a.position - b.position);

  if (
    fromIndex < 0 ||
    fromIndex >= artworks.length ||
    toIndex < 0 ||
    toIndex >= artworks.length
  ) {
    return { id: snapshot.id, ...snapshot.data() } as FirestoreCollection;
  }

  const [moved] = artworks.splice(fromIndex, 1);

  artworks.splice(toIndex, 0, moved);

  const reordered = artworks.map((item, index) => ({
    ...item,
    position: index,
  }));

  await writeArtworkMembership(collectionId, reordered);

  return getCollection(collectionId);
}

/*
 * Cloud Firestore data layer — artworks.
 *
 * Collection: artworks/{artworkId} — Firestore document IDs are
 * the artwork IDs. Ownership is always taken from the
 * authenticated Firebase user (auth.currentUser.uid); a
 * client-provided owner id is never trusted.
 *
 * NOTE ON IMAGES: artwork image files are not uploaded anywhere
 * yet (Firebase Storage comes later). Documents currently store
 * `imageFileName` for reference; `imageUrl` stays empty until
 * uploads exist. The create-form preview is a local data URL
 * that never persists.
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

export const ARTWORK_VISIBILITIES = ["public", "private"] as const;

export type ArtworkVisibility = (typeof ARTWORK_VISIBILITIES)[number];

export type ArtworkShareType = "own" | "other";

/*
 * artworks/{artworkId} — fields mirror the existing Share an
 * Artwork form terminology.
 */
export interface Artwork {
  id: string;

  /** Firebase Auth UID of the user who published the artwork. */
  ownerId: string;

  title: string;

  /** Artist name as shown on the artwork card. */
  artist: string;

  category: string;

  year: string;

  location: string;

  /** The story behind the artwork. */
  story: string;

  links: string[];

  videos: string[];

  /** File name only — audio files are not uploaded yet. */
  audio: string | null;

  tags: string[];

  visibility: ArtworkVisibility;

  /** "own" = created by the user, "other" = shared with credit. */
  shareType: ArtworkShareType;

  /** Required when sharing someone else's artwork. */
  originalArtist: string | null;

  source: string | null;

  /** Empty until Firebase Storage uploads are implemented. */
  imageUrl: string;

  /** Reference to the selected image file; not uploaded yet. */
  imageFileName: string | null;

  /** Server timestamp set when the document is first created. */
  createdAt: FieldValue | Timestamp | null;

  /** Server timestamp refreshed on every write through this layer. */
  updatedAt: FieldValue | Timestamp | null;
}

/** Shape accepted by create/update — every field optional except title/story. */
export type ArtworkInput = Partial<
  Omit<
    Artwork,
    "id" | "ownerId" | "createdAt" | "updatedAt" | "visibility" | "shareType"
  >
> & {
  visibility?: string;
  shareType?: string;
};

function normalizeVisibility(value: unknown): ArtworkVisibility {
  return value === "private" ? "private" : "public";
}

export function getArtworkDocRef(artworkId: string) {
  return doc(db, "artworks", artworkId);
}

/*
 * Create an artwork document owned by the authenticated user.
 * `uid` must come from auth.currentUser.uid — never from form
 * data. Returns the new Firestore document ID.
 */
export async function createArtwork(
  input: ArtworkInput,
  uid: string,
): Promise<string> {
  const payload = {
    ownerId: uid,

    title: input.title ?? "",

    artist: input.artist ?? "",

    category: input.category ?? "",

    year: input.year ?? "",

    location: input.location ?? "",

    story: input.story ?? "",

    links: input.links ?? [],

    videos: input.videos ?? [],

    audio: input.audio ?? null,

    tags: input.tags ?? [],

    visibility: normalizeVisibility(input.visibility),

    shareType: input.shareType === "other" ? "other" : "own",

    originalArtist: input.originalArtist ?? null,

    source: input.source ?? null,

    imageUrl: input.imageUrl ?? "",

    imageFileName: input.imageFileName ?? null,

    createdAt: serverTimestamp(),

    updatedAt: serverTimestamp(),
  };

  const reference = await addDoc(collection(db, "artworks"), payload);

  return reference.id;
}

/** Read a single artwork. Returns null when it does not exist. */
export async function getArtwork(
  artworkId: string,
): Promise<Artwork | null> {
  const snapshot = await getDoc(getArtworkDocRef(artworkId));

  if (!snapshot.exists()) {
    return null;
  }

  return { id: snapshot.id, ...snapshot.data() } as Artwork;
}

/*
 * List artworks, newest first. Optional filters: ownerId and/or
 * visibility. Firestore needs a composite index for
 * where(...) + orderBy(createdAt) combinations; if that index
 * does not exist yet, retry without ordering instead of
 * surfacing an error (results are then unordered).
 */
export async function listArtworks(
  options: {
    ownerId?: string;
    visibility?: string;
  } = {},
): Promise<Artwork[]> {
  const constraints: QueryConstraint[] = [];

  if (options.ownerId) {
    constraints.push(where("ownerId", "==", options.ownerId));
  }

  if (options.visibility) {
    constraints.push(
      where("visibility", "==", normalizeVisibility(options.visibility)),
    );
  }

  const artworkCollection = collection(db, "artworks");

  async function fetchOrdered() {
    const snapshot = await getDocs(
      query(artworkCollection, ...constraints, orderBy("createdAt", "desc")),
    );

    return snapshot.docs.map(
      (documentSnapshot) =>
        ({ id: documentSnapshot.id, ...documentSnapshot.data() }) as Artwork,
    );
  }

  async function fetchUnordered() {
    const snapshot = await getDocs(query(artworkCollection, ...constraints));

    return snapshot.docs.map(
      (documentSnapshot) =>
        ({ id: documentSnapshot.id, ...documentSnapshot.data() }) as Artwork,
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
        "Artwork list needs a Firestore composite index; returning unordered results.",
        error,
      );

      return fetchUnordered();
    }

    throw error;
  }
}

/** Convenience wrapper: all artworks owned by one user. */
export async function listUserArtworks(uid: string): Promise<Artwork[]> {
  return listArtworks({ ownerId: uid });
}

/** Update selected fields; updatedAt is always refreshed server-side. */
export async function updateArtwork(
  artworkId: string,
  input: ArtworkInput,
): Promise<void> {
  await updateDoc(getArtworkDocRef(artworkId), {
    ...input,
    ...(input.visibility !== undefined
      ? { visibility: normalizeVisibility(input.visibility) }
      : {}),
    updatedAt: serverTimestamp(),
  });
}

/** Delete an artwork document. */
export async function deleteArtwork(artworkId: string): Promise<void> {
  await deleteDoc(getArtworkDocRef(artworkId));
}

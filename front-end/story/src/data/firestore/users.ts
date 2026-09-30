/*
 * Initial Cloud Firestore data layer — users.
 *
 * Foundations only: collection names, the users/{uid} document
 * shape, and create/get/update helpers. Feature migrations
 * (profile UI, collections, artworks, likes, ...) come later and
 * will live next to this file under data/firestore/.
 *
 * Firestore is initialized once in story/src/firebase.ts (`db`).
 * Authentication remains handled exclusively by Firebase Auth —
 * no credentials, ID tokens, or refresh tokens are ever stored
 * in Firestore.
 */

import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  type FieldValue,
  type Timestamp,
} from "firebase/firestore";

import { db } from "../../firebase";

/*
 * Planned top-level collections. Constants only for now — no
 * records are created until features start using them.
 */
export const COLLECTIONS = {
  users: "users",
  artworks: "artworks",
  collections: "collections",
  comments: "comments",
  likes: "likes",
  follows: "follows",
  notifications: "notifications",
  activities: "activities",
  reports: "reports",
} as const;

/*
 * users/{uid} — the document ID is always the Firebase Auth UID.
 */
export interface UserProfile {
  /** Firebase Auth UID — also the Firestore document ID. */
  uid: string;
  displayName: string;
  /** Optional unique handle; can be assigned later by profile features. */
  username: string;
  email: string;
  photoURL: string;
  bio: string;
  location: string;
  website: string;
  /** Private contact number; never rendered on the public profile. */
  phone: string;
  coverImage: string;
  /** Server timestamp set when the document is first created. */
  joinedAt: FieldValue | Timestamp | null;
  /** Server timestamp refreshed on every write through this layer. */
  updatedAt: FieldValue | Timestamp | null;
}

/** Shape accepted by create/update — every field optional except uid. */
export type UserProfileInput = Partial<
  Omit<UserProfile, "uid" | "joinedAt" | "updatedAt">
>;

export function getUserDocRef(uid: string) {
  return doc(db, COLLECTIONS.users, uid);
}

/** Create the users/{uid} document. The Auth UID is the document ID. */
export async function createUserProfile(
  uid: string,
  input: UserProfileInput = {},
): Promise<void> {
  await setDoc(getUserDocRef(uid), {
    uid,
    displayName: "",
    username: "",
    email: "",
    photoURL: "",
    bio: "",
    location: "",
    website: "",
    phone: "",
    coverImage: "",
    ...input,
    joinedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/** Read a user document. Returns null when it does not exist yet. */
export async function getUserProfile(
  uid: string,
): Promise<UserProfile | null> {
  const snapshot = await getDoc(getUserDocRef(uid));

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as UserProfile;
}

/** Update selected fields; updatedAt is always refreshed server-side. */
export async function updateUserProfile(
  uid: string,
  input: UserProfileInput,
): Promise<void> {
  await updateDoc(getUserDocRef(uid), {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Create the user document if it is missing, leave it untouched
 * otherwise. Used as the small integration point after sign-up /
 * first authentication so every signed-in user ends up with a
 * users/{uid} document without rewriting the auth flows.
 */
export async function ensureUserProfile(
  user: {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
  },
  input: UserProfileInput = {},
): Promise<void> {
  const reference = getUserDocRef(user.uid);
  const snapshot = await getDoc(reference);

  if (snapshot.exists()) {
    return;
  }

  await setDoc(reference, {
    uid: user.uid,
    displayName: user.displayName ?? "",
    username: "",
    email: user.email ?? "",
    photoURL: user.photoURL ?? "",
    bio: "",
    location: "",
    website: "",
    phone: "",
    coverImage: "",
    ...input,
    joinedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

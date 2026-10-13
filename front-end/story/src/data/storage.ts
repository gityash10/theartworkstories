/*
 * Firebase Storage data layer — user/profile and artwork media.
 *
 * Follows the same conventions as data/firestore/*: one shared
 * Storage instance (story/src/firebase.ts `storage`), UID-based
 * ownership, and client validation that mirrors the Storage
 * security rules. The rules are the real gate — this layer only
 * fails fast with honest messages.
 *
 * Bucket structure (storage.rules mirrors it exactly):
 *   users/{uid}/profile/avatar.{ext}
 *   users/{uid}/cover/cover.{ext}
 *   artworks/{artworkId}/images/{uuid}.{ext}
 *   artworks/{artworkId}/audio/   — reserved, not implemented
 *   artworks/{artworkId}/video/   — reserved, not implemented
 *
 * A user-supplied filename is never trusted and never becomes part
 * of the path: the extension is derived from the validated MIME
 * type, and artwork filenames are random. Nothing here can build a
 * path traversal, and the caller cannot choose the folder.
 *
 * Storage is initialized once in story/src/firebase.ts (`storage`).
 */

import {
  deleteObject,
  getDownloadURL,
  ref as storageRef,
  uploadBytesResumable,
  type UploadTaskSnapshot,
} from "firebase/storage";

import { auth, storage } from "../firebase";

/** Image policy — mirrors storage.rules (5 MB, JPEG/PNG/WebP). */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

const EXTENSION_BY_TYPE: Record<AllowedImageType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/** For <input accept="..."> — keep in sync with the policy above. */
export const IMAGE_ACCEPT = ALLOWED_IMAGE_TYPES.join(",");

export type ImageValidation =
  | { ok: true; extension: string }
  | { ok: false; message: string };

/*
 * Validate a chosen file by its declared MIME type and size. The
 * extension is derived from the MIME type, never from the
 * filename — a ".jpg" name on an executable is rejected because
 * its type is not on the allow list.
 */
export function validateImageFile(file: File): ImageValidation {
  const type = (file.type || "").toLowerCase();

  if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(type)) {
    return { ok: false, message: "Please choose a JPG, PNG or WebP image." };
  }

  if (file.size === 0) {
    return { ok: false, message: "That file is empty." };
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, message: "Images must be 5 MB or smaller." };
  }

  return { ok: true, extension: EXTENSION_BY_TYPE[type as AllowedImageType] };
}

export interface UploadedImage {
  /** Download URL to store in Firestore and render in <img>. */
  url: string;
  /** Bucket path, stored alongside the URL so files can be replaced/removed. */
  path: string;
}

export type UploadProgress = (percent: number) => void;

function randomFileName(): string {
  const webCrypto = globalThis.crypto;

  if (webCrypto && typeof webCrypto.randomUUID === "function") {
    return webCrypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function requireUid(): string {
  const uid = auth.currentUser?.uid;

  if (!uid) {
    throw new Error("You must be signed in to upload files.");
  }

  return uid;
}

/** users/{uid}/profile/avatar.{ext} or users/{uid}/cover/cover.{ext} */
export function profileImagePath(
  uid: string,
  kind: "avatar" | "cover",
  extension: string,
): string {
  return kind === "avatar"
    ? `users/${uid}/profile/avatar.${extension}`
    : `users/${uid}/cover/cover.${extension}`;
}

/** artworks/{artworkId}/images/{uuid}.{ext} */
export function artworkImagePath(
  artworkId: string,
  extension: string,
): string {
  return `artworks/${artworkId}/images/${randomFileName()}.${extension}`;
}

/*
 * Upload a file to an explicit bucket path and resolve its
 * download URL. Progress is reported as a percentage so the UI can
 * show an honest uploading state.
 */
export async function uploadImageFile(
  path: string,
  file: File,
  onProgress?: UploadProgress,
): Promise<UploadedImage> {
  const task = uploadBytesResumable(storageRef(storage, path), file, {
    contentType: file.type,
  });

  const snapshot = await new Promise<UploadTaskSnapshot>((resolve, reject) => {
    task.on(
      "state_changed",
      (state) => {
        if (onProgress) {
          const percent =
            state.totalBytes > 0
              ? Math.round((state.bytesTransferred / state.totalBytes) * 100)
              : 0;

          onProgress(percent);
        }
      },
      reject,
      () => resolve(task.snapshot),
    );
  });

  const url = await getDownloadURL(snapshot.ref);

  return { url, path };
}

/*
 * Upload/replace the signed-in user's avatar or cover. Validates
 * first, derives the extension from the MIME type, and writes to
 * the caller's own users/{uid}/... path only — the uid comes from
 * auth, never from an argument.
 */
export async function uploadProfileImage(
  kind: "avatar" | "cover",
  file: File,
  onProgress?: UploadProgress,
): Promise<UploadedImage> {
  const uid = requireUid();

  const validation = validateImageFile(file);

  if (!validation.ok) {
    throw new Error(validation.message);
  }

  return uploadImageFile(
    profileImagePath(uid, kind, validation.extension),
    file,
    onProgress,
  );
}

/*
 * Upload an image for an artwork the signed-in user owns. Ownership
 * is enforced by the Storage rules (they read the artwork document);
 * this only validates the file and builds a safe path.
 */
export async function uploadArtworkImage(
  artworkId: string,
  file: File,
  onProgress?: UploadProgress,
): Promise<UploadedImage> {
  requireUid();

  const validation = validateImageFile(file);

  if (!validation.ok) {
    throw new Error(validation.message);
  }

  return uploadImageFile(
    artworkImagePath(artworkId, validation.extension),
    file,
    onProgress,
  );
}

/*
 * Delete one stored file. Callers use this for replaced/removed
 * media so uploads do not leak orphan files.
 */
export async function deleteStorageFile(path: string): Promise<void> {
  await deleteObject(storageRef(storage, path));
}

/*
 * Best-effort cleanup: never throws. Used after the authoritative
 * Firestore write has already succeeded, so a failed Storage
 * cleanup must not make a successful operation look failed.
 */
export async function deleteStorageFileQuietly(path: string): Promise<void> {
  try {
    await deleteStorageFile(path);
  } catch (error) {
    console.warn("Failed to remove old Storage file:", path, error);
  }
}

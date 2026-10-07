/*
 * Cloud Firestore data layer — reports.
 *
 * Collection: reports/{reportId}:
 *   { reporterId, targetType, targetId, reason, description?, createdAt }
 *
 * A report is a moderation record written by the user who is
 * reporting something: an artwork, a comment, a collection or
 * another user. Reports are deliberately write-only for normal
 * clients — there is no way to list, edit or delete them from the
 * app, because there is no moderation surface in this product
 * yet. The security rules enforce exactly that.
 *
 * Nothing about the target is copied into the document: no owner
 * profile, no title, no comment text. A report stores an ID and a
 * reason, nothing more, so it cannot leak content later.
 *
 * DUPLICATE PREVENTION — the document ID is deterministic:
 *
 *   {targetType}_{targetId}_{reporterId}_{reason}
 *
 * The reporter is always the authenticated user, so the same user
 * cannot file the same reason against the same target twice — the
 * second write would target the same document and the rules
 * reject updates. A different reason is a different report, which
 * is intended: a target can be both spam and harassment.
 *
 * PRIVACY MODEL — clients can submit a report and check whether
 * they already filed one (that check reads exactly one document,
 * whose ID contains their own uid). They cannot list reports, read
 * anyone else's report, or fetch a report they did not author.
 *
 * Firestore is initialized once in firebase.ts (`db`).
 */

import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { auth, db } from "../../firebase";

import { getArtwork } from "./artworks";

import { getCollection } from "./collections";

export const REPORT_TARGET_TYPES = [
  "artwork",
  "comment",
  "collection",
  "user",
] as const;

export type ReportTargetType = (typeof REPORT_TARGET_TYPES)[number];

/*
 * Stable machine-readable reasons. The UI renders the labels
 * below; Firestore only ever stores these values, and the rules
 * reject anything else.
 */
export const REPORT_REASONS = [
  "spam",
  "harassment",
  "hate_or_abuse",
  "sexual_content",
  "violence",
  "copyright",
  "misleading",
  "other",
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number];

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  spam: "Spam or repetitive content",
  harassment: "Harassment or bullying",
  hate_or_abuse: "Hate speech or abuse",
  sexual_content: "Sexual content",
  violence: "Violence or threats",
  copyright: "Copyright or ownership",
  misleading: "Misleading information",
  other: "Something else",
};

/** Maximum length of the optional description (rules enforce it too). */
export const REPORT_DESCRIPTION_MAX = 1000;

/*
 * reports/{reportId}
 */
export interface Report {
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  description?: string | null;
  createdAt: unknown;
}

export interface CreateReportInput {
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  /** Optional free text; trimmed, never truncated. */
  description?: string | null;
}

export interface CreateReportResult {
  id: string;
  /** True when this exact report already existed and was not rewritten. */
  alreadyReported: boolean;
}

export interface HasReportedInput {
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
}

/**
 * The deterministic report document ID. Exported because the UI
 * uses the same rule to recognise its own report; the security
 * rules re-derive and verify it server-side.
 */
export function getReportId(
  targetType: ReportTargetType,
  targetId: string,
  reporterId: string,
  reason: ReportReason,
): string {
  return `${targetType}_${targetId}_${reporterId}_${reason}`;
}

function requireReporter(): string {
  const uid = auth.currentUser?.uid;

  if (!uid) {
    throw new Error("report requires an authenticated user");
  }

  return uid;
}

/*
 * Resolve who owns the reported target so a user cannot file a
 * report against their own content. Returns null when the target
 * no longer exists — reporting a deleted target is harmless and
 * deliberately not blocked.
 *
 * comments.ts exposes only list/create/update/delete, so the
 * author is read directly here rather than adding a getter to a
 * module this task does not otherwise need to touch.
 */
async function resolveTargetOwnerId(
  targetType: ReportTargetType,
  targetId: string,
): Promise<string | null> {
  if (targetType === "user") {
    return targetId;
  }

  if (targetType === "artwork") {
    return (await getArtwork(targetId))?.ownerId ?? null;
  }

  if (targetType === "collection") {
    return (await getCollection(targetId))?.ownerId ?? null;
  }

  const snapshot = await getDoc(doc(db, "comments", targetId));

  if (!snapshot.exists()) {
    return null;
  }

  const authorId = snapshot.data().userId;

  return typeof authorId === "string" ? authorId : null;
}

/**
 * Normalise and validate the optional description: trimmed, and
 * either absent, or a non-empty string of at most
 * REPORT_DESCRIPTION_MAX characters. Never truncated, and an
 * empty description is rejected rather than silently dropped.
 */
function normalizeDescription(description?: string | null): string | null {
  if (description === undefined || description === null) {
    return null;
  }

  const trimmed = description.trim();

  if (!trimmed) {
    throw new Error("report description cannot be empty");
  }

  if (trimmed.length > REPORT_DESCRIPTION_MAX) {
    throw new Error(
      `report description must be ${REPORT_DESCRIPTION_MAX} characters or fewer`,
    );
  }

  return trimmed;
}

/**
 * Submit a report for the signed-in user. The reporter is always
 * the authenticated Firebase user — there is no reporterId
 * parameter, so no caller can file a report as somebody else.
 *
 * Self-reports are rejected, duplicates are detected instead of
 * rewritten, and validation failures throw a descriptive Error so
 * the UI can show an honest message.
 */
export async function createReport(
  input: CreateReportInput,
): Promise<CreateReportResult> {
  await auth.authStateReady();

  const reporterId = requireReporter();

  const targetId = input.targetId?.trim();

  if (!targetId) {
    throw new Error("report targetId is required");
  }

  const description = normalizeDescription(input.description);

  const ownerId = await resolveTargetOwnerId(input.targetType, targetId);

  if (ownerId === reporterId) {
    throw new Error("you cannot report your own content");
  }

  const reportId = getReportId(
    input.targetType,
    targetId,
    reporterId,
    input.reason,
  );

  const reference = doc(db, "reports", reportId);

  const existing = await getDoc(reference);

  if (existing.exists()) {
    return { id: reportId, alreadyReported: true };
  }

  try {
    await setDoc(reference, {
      reporterId,
      targetType: input.targetType,
      targetId,
      reason: input.reason,
      ...(description ? { description } : {}),
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    /*
     * A concurrent submit of the same report can lose the race and
     * be evaluated as an update, which the rules reject. If the
     * document exists now, the report was filed — report that
     * honestly instead of surfacing a permission error.
     */
    const now = await getDoc(reference);

    if (now.exists()) {
      return { id: reportId, alreadyReported: true };
    }

    throw error;
  }

  return { id: reportId, alreadyReported: false };
}

/**
 * Has the signed-in user already filed this exact report? Reads
 * the single deterministic document (never a query, never the
 * collection) and returns false when it cannot be determined — a
 * false negative is safe here because the rules still make a
 * duplicate write impossible.
 */
export async function hasReportedTarget(
  input: HasReportedInput,
): Promise<boolean> {
  await auth.authStateReady();

  const uid = auth.currentUser?.uid;

  if (!uid) {
    return false;
  }

  const targetId = input.targetId?.trim();

  if (!targetId) {
    return false;
  }

  try {
    const snapshot = await getDoc(
      doc(db, "reports", getReportId(input.targetType, targetId, uid, input.reason)),
    );

    return snapshot.exists();
  } catch (error) {
    console.error("Failed to check existing report:", error);

    return false;
  }
}

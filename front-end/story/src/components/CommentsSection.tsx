import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import {
  COMMENT_MAX_LENGTH,
  createComment,
  deleteComment,
  getCommentCount,
  listArtworkComments,
  updateComment,
  validateCommentText,
  type Comment,
} from "../data/firestore/comments";

import { getUserProfile } from "../data/firestore/users";

import { createActivity } from "../data/firestore/activities";

import { notifyTargetOwner } from "../data/firestore/notifications";

import { auth } from "../firebase";

/*
 * Comments section for the artwork detail page.
 *
 * Firestore-backed: comments/{commentId} documents; author names
 * resolve from users/{uid} (no profile data is duplicated into
 * comments). Newest first. Own comments expose Edit/Delete;
 * deleting uses the same inline red confirmation panel pattern
 * as the artwork delete. All state is Firestore-derived — no
 * optimistic fake data; the list re-reads after each mutation.
 *
 * Graceful degradation: a missing/unloadable author profile
 * renders as "Unknown user" with a neutral avatar instead of
 * breaking the section.
 */

type AuthorInfo = {
  displayName: string;
  photoURL: string;
};

type Avatar = {
  initials: string;
  photoURL: string;
  known: boolean;
};

function initialsFor(displayName: string): string {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "";
  }

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function avatarFor(author: AuthorInfo | undefined): Avatar {
  const displayName = author?.displayName ?? "";

  const initials = initialsFor(displayName);

  return {
    initials,
    photoURL: author?.photoURL ?? "",
    known: initials.length > 0,
  };
}

function timestampToIso(value: unknown): string | null {
  if (value && typeof value === "object" && "toDate" in value) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }

  return null;
}

function formatCommentDate(date: string | null) {
  if (!date) {
    return "Just now";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function wasEdited(comment: Comment): boolean {
  if (!comment.createdAt || !comment.updatedAt) {
    return false;
  }

  return comment.updatedAt.toMillis() - comment.createdAt.toMillis() > 1000;
}

function CommentsSection({ artworkId }: { artworkId: string }) {
  const [comments, setComments] = useState<Comment[] | null>(null);

  const [count, setCount] = useState<number | null>(null);

  const [loadError, setLoadError] = useState(false);

  const [currentUid, setCurrentUid] = useState<string | null>(null);

  const [authors, setAuthors] = useState<Record<string, AuthorInfo>>({});

  const [draft, setDraft] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [editText, setEditText] = useState("");

  const [editBusy, setEditBusy] = useState(false);

  const [editError, setEditError] = useState<string | null>(null);

  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(
    null,
  );

  const [deleteBusy, setDeleteBusy] = useState(false);

  const [deleteError, setDeleteError] = useState(false);

  /* Initial load: comments + count + author profiles. */
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        await auth.authStateReady();

        if (cancelled) {
          return;
        }

        setCurrentUid(auth.currentUser?.uid ?? null);

        const [loaded, loadedCount] = await Promise.all([
          listArtworkComments(artworkId),

          getCommentCount(artworkId),
        ]);

        if (cancelled) {
          return;
        }

        setComments(loaded);

        setCount(loadedCount);

        const uniqueAuthorIds = [
          ...new Set(loaded.map((comment) => comment.userId)),
        ];

        const profiles = await Promise.all(
          uniqueAuthorIds.map(async (uid) => {
            try {
              const profile = await getUserProfile(uid);

              return [
                uid,
                {
                  displayName: profile?.displayName ?? "",
                  photoURL: profile?.photoURL ?? "",
                },
              ] as const;
            } catch {
              /* Graceful degradation — unknown author. */
              return [uid, { displayName: "", photoURL: "" }] as const;
            }
          }),
        );

        if (cancelled) {
          return;
        }

        setAuthors(Object.fromEntries(profiles));
      } catch (error) {
        console.error("Failed to load comments:", error);

        if (!cancelled) {
          setLoadError(true);

          setComments([]);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [artworkId]);

  /* Re-read comments + count after any successful mutation. */
  async function refresh() {
    const [loaded, loadedCount] = await Promise.all([
      listArtworkComments(artworkId),

      getCommentCount(artworkId),
    ]);

    setComments(loaded);

    setCount(loadedCount);

    const missingAuthorIds = [
      ...new Set(
        loaded
          .map((comment) => comment.userId)
          .filter((uid) => !(uid in authors)),
      ),
    ];

    if (missingAuthorIds.length > 0) {
      const profiles = await Promise.all(
        missingAuthorIds.map(async (uid) => {
          try {
            const profile = await getUserProfile(uid);

            return [
              uid,
              {
                displayName: profile?.displayName ?? "",
                photoURL: profile?.photoURL ?? "",
              },
            ] as const;
          } catch {
            return [uid, { displayName: "", photoURL: "" }] as const;
          }
        }),
      );

      setAuthors((current) => ({ ...current, ...Object.fromEntries(profiles) }));
    }
  }

  const handleCreate = async () => {
    if (submitting) {
      return;
    }

    setSubmitError(null);

    const validation = validateCommentText(draft);

    if (!validation.ok) {
      setSubmitError(validation.error);

      return;
    }

    setSubmitting(true);

    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error("comment requires an authenticated user");
      }

      await createComment(artworkId, user.uid, validation.value);

      /*
       * NOTIFICATION — fire-and-forget: the comment above has
       * already succeeded, so a notification failure must never
       * roll it back. Skips self-actions internally.
       */
      void notifyTargetOwner({
        actorId: user.uid,

        type: "comment",

        targetType: "artwork",

        targetId: artworkId,

        message: "commented on your artwork.",
      });

      /*
       * ACTIVITY — fire-and-forget: the comment above has already
       * succeeded, and createActivity never throws, so the actor's
       * history can never roll a comment back.
       */
      void createActivity({
        type: "artwork_commented",

        targetId: artworkId,
      });

      setDraft("");

      await refresh();
    } catch (error) {
      console.error("Failed to create comment:", error);

      setSubmitError(
        error instanceof Error && !error.message.startsWith("comment requires")
          ? error.message
          : "Could not post your comment — please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (comment: Comment) => {
    setEditingId(comment.id);

    setEditText(comment.text);

    setEditError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);

    setEditText("");

    setEditError(null);
  };

  const handleUpdate = async () => {
    if (editBusy || !editingId) {
      return;
    }

    setEditError(null);

    const validation = validateCommentText(editText);

    if (!validation.ok) {
      setEditError(validation.error);

      return;
    }

    setEditBusy(true);

    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error("comment requires an authenticated user");
      }

      await updateComment(editingId, user.uid, validation.value);

      cancelEdit();

      await refresh();
    } catch (error) {
      console.error("Failed to update comment:", error);

      setEditError("Could not save your change — please try again.");
    } finally {
      setEditBusy(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (deleteBusy) {
      return;
    }

    setDeleteBusy(true);

    setDeleteError(false);

    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error("comment requires an authenticated user");
      }

      await deleteComment(commentId, user.uid);

      setConfirmingDeleteId(null);

      await refresh();
    } catch (error) {
      console.error("Failed to delete comment:", error);

      setDeleteError(true);
    } finally {
      setDeleteBusy(false);
    }
  };

  const canSubmit = draft.trim().length > 0 && draft.length <= COMMENT_MAX_LENGTH;

  return (
    <section className="mt-12 max-w-3xl">
      <p className="text-xs uppercase tracking-[0.25em] text-black/40">
        Comments{count === null ? "" : ` · ${count}`}
      </p>

      {comments === null ? (
        <p className="mt-5 text-sm text-black/50">Loading comments…</p>
      ) : loadError ? (
        <p className="mt-5 text-sm text-red-600">
          Comments could not be loaded — please refresh the page.
        </p>
      ) : (
        <>
          {/* COMMENT INPUT */}
          {currentUid ? (
            <div className="mt-5">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Add a comment…"
                rows={3}
                maxLength={COMMENT_MAX_LENGTH + 1}
                className="w-full rounded-xl border border-black/10 bg-white/70 px-4 py-3 text-sm leading-6 transition focus:border-black/40 focus:outline-none"
              />

              {submitError && (
                <p className="mt-2 text-sm text-red-600">{submitError}</p>
              )}

              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={submitting || !canSubmit}
                  className="inline-flex h-10 items-center rounded-full bg-black px-5 text-sm text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? "Posting…" : "Add Comment"}
                </button>

                <span className="text-xs text-black/40">
                  {draft.trim().length}/{COMMENT_MAX_LENGTH}
                </span>
              </div>
            </div>
          ) : (
            <p className="mt-5 text-sm text-black/50">
              Sign in to join the conversation.
            </p>
          )}

          {/* COMMENT LIST */}
          {comments.length === 0 ? (
            <p className="mt-8 text-sm text-black/50">
              No comments yet. Be the first to share a thought.
            </p>
          ) : (
            <ul className="mt-8 space-y-4">
              {comments.map((comment) => {
                const isOwner = currentUid === comment.userId;

                const avatar = avatarFor(authors[comment.userId]);

                const isEditing = editingId === comment.id;

                const isConfirmingDelete =
                  confirmingDeleteId === comment.id;

                return (
                  <li
                    key={comment.id}
                    className="rounded-2xl border border-black/10 bg-white/70 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {avatar.photoURL ? (
                          <img
                            src={avatar.photoURL}
                            alt=""
                            className="size-8 rounded-full object-cover"
                          />
                        ) : (
                          <span className="flex size-8 items-center justify-center rounded-full bg-black/[0.06] text-xs text-black/50">
                            {avatar.known ? avatar.initials : "·"}
                          </span>
                        )}

                        <div>
                          <p className="text-sm font-medium text-[#24231f]">
                            {authors[comment.userId]?.displayName?.trim() ||
                              "Unknown user"}
                          </p>

                          <p className="text-xs text-black/40">
                            {formatCommentDate(timestampToIso(comment.createdAt))}
                            {wasEdited(comment) && " · edited"}
                          </p>
                        </div>
                      </div>

                      {isOwner && !isEditing && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => startEdit(comment)}
                            title="Edit comment"
                            className="rounded-full p-2 text-black/40 transition hover:bg-black/[0.05] hover:text-black"
                          >
                            <Pencil className="size-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setDeleteError(false);
                              setConfirmingDeleteId(comment.id);
                            }}
                            title="Delete comment"
                            className="rounded-full p-2 text-black/40 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="mt-4">
                        <textarea
                          value={editText}
                          onChange={(event) => setEditText(event.target.value)}
                          rows={3}
                          maxLength={COMMENT_MAX_LENGTH + 1}
                          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm leading-6 transition focus:border-black/40 focus:outline-none"
                        />

                        {editError && (
                          <p className="mt-2 text-sm text-red-600">
                            {editError}
                          </p>
                        )}

                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={handleUpdate}
                            disabled={editBusy}
                            className="inline-flex h-9 items-center rounded-full bg-black px-4 text-sm text-white transition hover:opacity-90 disabled:opacity-50"
                          >
                            {editBusy ? "Saving…" : "Save Changes"}
                          </button>

                          <button
                            type="button"
                            onClick={cancelEdit}
                            disabled={editBusy}
                            className="inline-flex h-9 items-center rounded-full border border-black/10 bg-white px-4 text-sm transition hover:bg-black/[0.03] disabled:opacity-60"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-black/70">
                        {comment.text}
                      </p>
                    )}

                    {isConfirmingDelete && (
                      <div className="mt-4 rounded-xl border border-red-200 bg-red-50/70 p-4">
                        <p className="text-sm font-medium text-[#24231f]">
                          Delete this comment?
                        </p>

                        <p className="mt-1 text-xs leading-5 text-black/55">
                          This cannot be undone.
                        </p>

                        {deleteError && (
                          <p className="mt-2 text-sm text-red-600">
                            Delete failed — please try again.
                          </p>
                        )}

                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleDelete(comment.id)}
                            disabled={deleteBusy}
                            className="inline-flex h-9 items-center rounded-full bg-red-600 px-4 text-sm text-white transition hover:bg-red-700 disabled:opacity-60"
                          >
                            {deleteBusy ? "Deleting…" : "Yes, delete"}
                          </button>

                          <button
                            type="button"
                            onClick={() => setConfirmingDeleteId(null)}
                            disabled={deleteBusy}
                            className="inline-flex h-9 items-center rounded-full border border-black/10 bg-white px-4 text-sm transition hover:bg-black/[0.03] disabled:opacity-60"
                          >
                            Keep comment
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </section>
  );
}

export default CommentsSection;

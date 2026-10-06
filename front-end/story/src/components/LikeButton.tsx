import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

import {
  getLikeCount,
  hasLiked,
  likeTarget,
  unlikeTarget,
  type LikeTargetType,
} from "../data/firestore/likes";

import { createActivity } from "../data/firestore/activities";

import { notifyTargetOwner } from "../data/firestore/notifications";

import { auth } from "../firebase";

type LikeButtonProps = {
  targetType: LikeTargetType;
  targetId: string;
  showCount?: boolean;
  variant?: "pill" | "badge";
};

/*
 * Firestore-backed like toggle. The like state is loaded from
 * Firestore, toggles are idempotent server-side, in-flight
 * clicks are blocked, and failures are surfaced honestly
 * instead of pretending the like succeeded.
 */
function LikeButton({
  targetType,
  targetId,
  showCount = false,
  variant = "pill",
}: LikeButtonProps) {
  const [liked, setLiked] = useState(false);

  const [count, setCount] = useState<number | null>(null);

  const [ready, setReady] = useState(false);

  const [busy, setBusy] = useState(false);

  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadLikeState() {
      try {
        await auth.authStateReady();

        if (!auth.currentUser) {
          return;
        }

        const liked = await hasLiked(targetType, targetId);

        if (cancelled) {
          return;
        }

        setLiked(liked);

        if (showCount) {
          const count = await getLikeCount(targetType, targetId);

          if (!cancelled) {
            setCount(count);
          }
        }

        if (!cancelled) {
          setReady(true);
        }
      } catch (error) {
        console.error("Failed to load like state:", error);

        if (!cancelled) {
          setReady(true);
        }
      }
    }

    loadLikeState();

    return () => {
      cancelled = true;
    };
  }, [targetType, targetId, showCount]);

  const handleToggle = async () => {
    if (busy) {
      return;
    }

    setBusy(true);

    setError(false);

    try {
      if (liked) {
        await unlikeTarget(targetType, targetId);

        setLiked(false);

        setCount((current) =>
          current === null ? null : Math.max(0, current - 1),
        );
      } else {
        await likeTarget(targetType, targetId);

        setLiked(true);

        setCount((current) => (current === null ? null : current + 1));

        /*
         * NOTIFICATION — fire-and-forget: the like above has
         * already succeeded, so a notification failure must
         * never roll it back. Skips self-actions internally.
         */
        void notifyTargetOwner({
          actorId: auth.currentUser?.uid ?? "",

          type: "like",

          targetType,

          targetId,

          message:
            targetType === "artwork"
              ? "liked your artwork."
              : "liked your collection.",
        });

        /*
         * ACTIVITY — fire-and-forget: the like above has already
         * succeeded, and createActivity never throws, so the
         * actor's history can never roll a like back. Unliking is
         * deliberately not recorded.
         */
        void createActivity({
          type: targetType === "artwork" ? "artwork_liked" : "collection_liked",

          targetId,
        });
      }
    } catch (error) {
      console.error("Failed to update like:", error);

      setError(true);
    } finally {
      setBusy(false);
    }
  };

  if (variant === "badge") {
    return (
      <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] text-white backdrop-blur">
        <Heart className="size-3 fill-current" />

        <span>{ready ? (count ?? 0) : "…"}</span>
      </div>
    );
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        disabled={busy}
        onClick={handleToggle}
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition ${
          liked
            ? "border-black bg-black text-white"
            : "border-black/10 bg-white/50 hover:bg-white"
        }`}
        aria-pressed={liked}
        title={error ? "Like failed — please try again." : undefined}
      >
        <Heart className={`size-4 ${liked ? "fill-current" : ""}`} />

        {liked ? "Liked" : "Like"}
      </button>

      {error && (
        <span className="text-[11px] text-red-600">
          Like failed — please try again.
        </span>
      )}
    </div>
  );
}

export default LikeButton;

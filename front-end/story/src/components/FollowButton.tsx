import { useEffect, useState } from "react";
import { Users } from "lucide-react";

import {
  followTarget,
  hasFollowed,
  unfollowTarget,
  type FollowTargetType,
} from "../data/firestore/follows";

import { createActivity } from "../data/firestore/activities";

import { notifyTargetOwner } from "../data/firestore/notifications";

import { auth } from "../firebase";

type FollowButtonProps = {
  targetType: FollowTargetType;
  targetId: string;
};

/*
 * Firestore-backed follow toggle. State is loaded from
 * Firestore, toggles are idempotent server-side, in-flight
 * clicks are blocked, and failures are surfaced honestly
 * instead of pretending the follow succeeded.
 */
function FollowButton({ targetType, targetId }: FollowButtonProps) {
  const [following, setFollowing] = useState(false);

  const [ready, setReady] = useState(false);

  const [busy, setBusy] = useState(false);

  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadFollowState() {
      try {
        await auth.authStateReady();

        if (!auth.currentUser) {
          return;
        }

        const following = await hasFollowed(targetType, targetId);

        if (!cancelled) {
          setFollowing(following);

          setReady(true);
        }
      } catch (error) {
        console.error("Failed to load follow state:", error);

        if (!cancelled) {
          setReady(true);
        }
      }
    }

    loadFollowState();

    return () => {
      cancelled = true;
    };
  }, [targetType, targetId]);

  const handleToggle = async () => {
    if (busy) {
      return;
    }

    setBusy(true);

    setError(false);

    try {
      if (following) {
        await unfollowTarget(targetType, targetId);

        setFollowing(false);
      } else {
        await followTarget(targetType, targetId);

        setFollowing(true);

        /*
         * NOTIFICATION — fire-and-forget: the follow above has
         * already succeeded, so a notification failure must
         * never roll it back. Skips self-actions internally.
         */
        void notifyTargetOwner({
          actorId: auth.currentUser?.uid ?? "",

          type: "follow",

          targetType,

          targetId,

          message: "started following your collection.",
        });

        /*
         * ACTIVITY — fire-and-forget: the follow above has
         * already succeeded, and createActivity never throws, so
         * the actor's history can never roll a follow back.
         * Unfollowing is deliberately not recorded.
         */
        void createActivity({
          type: "collection_followed",

          targetId,
        });
      }
    } catch (error) {
      console.error("Failed to update follow:", error);

      setError(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        disabled={busy || !ready}
        onClick={handleToggle}
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition ${
          following
            ? "border-black bg-black text-white"
            : "border-black/10 bg-white/50 hover:bg-white"
        }`}
        aria-pressed={following}
        title={error ? "Follow failed — please try again." : undefined}
      >
        <Users className="size-4" />

        {following ? "Following" : "Follow"}
      </button>

      {error && (
        <span className="text-[11px] text-red-600">
          Follow failed — please try again.
        </span>
      )}
    </div>
  );
}

export default FollowButton;

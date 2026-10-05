import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";

import {
  getArtworkSaveCount,
  getCollectionSaveCount,
  hasSavedArtwork,
  hasSavedCollection,
  saveArtwork,
  saveCollection,
  unsaveArtwork,
  unsaveCollection,
  type SaveTargetType,
} from "../data/firestore/saves";

import { auth } from "../firebase";

type SaveButtonProps = {
  targetType: SaveTargetType;
  targetId: string;
  showCount?: boolean;
};

/*
 * Firestore-backed save toggle. The saved state is loaded from
 * Firestore (so it survives refreshes), toggles are idempotent
 * server-side through the deterministic save document ID,
 * in-flight clicks are blocked, and failures are surfaced
 * honestly instead of pretending the save succeeded.
 *
 * Visual language matches LikeButton / FollowButton: the pill
 * turns solid black when saved, aria-pressed mirrors state.
 */
function SaveButton({
  targetType,
  targetId,
  showCount = false,
}: SaveButtonProps) {
  const [saved, setSaved] = useState(false);

  const [count, setCount] = useState<number | null>(null);

  const [ready, setReady] = useState(false);

  const [busy, setBusy] = useState(false);

  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadSaveState() {
      try {
        await auth.authStateReady();

        const user = auth.currentUser;

        if (!user) {
          if (!cancelled) {
            setReady(true);
          }

          return;
        }

        const saved =
          targetType === "artwork"
            ? await hasSavedArtwork(targetId, user.uid)
            : await hasSavedCollection(targetId, user.uid);

        if (cancelled) {
          return;
        }

        setSaved(saved);

        if (showCount) {
          const count =
            targetType === "artwork"
              ? await getArtworkSaveCount(targetId)
              : await getCollectionSaveCount(targetId);

          if (!cancelled) {
            setCount(count);
          }
        }

        if (!cancelled) {
          setReady(true);
        }
      } catch (error) {
        console.error("Failed to load save state:", error);

        if (!cancelled) {
          setReady(true);
        }
      }
    }

    loadSaveState();

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
      await auth.authStateReady();

      const user = auth.currentUser;

      if (!user) {
        throw new Error("save requires an authenticated user");
      }

      if (saved) {
        if (targetType === "artwork") {
          await unsaveArtwork(targetId, user.uid);
        } else {
          await unsaveCollection(targetId, user.uid);
        }

        setSaved(false);

        setCount((current) =>
          current === null ? null : Math.max(0, current - 1),
        );
      } else {
        if (targetType === "artwork") {
          await saveArtwork(targetId, user.uid);
        } else {
          await saveCollection(targetId, user.uid);
        }

        setSaved(true);

        setCount((current) => (current === null ? null : current + 1));
      }
    } catch (error) {
      console.error("Failed to update save:", error);

      setError(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        disabled={busy}
        onClick={handleToggle}
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition ${
          saved
            ? "border-black bg-black text-white"
            : "border-black/10 bg-white/50 hover:bg-white"
        }`}
        aria-pressed={saved}
        title={error ? "Save failed — please try again." : undefined}
      >
        <Bookmark className={`size-4 ${saved ? "fill-current" : ""}`} />

        {saved ? "Saved" : "Save"}

        {showCount && (
          <span className={saved ? "text-white/70" : "text-black/45"}>
            {ready ? (count ?? 0) : "…"}
          </span>
        )}
      </button>

      {error && (
        <span className="text-[11px] text-red-600">
          Save failed — please try again.
        </span>
      )}
    </div>
  );
}

export default SaveButton;

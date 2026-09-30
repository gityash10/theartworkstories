import React, { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  Edit3,
  Eye,
  GripVertical,
  Heart,
  Link2,
  Plus,
  Settings,
  Share2,
  Trash2,
  Users,
  X,
} from "lucide-react";

import {
  addArtworkToCollection,
  deleteCollection,
  getCollection,
  removeArtworkFromCollection,
  reorderCollectionArtwork,
  updateCollection,
  type FirestoreCollection,
} from "../data/firestore/collections";

import {
  getArtwork,
  listArtworks,
  type Artwork,
} from "../data/firestore/artworks";

import AppSidebar from "../components/AppSidebar";

import { auth } from "../firebase";

const PLACEHOLDER_IMAGE = "/assets/images/story/story-mosaic.jpg";

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN", {
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

function timestampToIso(value: unknown): string | null {
  if (value && typeof value === "object" && "toDate" in value) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }

  return null;
}

function formatDate(date: string | null) {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

/*
 * Resolved artwork cards inside a collection. Membership stores
 * Firestore artwork IDs only; entries whose artwork document no
 * longer exists (deleted later) degrade gracefully instead of
 * crashing the page or silently swapping in demo data.
 */
type ResolvedArtwork = {
  id: string;
  title: string;
  artist: string;
  image: string;
  missing: boolean;
};

type PickerCard = {
  id: string;
  title: string;
  artist: string;
  image: string;
};

type LoadState = "loading" | "ready" | "notfound" | "error";

export default function CollectionPage() {
  const [collection, setCollection] = useState<FirestoreCollection | null>(
    null,
  );

  const [loadState, setLoadState] = useState<LoadState>("loading");

  const [isOwner, setIsOwner] = useState(false);

  const [artworkItems, setArtworkItems] = useState<ResolvedArtwork[]>([]);

  const [availableArtworkPicker, setAvailableArtworkPicker] = useState<
    PickerCard[]
  >([]);

  const [showAddArtwork, setShowAddArtwork] = useState(false);

  const [showEdit, setShowEdit] = useState(false);

  const [showReorder, setShowReorder] = useState(false);

  const [artworkSearch, setArtworkSearch] = useState("");

  const [editTitle, setEditTitle] = useState("");

  const [editDescription, setEditDescription] = useState("");

  const [copied, setCopied] = useState(false);

  const [liked, setLiked] = useState(false);

  const [followed, setFollowed] = useState(false);

  const [savedLocal, setSavedLocal] = useState(false);

  const collectionId = useMemo(() => {
    const params = new URLSearchParams(window.location.search);

    return params.get("id");
  }, []);

  /*
   * Resolve stored artwork IDs into cards. Deleted artworks are
   * kept as explicit "unavailable" entries — no demo fallback.
   */
  async function resolveArtworks(current: FirestoreCollection) {
    const entries = [...current.artworks].sort(
      (a, b) => a.position - b.position,
    );

    const resolved = await Promise.all(
      entries.map(async (item) => {
        const artwork = await getArtwork(item.artworkId);

        if (!artwork) {
          return {
            id: item.artworkId,
            title: "Artwork unavailable",
            artist: "This artwork may have been deleted.",
            image: PLACEHOLDER_IMAGE,
            missing: true,
          } satisfies ResolvedArtwork;
        }

        return {
          id: artwork.id,
          title: artwork.title || "Untitled artwork",
          artist: artwork.artist || "Unknown artist",
          image: artwork.imageUrl || PLACEHOLDER_IMAGE,
          missing: false,
        } satisfies ResolvedArtwork;
      }),
    );

    setArtworkItems(resolved);
  }

  useEffect(() => {
    if (collectionId === null) {
      return;
    }

    if (!collectionId) {
      setLoadState("notfound");
      return;
    }

    let cancelled = false;

    async function loadCollection() {
      try {
        const doc = await getCollection(collectionId as string);

        if (cancelled) {
          return;
        }

        if (!doc) {
          setLoadState("notfound");
          return;
        }

        await auth.authStateReady();

        const uid = auth.currentUser?.uid ?? null;

        if (!cancelled) {
          setIsOwner(uid !== null && doc.ownerId === uid);
          setCollection(doc);
          setLoadState("ready");
        }

        await resolveArtworks(doc);
      } catch (error) {
        console.error("Failed to load collection from Firestore:", error);

        if (!cancelled) {
          setLoadState("error");
        }
      }
    }

    loadCollection();

    return () => {
      cancelled = true;
    };
  }, [collectionId]);

  /*
   * The add-artwork picker offers the owner's own artworks plus
   * public artworks — the artworks a collection can reference.
   */
  useEffect(() => {
    if (loadState !== "ready" || !isOwner) {
      return;
    }

    let cancelled = false;

    async function loadPicker() {
      try {
        await auth.authStateReady();

        const user = auth.currentUser;

        if (!user) {
          return;
        }

        const [own, publicArtworks] = await Promise.all([
          listArtworks({ ownerId: user.uid }),
          listArtworks({ visibility: "public" }),
        ]);

        if (cancelled) {
          return;
        }

        const unique = new Map<string, Artwork>();

        for (const artwork of [...own, ...publicArtworks]) {
          unique.set(artwork.id, artwork);
        }

        setAvailableArtworkPicker(
          [...unique.values()].map((artwork) => ({
            id: artwork.id,
            title: artwork.title || "Untitled artwork",
            artist: artwork.artist || "Unknown artist",
            image: artwork.imageUrl || PLACEHOLDER_IMAGE,
          })),
        );
      } catch (error) {
        console.error(
          "Failed to load artworks for the collection picker:",
          error,
        );
      }
    }

    loadPicker();

    return () => {
      cancelled = true;
    };
  }, [loadState, isOwner]);

  if (loadState === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f1e8]">
        <div className="text-sm uppercase tracking-[0.2em] text-black/50">
          Loading collection...
        </div>
      </div>
    );
  }

  if (loadState === "notfound" || (loadState === "ready" && !collection)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f1e8] px-6">
        <div className="max-w-md text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-black/40">
            Collection not found
          </p>

          <h1 className="mt-4 font-serif text-4xl">
            This collection doesn't exist.
          </h1>

          <a
            href="../collections/index.html"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm text-white"
          >
            <ArrowLeft size={16} />
            Back to collections
          </a>
        </div>
      </div>
    );
  }

  if (loadState === "error" || !collection) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f1e8] px-6">
        <div className="max-w-md text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-black/40">
            Something went wrong
          </p>

          <h1 className="mt-4 font-serif text-4xl">
            We couldn't load this collection.
          </h1>

          <p className="mt-3 text-sm text-black/55">
            Please refresh the page to try again.
          </p>

          <a
            href="../collections/index.html"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm text-white"
          >
            <ArrowLeft size={16} />
            Back to collections
          </a>
        </div>
      </div>
    );
  }

  const selectedArtworkIds = new Set(
    collection.artworks.map((item) => item.artworkId),
  );

  const filteredAvailableArtworks = availableArtworkPicker.filter(
    (artwork) => {
      const search = artworkSearch.toLowerCase().trim();

      if (!search) {
        return !selectedArtworkIds.has(artwork.id);
      }

      return (
        !selectedArtworkIds.has(artwork.id) &&
        `${artwork.title} ${artwork.artist}`.toLowerCase().includes(search)
      );
    },
  );

  /*
   * Like / Follow / Save depend on the future Likes and Follows
   * systems. The buttons keep working as honest local feedback
   * until those migrations land — nothing is written to
   * Firestore and no fake counts are shown.
   */
  const handleLike = () => setLiked((value) => !value);

  const handleFollow = () => setFollowed((value) => !value);

  const handleSave = () => setSavedLocal((value) => !value);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      window.prompt("Copy this collection link:", window.location.href);
    }
  };

  const refreshCollection = async () => {
    const updated = collectionId ? await getCollection(collectionId) : null;

    if (updated) {
      setCollection(updated);

      await resolveArtworks(updated);
    }
  };

  const handleAddArtwork = async (artworkId: string) => {
    try {
      const updated = await addArtworkToCollection(
        collection.id,
        artworkId,
      );

      if (updated) {
        setCollection(updated);

        await resolveArtworks(updated);
      }

      setShowAddArtwork(false);

      setArtworkSearch("");
    } catch (error) {
      console.error("Failed to add artwork to collection:", error);

      window.alert(
        "We couldn't add that artwork to the collection. Please try again.",
      );
    }
  };

  const handleRemoveArtwork = async (artworkId: string) => {
    const confirmed = window.confirm(
      "Remove this artwork from the collection?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const updated = await removeArtworkFromCollection(
        collection.id,
        artworkId,
      );

      if (updated) {
        setCollection(updated);

        await resolveArtworks(updated);
      }
    } catch (error) {
      console.error("Failed to remove artwork from collection:", error);

      window.alert(
        "We couldn't remove that artwork from the collection. Please try again.",
      );
    }
  };

  const handleMoveArtwork = async (
    index: number,
    direction: "up" | "down",
  ) => {
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= collection.artworks.length) {
      return;
    }

    try {
      const updated = await reorderCollectionArtwork(
        collection.id,
        index,
        newIndex,
      );

      if (updated) {
        setCollection(updated);

        await resolveArtworks(updated);
      }
    } catch (error) {
      console.error("Failed to reorder the collection:", error);

      window.alert(
        "We couldn't reorder the collection. Please try again.",
      );
    }
  };

  const openEdit = () => {
    setEditTitle(collection.title);

    setEditDescription(collection.description);

    setShowEdit(true);
  };

  const saveEdit = async () => {
    if (!editTitle.trim()) {
      return;
    }

    try {
      await updateCollection(collection.id, {
        title: editTitle.trim(),

        description: editDescription.trim(),
      });

      const updated = await getCollection(collection.id);

      if (updated) {
        setCollection(updated);
      }

      setShowEdit(false);
    } catch (error) {
      console.error("Failed to update collection:", error);

      window.alert(
        "We couldn't save your changes. Please try again.",
      );
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Delete this collection permanently? This cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteCollection(collection.id);

      window.location.href = "../collections/index.html";
    } catch (error) {
      console.error("Failed to delete collection:", error);

      window.alert(
        "We couldn't delete this collection. Please try again.",
      );
    }
  };

  const ownerLabel = isOwner ? "You" : collection.ownerId;

  const memberRows = [
    {
      userId: isOwner ? "You (owner)" : collection.ownerId,
      initial: isOwner
        ? (auth.currentUser?.uid ?? "Y").charAt(0).toUpperCase()
        : collection.ownerId.charAt(0).toUpperCase(),
      role: "owner" as const,
      isYou: isOwner,
    },
  ];

  return (
    <>
      <AppSidebar active="collections" />

      <main className="min-h-screen bg-[#f5f1e8] text-[#191816] lg:ml-[220px]">
        {/* TOP BAR */}
        <header className="sticky top-0 z-40 border-b border-black/10 bg-[#f5f1e8]/95 backdrop-blur">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 lg:px-10">
            <a
              href="../collections/index.html"
              className="flex items-center gap-3 text-sm text-black/65 transition hover:text-black"
            >
              <span className="flex size-8 items-center justify-center rounded-full border border-black/15">
                <ArrowLeft className="size-4" />
              </span>

              <span className="hidden sm:inline">Back to Collections</span>
            </a>

            <h1 className="font-display text-lg">Collection</h1>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-sm transition hover:bg-black hover:text-white"
              >
                {copied ? <Check size={15} /> : <Share2 size={15} />}

                {copied ? "Copied" : "Share"}
              </button>

              {isOwner && (
                <button
                  onClick={openEdit}
                  className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm text-white transition hover:bg-black/80"
                >
                  <Edit3 size={15} />
                  Edit
                </button>
              )}
            </div>
          </div>
        </header>

        {/* HERO */}
        <section className="mx-auto max-w-[1500px] px-5 pb-16 pt-8 lg:px-10 lg:pt-12">
          <div className="grid overflow-hidden rounded-[2rem] border border-black/10 bg-[#e9e1d3] lg:grid-cols-[1.15fr_0.85fr]">
            <div className="relative min-h-[400px] overflow-hidden lg:min-h-[540px]">
              {collection.coverImage ? (
                <img
                  src={collection.coverImage}
                  alt={collection.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[#d9d0c1]">
                  <span className="font-serif text-5xl text-black/20">
                    Collection
                  </span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 rounded-full bg-white/90 px-4 py-2 text-xs uppercase tracking-[0.2em]">
                {collection.visibility}
              </div>
            </div>

            <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-14">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-black/45">
                  A collection by the community
                </p>

                <h1 className="mt-5 max-w-xl font-serif text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
                  {collection.title}
                </h1>

                {collection.description && (
                  <p className="mt-7 max-w-xl text-base leading-7 text-black/65">
                    {collection.description}
                  </p>
                )}

                {collection.tags.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-2">
                    {collection.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-black/15 px-3 py-1.5 text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-12">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-sm text-white">
                    {isOwner
                      ? (auth.currentUser?.uid ?? "Y")
                          .charAt(0)
                          .toUpperCase()
                      : collection.ownerId.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      {isOwner ? "You" : ownerLabel}
                    </p>

                    <p className="text-xs text-black/45">
                      Created{" "}
                      {formatDate(timestampToIso(collection.createdAt))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS + ACTIONS */}
        <section className="border-y border-black/10">
          <div className="mx-auto flex max-w-[1500px] flex-col gap-6 px-5 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-10">
            <div className="grid grid-cols-4 gap-5 sm:gap-10">
              <Stat
                icon={<Eye size={16} />}
                value="—"
                label="Views"
              />

              <Stat
                icon={<Heart size={16} />}
                value="—"
                label="Likes"
              />

              <Stat
                icon={<Users size={16} />}
                value="—"
                label="Followers"
              />

              <Stat
                icon={<Bookmark size={16} />}
                value="—"
                label="Saves"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <ActionButton
                icon={<Heart size={16} />}
                label={liked ? "Liked" : "Like"}
                onClick={handleLike}
              />

              <ActionButton
                icon={<Users size={16} />}
                label={followed ? "Following" : "Follow"}
                onClick={handleFollow}
              />

              <ActionButton
                icon={<Bookmark size={16} />}
                label={savedLocal ? "Saved" : "Save"}
                onClick={handleSave}
              />

              <ActionButton
                icon={<Link2 size={16} />}
                label="Share"
                onClick={handleShare}
              />
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="mx-auto max-w-[1500px] px-5 py-12 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[1fr_330px]">
            {/* ARTWORKS */}
            <div>
              <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-black/40">
                    The collection
                  </p>

                  <h2 className="mt-2 font-serif text-4xl">
                    {artworkItems.length} artworks
                  </h2>
                </div>

                {isOwner && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setShowAddArtwork(true)}
                      className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-sm text-white transition hover:bg-black/80"
                    >
                      <Plus size={16} />
                      Add artwork
                    </button>

                    <button
                      onClick={() => setShowReorder(true)}
                      className="inline-flex items-center gap-2 rounded-full border border-black/15 px-4 py-2.5 text-sm transition hover:bg-black hover:text-white"
                    >
                      <GripVertical size={16} />
                      Reorder
                    </button>
                  </div>
                )}
              </div>

              {artworkItems.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-black/20 p-16 text-center">
                  <p className="font-serif text-3xl">
                    This collection is empty.
                  </p>

                  {isOwner && (
                    <button
                      onClick={() => setShowAddArtwork(true)}
                      className="mt-6 rounded-full bg-black px-5 py-3 text-sm text-white"
                    >
                      Add your first artwork
                    </button>
                  )}
                </div>
              ) : (
                <div className="columns-1 gap-5 sm:columns-2 xl:columns-3">
                  {artworkItems.map((artwork) => (
                    <article
                      key={artwork.id}
                      className="group mb-5 break-inside-avoid overflow-hidden rounded-2xl bg-white"
                    >
                      <div className="relative overflow-hidden">
                        {artwork.missing ? (
                          <div className="flex h-40 items-center justify-center bg-[#e9e1d3] text-xs uppercase tracking-[0.2em] text-black/35">
                            Artwork unavailable
                          </div>
                        ) : (
                          <img
                            src={artwork.image}
                            alt={artwork.title}
                            className="block w-full transition duration-500 group-hover:scale-[1.02]"
                          />
                        )}

                        {isOwner && (
                          <button
                            onClick={() => handleRemoveArtwork(artwork.id)}
                            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/80 text-white opacity-0 transition group-hover:opacity-100"
                            title="Remove artwork"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>

                      <div className="p-4">
                        <p className="font-serif text-xl">{artwork.title}</p>

                        <p className="mt-1 text-sm text-black/45">
                          {artwork.artist}
                        </p>

                        {!artwork.missing && (
                          <a
                            href={`../artwork/index.html?id=${encodeURIComponent(
                              artwork.id,
                            )}`}
                            className="mt-4 inline-flex items-center gap-1 text-xs uppercase tracking-[0.15em] text-black/55 transition hover:text-black"
                          >
                            View artwork
                            <ArrowRight size={13} />
                          </a>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* SIDEBAR */}
            <aside className="space-y-6">
              {/* OWNER CONTROLS */}
              {isOwner && (
                <div className="rounded-3xl bg-black p-6 text-white">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/45">
                    <Settings size={14} />
                    Owner controls
                  </div>

                  <div className="mt-5 space-y-2">
                    <OwnerButton
                      icon={<Edit3 size={16} />}
                      label="Edit collection"
                      onClick={openEdit}
                    />

                    <OwnerButton
                      icon={<Plus size={16} />}
                      label="Add artwork"
                      onClick={() => setShowAddArtwork(true)}
                    />

                    <OwnerButton
                      icon={<GripVertical size={16} />}
                      label="Reorder artworks"
                      onClick={() => setShowReorder(true)}
                    />
                  </div>

                  <button
                    onClick={handleDelete}
                    className="mt-5 flex w-full items-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm text-red-300 transition hover:bg-white/10"
                  >
                    <Trash2 size={16} />
                    Delete collection
                  </button>
                </div>
              )}

              {/* MEMBERS */}
              <div className="rounded-3xl border border-black/10 bg-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                      People
                    </p>

                    <h3 className="mt-2 font-serif text-2xl">Members</h3>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {memberRows.map((member) => (
                    <div
                      key={member.role}
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e9e1d3] text-xs font-medium">
                        {member.initial}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm">{member.userId}</p>

                        <p className="text-xs capitalize text-black/40">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-5 text-xs leading-5 text-black/40">
                  Collaborators arrive with the members/permissions phase.
                </p>
              </div>

              {/* STATS */}
              <div className="rounded-3xl border border-black/10 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                  Collection stats
                </p>

                <div className="mt-6 space-y-4">
                  <MiniStat
                    label="Artwork count"
                    value={artworkItems.length}
                  />

                  <MiniStat label="Views" value="—" />

                  <MiniStat label="Likes" value="—" />

                  <MiniStat
                    label="Followers"
                    value="—"
                  />

                  <MiniStat label="Saves" value="—" />

                  <MiniStat label="Members" value={memberRows.length} />
                </div>
              </div>

              {/* ABOUT */}
              <div className="rounded-3xl bg-[#e9e1d3] p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                  About
                </p>

                <p className="mt-4 text-sm leading-6 text-black/65">
                  Collections are spaces for people to gather artworks around an
                  idea, feeling, place, artist, or story.
                </p>

                <p className="mt-4 text-xs text-black/40">
                  Updated{" "}
                  {formatDate(timestampToIso(collection.updatedAt))}
                </p>
              </div>
            </aside>
          </div>
        </section>

        {/* ADD ARTWORK MODAL */}
        {showAddArtwork && (
          <Modal
            title="Add artwork"
            onClose={() => {
              setShowAddArtwork(false);

              setArtworkSearch("");
            }}
          >
            <div className="space-y-5">
              <input
                value={artworkSearch}
                onChange={(event) => setArtworkSearch(event.target.value)}
                placeholder="Search artworks..."
                className="w-full rounded-xl border border-black/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-black"
              />

              <div className="grid max-h-[55vh] gap-3 overflow-y-auto">
                {filteredAvailableArtworks.length === 0 ? (
                  <p className="py-8 text-center text-sm text-black/45">
                    No artworks available.
                  </p>
                ) : (
                  filteredAvailableArtworks.map((artwork) => (
                    <button
                      key={artwork.id}
                      onClick={() => handleAddArtwork(artwork.id)}
                      className="flex items-center gap-4 rounded-2xl border border-black/10 p-2 text-left transition hover:bg-black/5"
                    >
                      <img
                        src={artwork.image}
                        alt=""
                        className="h-16 w-16 rounded-xl object-cover"
                      />

                      <div>
                        <p className="font-serif text-lg">{artwork.title}</p>

                        <p className="text-xs text-black/45">
                          {artwork.artist}
                        </p>
                      </div>

                      <Plus size={18} className="ml-auto mr-3" />
                    </button>
                  ))
                )}
              </div>
            </div>
          </Modal>
        )}

        {/* EDIT MODAL */}
        {showEdit && (
          <Modal title="Edit collection" onClose={() => setShowEdit(false)}>
            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.15em] text-black/40">
                  Title
                </span>

                <input
                  value={editTitle}
                  onChange={(event) => setEditTitle(event.target.value)}
                  className="w-full rounded-xl border border-black/15 bg-transparent px-4 py-3 text-sm outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.15em] text-black/40">
                  Description
                </span>

                <textarea
                  value={editDescription}
                  onChange={(event) => setEditDescription(event.target.value)}
                  rows={5}
                  className="w-full resize-none rounded-xl border border-black/15 bg-transparent px-4 py-3 text-sm outline-none"
                />
              </label>

              <button
                onClick={saveEdit}
                className="w-full rounded-xl bg-black px-5 py-3 text-sm text-white"
              >
                Save changes
              </button>
            </div>
          </Modal>
        )}

        {/* REORDER MODAL */}
        {showReorder && (
          <Modal title="Reorder artworks" onClose={() => setShowReorder(false)}>
            <div className="space-y-2">
              {artworkItems.map((artwork, index) => (
                <div
                  key={artwork.id}
                  className="flex items-center gap-3 rounded-2xl border border-black/10 p-2"
                >
                  <GripVertical size={18} className="ml-2 text-black/25" />

                  <img
                    src={artwork.image}
                    alt=""
                    className="h-14 w-14 rounded-xl object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {artwork.title}
                    </p>

                    <p className="text-xs text-black/40">
                      Position {index + 1}
                    </p>
                  </div>

                  <div className="flex gap-1">
                    <button
                      disabled={index === 0}
                      onClick={() => handleMoveArtwork(index, "up")}
                      className="rounded-lg border border-black/10 p-2 disabled:opacity-25"
                    >
                      ↑
                    </button>

                    <button
                      disabled={index === artworkItems.length - 1}
                      onClick={() => handleMoveArtwork(index, "down")}
                      className="rounded-lg border border-black/10 p-2 disabled:opacity-25"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Modal>
        )}
      </main>
    </>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-black/35">
        {icon}

        <span className="text-[10px] uppercase tracking-[0.15em]">{label}</span>
      </div>

      <p className="mt-1 text-lg font-medium">
        {typeof value === "number" ? formatNumber(value) : value}
      </p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex items-center justify-between border-b border-black/10 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-black/50">{label}</span>

      <span className="font-medium">
        {typeof value === "number" ? formatNumber(value) : value}
      </span>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-black/15 px-4 py-2.5 text-sm transition hover:bg-black hover:text-white"
    >
      {icon}
      {label}
    </button>
  );
}

function OwnerButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition hover:bg-white/10"
    >
      {icon}
      {label}
    </button>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-[2rem] bg-[#f5f1e8] shadow-2xl">
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
          <h2 className="font-serif text-2xl">{title}</h2>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 transition hover:bg-black hover:text-white"
          >
            <X size={17} />
          </button>
        </div>

        <div className="max-h-[calc(90vh-80px)] overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

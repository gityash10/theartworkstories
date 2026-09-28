import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

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
  UserPlus,
  Users,
  X,
} from "lucide-react";

import {
  addArtworkToCollection,
  addCollectionMember,
  deleteCollection,
  followCollection,
  getCollection,
  incrementCollectionViews,
  likeCollection,
  removeArtworkFromCollection,
  removeCollectionMember,
  reorderCollectionArtwork,
  saveCollection,
  updateCollection,
} from "../data/collections";
import {
  availableArtworks,
  type Artwork,
} from "../data/artworks";
import AppSidebar from "../components/AppSidebar";

import type { Collection } from "../types/collection";

const CURRENT_USER_ID = "demo-user-yash";

function getArtwork(id: string): Artwork | undefined {
  return availableArtworks.find(
    (artwork) => artwork.id === id,
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN", {
    notation:
      value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default function CollectionPage() {
  const [collection, setCollection] =
    useState<Collection | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [showAddArtwork, setShowAddArtwork] =
    useState(false);

  const [showMembers, setShowMembers] =
    useState(false);

  const [showEdit, setShowEdit] =
    useState(false);

  const [showReorder, setShowReorder] =
    useState(false);

  const [artworkSearch, setArtworkSearch] =
    useState("");

  const [editTitle, setEditTitle] =
    useState("");

  const [editDescription, setEditDescription] =
    useState("");

  const [memberUserId, setMemberUserId] =
    useState("");

  const [memberRole, setMemberRole] =
    useState<"editor" | "viewer">(
      "viewer",
    );

  const [copied, setCopied] =
    useState(false);

  const collectionId = useMemo(() => {
    const params = new URLSearchParams(
      window.location.search,
    );

    return params.get("id");
  }, []);

  useEffect(() => {
    if (!collectionId) {
      setLoading(false);
      return;
    }

    const found =
      getCollection(collectionId);

    if (found) {
      const updated =
        incrementCollectionViews(
          collectionId,
        );

      setCollection(updated ?? found);
    }

    setLoading(false);
  }, [collectionId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f1e8]">
        <div className="text-sm uppercase tracking-[0.2em] text-black/50">
          Loading collection...
        </div>
      </div>
    );
  }

  if (!collectionId || !collection) {
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

  const isOwner =
    collection.ownerId ===
    CURRENT_USER_ID;

  const artworkItems =
    collection.artworks
      .slice()
      .sort(
        (a, b) =>
          a.position - b.position,
      )
      .map((item) =>
        getArtwork(item.artworkId),
      )
      .filter(
        Boolean,
      ) as ArtworkItem[];

  const selectedArtworkIds =
    new Set(
      collection.artworks.map(
        (item) => item.artworkId,
      ),
    );

  const filteredAvailableArtworks =
    availableArtworks.filter(
      (artwork) => {
        const search =
          artworkSearch
            .toLowerCase()
            .trim();

        if (!search) {
          return !selectedArtworkIds.has(
            artwork.id,
          );
        }

        return (
          !selectedArtworkIds.has(
            artwork.id,
          ) &&
          `${artwork.title} ${artwork.artist}`
            .toLowerCase()
            .includes(search)
        );
      },
    );

  const handleLike = () => {
    const updated =
      likeCollection(
        collection.id,
      );

    if (updated) {
      setCollection(updated);
    }
  };

  const handleFollow = () => {
    const updated =
      followCollection(
        collection.id,
      );

    if (updated) {
      setCollection(updated);
    }
  };

  const handleSave = () => {
    const updated =
      saveCollection(
        collection.id,
      );

    if (updated) {
      setCollection(updated);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        window.location.href,
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      window.prompt(
        "Copy this collection link:",
        window.location.href,
      );
    }
  };

  const handleAddArtwork = (
    artworkId: string,
  ) => {
    const updated =
      addArtworkToCollection(
        collection.id,
        artworkId,
      );

    if (updated) {
      setCollection(updated);
    }
  };

  const handleRemoveArtwork = (
    artworkId: string,
  ) => {
    const confirmed =
      window.confirm(
        "Remove this artwork from the collection?",
      );

    if (!confirmed) {
      return;
    }

    const updated =
      removeArtworkFromCollection(
        collection.id,
        artworkId,
      );

    if (updated) {
      setCollection(updated);
    }
  };

  const handleMoveArtwork = (
    index: number,
    direction: "up" | "down",
  ) => {
    const newIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      newIndex < 0 ||
      newIndex >=
        collection.artworks.length
    ) {
      return;
    }

    const updated =
      reorderCollectionArtwork(
        collection.id,
        index,
        newIndex,
      );

    if (updated) {
      setCollection(updated);
    }
  };

  const openEdit = () => {
    setEditTitle(
      collection.title,
    );

    setEditDescription(
      collection.description,
    );

    setShowEdit(true);
  };

  const saveEdit = () => {
    if (!editTitle.trim()) {
      return;
    }

    const updated =
      updateCollection(
        collection.id,
        {
          title:
            editTitle.trim(),

          description:
            editDescription.trim(),
        },
      );

    if (updated) {
      setCollection(updated);
      setShowEdit(false);
    }
  };

  const addMember = () => {
    const userId =
      memberUserId.trim();

    if (!userId) {
      return;
    }

    const existing =
      collection.members.some(
        (member) =>
          member.userId === userId,
      );

    if (existing) {
      window.alert(
        "This user is already a member of the collection.",
      );

      return;
    }

    const updated =
      addCollectionMember(
        collection.id,
        userId,
        memberRole,
      );

    if (updated) {
      setCollection(updated);
      setMemberUserId("");
    }
  };

  const removeMember = (
    userId: string,
  ) => {
    const confirmed =
      window.confirm(
        `Remove ${userId} from this collection?`,
      );

    if (!confirmed) {
      return;
    }

    const updated =
      removeCollectionMember(
        collection.id,
        userId,
      );

    if (updated) {
      setCollection(updated);
    }
  };

  const handleDelete = () => {
    const confirmed =
      window.confirm(
        "Delete this collection permanently? This cannot be undone.",
      );

    if (!confirmed) {
      return;
    }

    deleteCollection(
      collection.id,
    );

    window.location.href =
      "../collections/index.html";
  };

  return (
    <>
      <AppSidebar active="collections" />

      <main className="min-h-screen bg-[#f5f1e8] text-[#191816] lg:ml-[220px]">
      {/* TOP BAR */}
      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#f5f1e8]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 lg:px-10">
          <a
            href="../collections/index.html"
            className="inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-60"
          >
            <ArrowLeft size={17} />
            Collections
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-sm transition hover:bg-black hover:text-white"
            >
              {copied ? (
                <Check size={15} />
              ) : (
                <Share2 size={15} />
              )}

              {copied
                ? "Copied"
                : "Share"}
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

              {collection.tags.length >
                0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {collection.tags.map(
                    (tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-black/15 px-3 py-1.5 text-xs"
                      >
                        #{tag}
                      </span>
                    ),
                  )}
                </div>
              )}
            </div>

            <div className="mt-12">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-sm text-white">
                  {collection.ownerId
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <p className="text-sm font-medium">
                    {collection.ownerId}
                  </p>

                  <p className="text-xs text-black/45">
                    Created{" "}
                    {formatDate(
                      collection.createdAt,
                    )}
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
              value={
                collection.stats.views
              }
              label="Views"
            />

            <Stat
              icon={<Heart size={16} />}
              value={
                collection.stats.likes
              }
              label="Likes"
            />

            <Stat
              icon={<Users size={16} />}
              value={
                collection.stats
                  .followers
              }
              label="Followers"
            />

            <Stat
              icon={
                <Bookmark size={16} />
              }
              value={
                collection.stats
                  .saves
              }
              label="Saves"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <ActionButton
              icon={
                <Heart size={16} />
              }
              label="Like"
              onClick={handleLike}
            />

            <ActionButton
              icon={
                <Users size={16} />
              }
              label="Follow"
              onClick={handleFollow}
            />

            <ActionButton
              icon={
                <Bookmark size={16} />
              }
              label="Save"
              onClick={handleSave}
            />

            <ActionButton
              icon={
                <Link2 size={16} />
              }
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
                  {artworkItems.length}{" "}
                  artworks
                </h2>
              </div>

              {isOwner && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      setShowAddArtwork(
                        true,
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-sm text-white transition hover:bg-black/80"
                  >
                    <Plus size={16} />
                    Add artwork
                  </button>

                  <button
                    onClick={() =>
                      setShowReorder(
                        true,
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-full border border-black/15 px-4 py-2.5 text-sm transition hover:bg-black hover:text-white"
                  >
                    <GripVertical
                      size={16}
                    />
                    Reorder
                  </button>
                </div>
              )}
            </div>

            {artworkItems.length ===
            0 ? (
              <div className="rounded-3xl border border-dashed border-black/20 p-16 text-center">
                <p className="font-serif text-3xl">
                  This collection is
                  empty.
                </p>

                {isOwner && (
                  <button
                    onClick={() =>
                      setShowAddArtwork(
                        true,
                      )
                    }
                    className="mt-6 rounded-full bg-black px-5 py-3 text-sm text-white"
                  >
                    Add your first
                    artwork
                  </button>
                )}
              </div>
            ) : (
              <div className="columns-1 gap-5 sm:columns-2 xl:columns-3">
                {artworkItems.map(
                  (
                    artwork,
                  ) => (
                    <article
                      key={
                        artwork.id
                      }
                      className="group mb-5 break-inside-avoid overflow-hidden rounded-2xl bg-white"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={
                            artwork.image
                          }
                          alt={
                            artwork.title
                          }
                          className="block w-full transition duration-500 group-hover:scale-[1.02]"
                        />

                        {isOwner && (
                          <button
                            onClick={() =>
                              handleRemoveArtwork(
                                artwork.id,
                              )
                            }
                            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/80 text-white opacity-0 transition group-hover:opacity-100"
                            title="Remove artwork"
                          >
                            <X
                              size={
                                16
                              }
                            />
                          </button>
                        )}
                      </div>

                      <div className="p-4">
                        <p className="font-serif text-xl">
                          {
                            artwork.title
                          }
                        </p>

                        <p className="mt-1 text-sm text-black/45">
                          {
                            artwork.artist
                          }
                        </p>

                        <a
                          href={`../artwork/index.html?id=${encodeURIComponent(
                            artwork.id,
                          )}`}
                          className="mt-4 inline-flex items-center gap-1 text-xs uppercase tracking-[0.15em] text-black/55 transition hover:text-black"
                        >
                          View
                          artwork
                          <ArrowRight
                            size={
                              13
                            }
                          />
                        </a>
                      </div>
                    </article>
                  ),
                )}
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-6">
            {/* OWNER CONTROLS */}
            {isOwner && (
              <div className="rounded-3xl bg-black p-6 text-white">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/45">
                  <Settings
                    size={14}
                  />
                  Owner controls
                </div>

                <div className="mt-5 space-y-2">
                  <OwnerButton
                    icon={
                      <Edit3
                        size={16}
                      />
                    }
                    label="Edit collection"
                    onClick={
                      openEdit
                    }
                  />

                  <OwnerButton
                    icon={
                      <Plus
                        size={16}
                      />
                    }
                    label="Add artwork"
                    onClick={() =>
                      setShowAddArtwork(
                        true,
                      )
                    }
                  />

                  <OwnerButton
                    icon={
                      <GripVertical
                        size={16}
                      />
                    }
                    label="Reorder artworks"
                    onClick={() =>
                      setShowReorder(
                        true,
                      )
                    }
                  />

                  <OwnerButton
                    icon={
                      <Users
                        size={16}
                      />
                    }
                    label="Manage collaborators"
                    onClick={() =>
                      setShowMembers(
                        true,
                      )
                    }
                  />
                </div>

                <button
                  onClick={
                    handleDelete
                  }
                  className="mt-5 flex w-full items-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm text-red-300 transition hover:bg-white/10"
                >
                  <Trash2
                    size={16}
                  />
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

                  <h3 className="mt-2 font-serif text-2xl">
                    Members
                  </h3>
                </div>

                <button
                  onClick={() =>
                    setShowMembers(
                      true,
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 transition hover:bg-black hover:text-white"
                >
                  <Users
                    size={16}
                  />
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {collection.members.map(
                  (member) => (
                    <div
                      key={
                        member.userId
                      }
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e9e1d3] text-xs font-medium">
                        {member.userId
                          .charAt(
                            0,
                          )
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm">
                          {
                            member.userId
                          }
                        </p>

                        <p className="text-xs capitalize text-black/40">
                          {
                            member.role
                          }
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* STATS */}
            <div className="rounded-3xl border border-black/10 p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                Collection stats
              </p>

              <div className="mt-6 space-y-4">
                <MiniStat
                  label="Artwork count"
                  value={
                    artworkItems.length
                  }
                />

                <MiniStat
                  label="Views"
                  value={
                    collection.stats
                      .views
                  }
                />

                <MiniStat
                  label="Likes"
                  value={
                    collection.stats
                      .likes
                  }
                />

                <MiniStat
                  label="Followers"
                  value={
                    collection.stats
                      .followers
                  }
                />

                <MiniStat
                  label="Saves"
                  value={
                    collection.stats
                      .saves
                  }
                />

                <MiniStat
                  label="Members"
                  value={
                    collection.members
                      .length
                  }
                />
              </div>
            </div>

            {/* ABOUT */}
            <div className="rounded-3xl bg-[#e9e1d3] p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                About
              </p>

              <p className="mt-4 text-sm leading-6 text-black/65">
                Collections are
                spaces for people
                to gather artworks
                around an idea,
                feeling, place,
                artist, or story.
              </p>

              <p className="mt-4 text-xs text-black/40">
                Updated{" "}
                {formatDate(
                  collection.updatedAt,
                )}
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
            setShowAddArtwork(
              false,
            );

            setArtworkSearch("");
          }}
        >
          <div className="space-y-5">
            <input
              value={
                artworkSearch
              }
              onChange={(event) =>
                setArtworkSearch(
                  event.target.value,
                )
              }
              placeholder="Search artworks..."
              className="w-full rounded-xl border border-black/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-black"
            />

            <div className="grid max-h-[55vh] gap-3 overflow-y-auto">
              {filteredAvailableArtworks.length ===
              0 ? (
                <p className="py-8 text-center text-sm text-black/45">
                  No artworks
                  available.
                </p>
              ) : (
                filteredAvailableArtworks.map(
                  (artwork) => (
                    <button
                      key={
                        artwork.id
                      }
                      onClick={() => {
                        handleAddArtwork(
                          artwork.id,
                        );

                        setShowAddArtwork(
                          false,
                        );

                        setArtworkSearch(
                          "",
                        );
                      }}
                      className="flex items-center gap-4 rounded-2xl border border-black/10 p-2 text-left transition hover:bg-black/5"
                    >
                      <img
                        src={
                          artwork.image
                        }
                        alt=""
                        className="h-16 w-16 rounded-xl object-cover"
                      />

                      <div>
                        <p className="font-serif text-lg">
                          {
                            artwork.title
                          }
                        </p>

                        <p className="text-xs text-black/45">
                          {
                            artwork.artist
                          }
                        </p>
                      </div>

                      <Plus
                        size={
                          18
                        }
                        className="ml-auto mr-3"
                      />
                    </button>
                  ),
                )
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* MEMBERS MODAL */}
      {showMembers && (
        <Modal
          title="Manage members"
          onClose={() =>
            setShowMembers(
              false,
            )
          }
        >
          <div className="space-y-7">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                Add collaborator
              </p>

              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  value={
                    memberUserId
                  }
                  onChange={(
                    event,
                  ) =>
                    setMemberUserId(
                      event.target
                        .value,
                    )
                  }
                  placeholder="Username / user ID"
                  className="min-w-0 flex-1 rounded-xl border border-black/15 bg-transparent px-4 py-3 text-sm outline-none"
                />

                <select
                  value={
                    memberRole
                  }
                  onChange={(
                    event,
                  ) =>
                    setMemberRole(
                      event.target
                        .value as
                        | "editor"
                        | "viewer",
                    )
                  }
                  className="rounded-xl border border-black/15 bg-[#f5f1e8] px-4 py-3 text-sm"
                >
                  <option value="viewer">
                    Viewer
                  </option>

                  <option value="editor">
                    Editor
                  </option>
                </select>

                <button
                  onClick={
                    addMember
                  }
                  className="rounded-xl bg-black px-5 py-3 text-sm text-white"
                >
                  <UserPlus
                    size={16}
                    className="inline"
                  />{" "}
                  Add
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                Current members
              </p>

              <div className="mt-3 space-y-2">
                {collection.members.map(
                  (member) => (
                    <div
                      key={
                        member.userId
                      }
                      className="flex items-center gap-3 rounded-2xl border border-black/10 p-3"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e9e1d3] text-sm">
                        {member.userId
                          .charAt(
                            0,
                          )
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {
                            member.userId
                          }
                        </p>

                        <p className="text-xs capitalize text-black/40">
                          {
                            member.role
                          }
                        </p>
                      </div>

                      {member.role !==
                        "owner" &&
                        isOwner && (
                          <button
                            onClick={() =>
                              removeMember(
                                member.userId,
                              )
                            }
                            className="rounded-full p-2 text-black/40 transition hover:bg-black/5 hover:text-red-500"
                          >
                            <X
                              size={
                                16
                              }
                            />
                          </button>
                        )}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* EDIT MODAL */}
      {showEdit && (
        <Modal
          title="Edit collection"
          onClose={() =>
            setShowEdit(
              false,
            )
          }
        >
          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.15em] text-black/40">
                Title
              </span>

              <input
                value={editTitle}
                onChange={(event) =>
                  setEditTitle(
                    event.target
                      .value,
                  )
                }
                className="w-full rounded-xl border border-black/15 bg-transparent px-4 py-3 text-sm outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-[0.15em] text-black/40">
                Description
              </span>

              <textarea
                value={
                  editDescription
                }
                onChange={(event) =>
                  setEditDescription(
                    event.target
                      .value,
                  )
                }
                rows={5}
                className="w-full resize-none rounded-xl border border-black/15 bg-transparent px-4 py-3 text-sm outline-none"
              />
            </label>

            <button
              onClick={
                saveEdit
              }
              className="w-full rounded-xl bg-black px-5 py-3 text-sm text-white"
            >
              Save changes
            </button>
          </div>
        </Modal>
      )}

      {/* REORDER MODAL */}
      {showReorder && (
        <Modal
          title="Reorder artworks"
          onClose={() =>
            setShowReorder(
              false,
            )
          }
        >
          <div className="space-y-2">
            {artworkItems.map(
              (
                artwork,
                index,
              ) => (
                <div
                  key={
                    artwork.id
                  }
                  className="flex items-center gap-3 rounded-2xl border border-black/10 p-2"
                >
                  <GripVertical
                    size={18}
                    className="ml-2 text-black/25"
                  />

                  <img
                    src={
                      artwork.image
                    }
                    alt=""
                    className="h-14 w-14 rounded-xl object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {
                        artwork.title
                      }
                    </p>

                    <p className="text-xs text-black/40">
                      Position{" "}
                      {index +
                        1}
                    </p>
                  </div>

                  <div className="flex gap-1">
                    <button
                      disabled={
                        index ===
                        0
                      }
                      onClick={() =>
                        handleMoveArtwork(
                          index,
                          "up",
                        )
                      }
                      className="rounded-lg border border-black/10 p-2 disabled:opacity-25"
                    >
                      ↑
                    </button>

                    <button
                      disabled={
                        index ===
                        artworkItems.length -
                          1
                      }
                      onClick={() =>
                        handleMoveArtwork(
                          index,
                          "down",
                        )
                      }
                      className="rounded-lg border border-black/10 p-2 disabled:opacity-25"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              ),
            )}
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
  value: number;
  label: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-black/35">
        {icon}

        <span className="text-[10px] uppercase tracking-[0.15em]">
          {label}
        </span>
      </div>

      <p className="mt-1 text-lg font-medium">
        {formatNumber(value)}
      </p>
    </div>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between border-b border-black/10 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-black/50">
        {label}
      </span>

      <span className="font-medium">
        {formatNumber(value)}
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
          <h2 className="font-serif text-2xl">
            {title}
          </h2>

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
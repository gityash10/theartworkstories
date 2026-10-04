import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Bell,
  ChevronDown,
  Eye,
  Link as LinkIcon,
  MapPin,
  Menu,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";

import AccountDropdown from "../components/AccountDropdown";
import AppSidebar from "../components/AppSidebar";
import LikeButton from "../components/LikeButton";

import {
  deleteArtwork,
  getArtwork,
  updateArtwork,
  type Artwork,
} from "../data/firestore/artworks";

import {
  getArtworkViewCount,
  recordArtworkView,
} from "../data/firestore/views";

import { auth } from "../firebase";

import { PLACEHOLDER_IMAGE } from "../data/artworks";

type DetailState =
  | "loading"
  | "found"
  | "not-found"
  | "forbidden"
  | "error"
  | "editing";

/*
 * Artwork detail — hydrates from Firestore via getArtwork(artworkId)
 * where the artworkId comes from the URL (?id=<artworkId>).
 *
 * Visibility: only public artworks render for other users. A
 * private artwork is shown exclusively to its owner; everyone
 * else gets the not-available state. No demo fallback anywhere.
 *
 * Owner controls: Edit and Delete render only when
 * artwork.ownerId matches auth.currentUser.uid — this is a UX
 * layer; the Firestore rules remain the security boundary.
 */

function DetailStateMessage({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/70 p-10 text-center">
      <h2 className="font-display text-2xl text-[#24231f]">{title}</h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-black/55">
        {body}
      </p>

      {children}
    </div>
  );
}

/* ===============================================================
   EDIT FORM
   Mirrors the Share an Artwork form fields and terminology.
   ownerId, createdAt and the document ID are never editable;
   updatedAt is maintained by the Firestore data layer.
   =============================================================== */

type EditableState = {
  title: string;
  artist: string;
  category: string;
  year: string;
  location: string;
  story: string;
  links: string[];
  videos: string[];
  audio: string | null;
  tags: string[];
  visibility: "public" | "private";
  shareType: "own" | "other";
  originalArtist: string;
  source: string;
  imageFileName: string | null;
};

const EDIT_CATEGORIES = [
  "Painting",
  "Photography",
  "Sculpture",
  "Digital Art",
  "Illustration",
  "Architecture",
  "Design",
  "Street Art",
  "Film",
  "Music",
  "Other",
];

function toEditable(value: string | null | undefined): string {
  return value ?? "";
}

function toEditableTags(tags: string[] | undefined): string {
  return (tags ?? []).join(", ");
}

function parseTags(value: string): string[] {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function EditArtworkForm({
  artwork,
  onDone,
  onCancel,
}: {
  artwork: Artwork;
  onDone: (updated: Artwork) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<EditableState>({
    title: artwork.title,
    artist: artwork.artist,
    category: artwork.category,
    year: artwork.year,
    location: artwork.location,
    story: artwork.story,
    links: artwork.links ?? [],
    videos: artwork.videos ?? [],
    audio: artwork.audio ?? null,
    tags: artwork.tags ?? [],
    visibility: artwork.visibility === "private" ? "private" : "public",
    shareType: artwork.shareType === "other" ? "other" : "own",
    originalArtist: artwork.originalArtist ?? "",
    source: artwork.source ?? "",
    imageFileName: artwork.imageFileName ?? null,
  });

  const [tagDraft, setTagDraft] = useState(toEditableTags(artwork.tags));

  const [linkDraft, setLinkDraft] = useState("");

  const [videoDraft, setVideoDraft] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  const [saveError, setSaveError] = useState(false);

  const [imageNote, setImageNote] = useState("");

  const update = <K extends keyof EditableState>(
    key: K,
    value: EditableState[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const addTag = () => {
    const next = parseTags(tagDraft).filter(
      (tag) => !form.tags.includes(tag),
    );

    if (next.length === 0) {
      return;
    }

    update("tags", [...form.tags, ...next]);
    setTagDraft("");
  };

  const addLink = () => {
    const value = linkDraft.trim();

    if (!value || form.links.includes(value)) {
      return;
    }

    update("links", [...form.links, value]);
    setLinkDraft("");
  };

  const addVideo = () => {
    const value = videoDraft.trim();

    if (!value || form.videos.includes(value)) {
      return;
    }

    update("videos", [...form.videos, value]);
    setVideoDraft("");
  };

  const handleImageSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    /*
     * Images are not uploaded anywhere yet (Firebase Storage
     * comes later). Only the file name is kept as metadata;
     * nothing pretends a permanent upload happened.
     */
    update("imageFileName", file.name);
    setImageNote(
      `Image uploads are not connected yet — "${file.name}" is saved as a reference only.`,
    );

    event.target.value = "";
  };

  const handleSave = async () => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    setSaveError(false);

    try {
      await updateArtwork(artwork.id, {
        title: form.title.trim(),
        artist: form.artist.trim(),
        category: form.category,
        year: form.year.trim(),
        location: form.location.trim(),
        story: form.story.trim(),
        links: form.links,
        videos: form.videos,
        audio: form.audio,
        tags: form.tags,
        visibility: form.visibility,
        shareType: form.shareType,
        originalArtist:
          form.shareType === "other" ? form.originalArtist.trim() : null,
        source: form.shareType === "other" ? form.source.trim() : null,
        imageFileName: form.imageFileName,
      });

      const updated: Artwork = {
        ...artwork,
        title: form.title.trim(),
        artist: form.artist.trim(),
        category: form.category,
        year: form.year.trim(),
        location: form.location.trim(),
        story: form.story.trim(),
        links: form.links,
        videos: form.videos,
        tags: form.tags,
        visibility: form.visibility,
        shareType: form.shareType,
        originalArtist:
          form.shareType === "other" ? form.originalArtist.trim() : null,
        source: form.shareType === "other" ? form.source.trim() : null,
        imageFileName: form.imageFileName,
      };

      onDone(updated);
    } catch (error) {
      console.error("Failed to update artwork:", error);

      setSaveError(true);
      setIsSaving(false);
    }
  };

  const fieldClass =
    "mt-2 w-full rounded-xl border border-black/10 bg-white/60 px-4 py-2.5 text-sm outline-none transition placeholder:text-black/35 focus:border-black/25";

  return (
    <div className="mt-10 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-3xl">Edit Artwork</h2>

        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-black/55 transition hover:text-black"
        >
          Cancel editing
        </button>
      </div>

      {/* The artwork */}
      <section className="rounded-2xl border border-black/10 bg-white/70 p-6 sm:p-8">
        <h3 className="font-display text-xl">The artwork</h3>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-medium text-black/55">
              Artwork title
            </span>

            <input
              type="text"
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
              className={fieldClass}
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-black/55">
              Artist / creator
            </span>

            <input
              type="text"
              value={form.artist}
              onChange={(event) => update("artist", event.target.value)}
              className={fieldClass}
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-black/55">
              Category
            </span>

            <select
              value={form.category}
              onChange={(event) => update("category", event.target.value)}
              className={fieldClass}
            >
              <option value="">Select category</option>

              {EDIT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-medium text-black/55">Year</span>

            <input
              type="text"
              value={form.year}
              onChange={(event) => update("year", event.target.value)}
              className={fieldClass}
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="text-xs font-medium text-black/55">
              Where was it created?
            </span>

            <input
              type="text"
              value={form.location}
              onChange={(event) => update("location", event.target.value)}
              className={fieldClass}
            />
          </label>
        </div>

        {/* Image metadata — no upload yet */}
        <div className="mt-5">
          <span className="text-xs font-medium text-black/55">
            Artwork image
          </span>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <label className="inline-flex h-10 cursor-pointer items-center rounded-xl border border-black/10 px-4 text-sm transition hover:bg-black/[0.03]">
              {form.imageFileName ? "Replace image file" : "Select image file"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleImageSelect}
              />
            </label>

            {form.imageFileName && (
              <span className="text-xs text-black/50">
                {form.imageFileName}
              </span>
            )}
          </div>

          {imageNote && (
            <p className="mt-2 text-xs text-black/45">{imageNote}</p>
          )}

          {!imageNote && (
            <p className="mt-2 text-xs text-black/45">
              Image uploads are not connected yet — the file name is saved as
              a reference only.
            </p>
          )}
        </div>
      </section>

      {/* The story */}
      <section className="rounded-2xl border border-black/10 bg-white/70 p-6 sm:p-8">
        <h3 className="font-display text-xl">The story behind it</h3>

        <label className="mt-5 block">
          <span className="text-xs font-medium text-black/55">
            Story behind this artwork
          </span>

          <textarea
            rows={6}
            value={form.story}
            onChange={(event) => update("story", event.target.value)}
            className={`${fieldClass} resize-none leading-6`}
          />
        </label>
      </section>

      {/* Credit for shared work */}
      {form.shareType === "other" && (
        <section className="rounded-2xl border border-black/10 bg-white/70 p-6 sm:p-8">
          <h3 className="font-display text-xl">Original art credit</h3>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-medium text-black/55">
                Original artist
              </span>

              <input
                type="text"
                value={form.originalArtist}
                onChange={(event) =>
                  update("originalArtist", event.target.value)
                }
                className={fieldClass}
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium text-black/55">
                Source link
              </span>

              <input
                type="text"
                value={form.source}
                onChange={(event) => update("source", event.target.value)}
                className={fieldClass}
              />
            </label>
          </div>
        </section>
      )}

      {/* Links, videos, tags */}
      <section className="rounded-2xl border border-black/10 bg-white/70 p-6 sm:p-8">
        <h3 className="font-display text-xl">Links, videos & tags</h3>

        {/* Related links */}
        <div className="mt-5">
          <span className="text-xs font-medium text-black/55">
            Related links
          </span>

          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={linkDraft}
              placeholder="Website, article, portfolio, source..."
              onChange={(event) => setLinkDraft(event.target.value)}
              className={fieldClass}
            />

            <button
              type="button"
              onClick={addLink}
              className="h-[42px] shrink-0 rounded-xl border border-black/10 px-5 text-sm transition hover:bg-black/[0.03]"
            >
              Add link
            </button>
          </div>

          {form.links.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {form.links.map((link) => (
                <li
                  key={link}
                  className="flex items-center justify-between gap-3 text-sm text-black/65"
                >
                  <span className="min-w-0 truncate">{link}</span>

                  <button
                    type="button"
                    onClick={() =>
                      update(
                        "links",
                        form.links.filter((item) => item !== link),
                      )
                    }
                    className="shrink-0 text-xs text-red-600 transition hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Video links */}
        <div className="mt-5">
          <span className="text-xs font-medium text-black/55">
            Video links
          </span>

          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={videoDraft}
              placeholder="YouTube, Vimeo, music video..."
              onChange={(event) => setVideoDraft(event.target.value)}
              className={fieldClass}
            />

            <button
              type="button"
              onClick={addVideo}
              className="h-[42px] shrink-0 rounded-xl border border-black/10 px-5 text-sm transition hover:bg-black/[0.03]"
            >
              Add video
            </button>
          </div>

          {form.videos.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {form.videos.map((video) => (
                <li
                  key={video}
                  className="flex items-center justify-between gap-3 text-sm text-black/65"
                >
                  <span className="min-w-0 truncate">{video}</span>

                  <button
                    type="button"
                    onClick={() =>
                      update(
                        "videos",
                        form.videos.filter((item) => item !== video),
                      )
                    }
                    className="shrink-0 text-xs text-red-600 transition hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Tags */}
        <div className="mt-5">
          <span className="text-xs font-medium text-black/55">
            Tags (comma separated)
          </span>

          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={tagDraft}
              placeholder="e.g. memory, monsoon"
              onChange={(event) => setTagDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addTag();
                }
              }}
              className={fieldClass}
            />

            <button
              type="button"
              onClick={addTag}
              className="h-[42px] shrink-0 rounded-xl border border-black/10 px-5 text-sm transition hover:bg-black/[0.03]"
            >
              Add
            </button>
          </div>

          {form.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {form.tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() =>
                    update(
                      "tags",
                      form.tags.filter((item) => item !== tag),
                    )
                  }
                  className="rounded-full bg-black/[0.05] px-3 py-1.5 text-xs text-black/60 transition hover:bg-black/10"
                  title="Remove tag"
                >
                  #{tag} ×
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Visibility */}
      <section className="rounded-2xl border border-black/10 bg-white/70 p-6 sm:p-8">
        <h3 className="font-display text-xl">Who can see it?</h3>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label
            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
              form.visibility === "public"
                ? "border-black/60 bg-white"
                : "border-black/10 bg-white/50 hover:bg-white"
            }`}
          >
            <input
              type="radio"
              name="edit-visibility"
              checked={form.visibility === "public"}
              onChange={() => update("visibility", "public")}
              className="mt-1"
            />

            <span>
              <span className="block text-sm font-medium">Everyone</span>

              <span className="mt-1 block text-xs text-black/50">
                Anyone in the community can discover it.
              </span>
            </span>
          </label>

          <label
            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
              form.visibility === "private"
                ? "border-black/60 bg-white"
                : "border-black/10 bg-white/50 hover:bg-white"
            }`}
          >
            <input
              type="radio"
              name="edit-visibility"
              checked={form.visibility === "private"}
              onChange={() => update("visibility", "private")}
              className="mt-1"
            />

            <span>
              <span className="block text-sm font-medium">Only me</span>

              <span className="mt-1 block text-xs text-black/50">
                Keep this artwork private for now.
              </span>
            </span>
          </label>
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-[#f4eee2]/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div>
          {saveError && (
            <span className="text-xs text-red-600">
              Save failed — please try again.
            </span>
          )}

          {!saveError && (
            <span className="text-xs text-black/45">
              Changes save to Firestore immediately.
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-11 rounded-xl border border-black/10 px-5 text-sm transition hover:bg-black/[0.03]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="h-11 rounded-xl px-5 text-sm text-white transition hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: "var(--tas-accent, #24231f)" }}
          >
            {isSaving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===============================================================
   DETAIL PAGE
   =============================================================== */

function ArtworkDetail() {
  const [artworkId, setArtworkId] = useState<string | null>(null);

  const [artwork, setArtwork] = useState<Artwork | null>(null);

  const [state, setState] = useState<DetailState>("loading");

  const [isOwner, setIsOwner] = useState(false);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  const [deleteError, setDeleteError] = useState(false);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  /*
   * Firestore-derived view count (artworkViews documents).
   * null → still loading (shown as …), matching the Likes /
   * Follows convention.
   */
  const [viewCount, setViewCount] = useState<number | null>(null);

  /*
   * The Firestore document ID arrives as ?id= in the URL.
   */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    setArtworkId(params.get("id"));
  }, []);

  useEffect(() => {
    if (artworkId === null) {
      return;
    }

    let cancelled = false;

    async function loadArtwork() {
      if (!artworkId) {
        setState("not-found");
        return;
      }

      try {
        const doc = await getArtwork(artworkId);

        if (cancelled) {
          return;
        }

        if (!doc) {
          setState("not-found");
          return;
        }

        /*
         * Owner detection: compare the document owner with the
         * authenticated user. The Firestore rules remain the
         * actual security boundary.
         */
        await auth.authStateReady();

        const uid = auth.currentUser?.uid ?? null;

        if (!cancelled) {
          setIsOwner(uid !== null && doc.ownerId === uid);
        }

        /*
         * Visibility enforcement for the UI path: private
         * artworks are only ever shown to their owner.
         */
        if (doc.visibility === "private" && doc.ownerId !== uid) {
          if (!cancelled) {
            setState("forbidden");
          }

          return;
        }

        if (!cancelled) {
          setArtwork(doc);
          setState("found");
        }
      } catch (error) {
        console.error("Failed to load artwork from Firestore:", error);

        if (!cancelled) {
          setState("error");
        }
      }
    }

    loadArtwork();

    return () => {
      cancelled = true;
    };
  }, [artworkId]);

  /*
   * Views: record exactly one view per page lifecycle once the
   * artwork is actually shown, then load the derived count.
   * The count runs after the record resolves so the displayed
   * number already includes this view. data/firestore/views.ts
   * collapses Strict Mode double-effects onto one document
   * (same deterministic ID + module-level Set), and a refresh
   * starts a new lifecycle — a refresh counts as another view.
   */
  useEffect(() => {
    if (state !== "found" || artwork === null) {
      return;
    }

    const artworkDocId = artwork.id;

    let cancelled = false;

    recordArtworkView(artworkDocId)
      .catch((error) => {
        console.error("Failed to record artwork view:", error);
      })
      .then(() => getArtworkViewCount(artworkDocId))
      .then((count) => {
        if (!cancelled) {
          setViewCount(count);
        }
      })
      .catch((error) => {
        console.error("Failed to load artwork view count:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [state, artwork?.id]);

  const handleDeleted = () => {
    /*
     * The document no longer exists — never stay on a deleted
     * artwork's detail view.
     */
    window.location.href = "/pages/app/discover/index.html";
  };

  const handleDelete = async () => {
    if (isDeleting || !artworkId) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(false);

    try {
      await deleteArtwork(artworkId);

      handleDeleted();
    } catch (error) {
      console.error("Failed to delete artwork:", error);

      setDeleteError(true);
      setIsDeleting(false);
      setConfirmDeleteOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#24231f]">
      {/* MOBILE OVERLAY */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* GLOBAL SIDEBAR */}
      <AppSidebar
        active="discover"
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* MAIN */}
      <main className="min-h-screen lg:pl-[250px]">
        {/* HEADER */}
        <header className="sticky top-0 z-30 border-b border-black/10 bg-[#f7f5f0]/90 px-5 py-4 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="rounded-lg p-2 hover:bg-black/5 lg:hidden"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>

            <div className="relative max-w-xl flex-1">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-black/40" />

              <input
                type="search"
                placeholder="Search artworks, artists, stories..."
                className="w-full rounded-xl border border-black/10 bg-white/60 py-2.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-black/35 focus:border-black/25"
              />
            </div>

            <a
              href="/pages/app/notifications/index.html"
              className="rounded-lg p-2 text-black/65 transition hover:bg-black/5 hover:text-black"
              aria-label="Notifications"
            >
              <Bell className="size-5" />
            </a>

            <AccountDropdown className="hidden sm:flex">
              <span className="flex size-9 items-center justify-center rounded-full bg-[#292723] text-sm text-white">
                Y
              </span>

              <span className="hidden text-sm xl:block">Hi, Yash</span>

              <ChevronDown className="size-4" />
            </AccountDropdown>
          </div>
        </header>

        <article className="mx-auto max-w-[1100px] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
          {/* BACK */}
          <a
            href="/pages/app/discover/index.html"
            className="inline-flex items-center gap-2 text-sm text-black/55 transition hover:text-black"
          >
            <ArrowLeft className="size-4" />
            Back to Discover
          </a>

          {/* =================================================
              LOADING
              ================================================= */}
          {state === "loading" && (
            <div className="mt-12">
              <DetailStateMessage
                title="Loading artwork…"
                body="Fetching the story from the library."
              />
            </div>
          )}

          {/* =================================================
              NOT FOUND
              ================================================= */}
          {state === "not-found" && (
            <div className="mt-12">
              <DetailStateMessage
                title="Artwork not found"
                body="This artwork may have been removed, or the link is incomplete."
              >
                <a
                  href="/pages/app/discover/index.html"
                  className="mt-6 inline-flex h-10 items-center rounded-full bg-[#24231f] px-5 text-sm text-white transition hover:opacity-90"
                >
                  Browse Discover
                </a>
              </DetailStateMessage>
            </div>
          )}

          {/* =================================================
              ACCESS RESTRICTED
              ================================================= */}
          {state === "forbidden" && (
            <div className="mt-12">
              <DetailStateMessage
                title="This artwork isn't available"
                body="The owner has kept it private for now."
              >
                <a
                  href="/pages/app/discover/index.html"
                  className="mt-6 inline-flex h-10 items-center rounded-full bg-[#24231f] px-5 text-sm text-white transition hover:opacity-90"
                >
                  Browse Discover
                </a>
              </DetailStateMessage>
            </div>
          )}

          {/* =================================================
              GENERIC ERROR
              ================================================= */}
          {state === "error" && (
            <div className="mt-12">
              <DetailStateMessage
                title="Something went wrong"
                body="We couldn't load this artwork. Please refresh the page to try again."
              />
            </div>
          )}

          {/* =================================================
              EDIT MODE
              ================================================= */}
          {state === "editing" && artwork && (
            <EditArtworkForm
              artwork={artwork}
              onDone={(updated) => {
                setArtwork(updated);
                setState("found");
              }}
              onCancel={() => setState("found")}
            />
          )}

          {/* =================================================
              FOUND
              ================================================= */}
          {state === "found" && artwork && (
            <>
              {/* OWNER CONTROLS */}
              {isOwner && (
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setState("editing")}
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-5 py-2.5 text-sm transition hover:bg-white"
                  >
                    <Pencil className="size-4" />
                    Edit artwork
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDeleteError(false);
                      setConfirmDeleteOpen(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white/60 px-5 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 className="size-4" />
                    Delete artwork
                  </button>
                </div>
              )}

              {/* DELETE CONFIRMATION */}
              {confirmDeleteOpen && (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50/70 p-6">
                  <h3 className="font-display text-xl text-[#24231f]">
                    Delete this artwork?
                  </h3>

                  <p className="mt-2 max-w-lg text-sm leading-6 text-black/60">
                    “{artwork.title}” and its story will be permanently
                    removed. This cannot be undone.
                  </p>

                  {deleteError && (
                    <p className="mt-3 text-sm text-red-600">
                      Delete failed — please try again.
                    </p>
                  )}

                  <div className="mt-5 flex gap-3">
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="inline-flex h-10 items-center rounded-full bg-red-600 px-5 text-sm text-white transition hover:bg-red-700 disabled:opacity-60"
                    >
                      {isDeleting ? "Deleting…" : "Yes, delete artwork"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setConfirmDeleteOpen(false)}
                      disabled={isDeleting}
                      className="inline-flex h-10 items-center rounded-full border border-black/10 bg-white px-5 text-sm transition hover:bg-black/[0.03] disabled:opacity-60"
                    >
                      Keep artwork
                    </button>
                  </div>
                </div>
              )}

              {/* CATEGORY + SHARE TYPE */}
              <div className="mt-12">
                <p className="text-xs uppercase tracking-[0.25em] text-black/40">
                  {artwork.shareType === "other"
                    ? "Shared artwork"
                    : "Artwork"}
                  {artwork.visibility === "private" ? " · Private" : ""}
                </p>

                <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[0.95] sm:text-6xl">
                  {artwork.title}
                </h1>

                <p className="mt-5 text-lg text-black/70">
                  by {artwork.artist}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-black/45">
                  {artwork.category && <span>{artwork.category}</span>}

                  {artwork.year && (
                    <>
                      <span>•</span>
                      <span>{artwork.year}</span>
                    </>
                  )}

                  {artwork.location && (
                    <>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-3.5" />
                        {artwork.location}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* HERO IMAGE */}
              <div className="mt-10 overflow-hidden rounded-[2rem] bg-black/5">
                <img
                  src={artwork.imageUrl || PLACEHOLDER_IMAGE}
                  alt={artwork.title}
                  className="aspect-[16/9] h-full w-full object-cover"
                />
              </div>

              {/* ACTIONS — the standard like pill (same pattern as
                  Story of the Week); state lives in Firestore. */}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <LikeButton targetType="artwork" targetId={artwork.id} />

                {/* VIEWS — derived from artworkViews documents; …
                    while the count is loading. */}
                <span
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/50 px-4 py-2.5 text-sm text-black/65"
                  title="Views"
                >
                  <Eye className="size-4" />

                  <span>{viewCount === null ? "…" : viewCount}</span>

                  <span className="text-black/45">Views</span>
                </span>
              </div>

              {/* STORY */}
              <div className="mt-10 max-w-3xl">
                <p className="text-xs uppercase tracking-[0.25em] text-black/40">
                  The story behind it
                </p>

                <p className="mt-5 whitespace-pre-line text-base leading-8 text-black/70">
                  {artwork.story || "No story was added to this artwork."}
                </p>

                {/* CREDIT FOR SHARED WORK */}
                {artwork.shareType === "other" && artwork.originalArtist && (
                  <p className="mt-6 text-sm text-black/55">
                    Original artist:{" "}
                    <span className="font-medium text-[#24231f]">
                      {artwork.originalArtist}
                    </span>
                    {artwork.source && (
                      <>
                        {" · "}
                        <a
                          href={artwork.source}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="underline underline-offset-4 transition hover:text-black"
                        >
                          source
                        </a>
                      </>
                    )}
                  </p>
                )}
              </div>

              {/* TAGS */}
              {artwork.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {artwork.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-black/[0.05] px-4 py-1.5 text-xs text-black/60"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* LINKS */}
              {artwork.links.length > 0 && (
                <div className="mt-8 max-w-3xl">
                  <p className="text-xs uppercase tracking-[0.25em] text-black/40">
                    Related links
                  </p>

                  <ul className="mt-4 space-y-2">
                    {artwork.links.map((link) => (
                      <li key={link}>
                        <a
                          href={link}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-2 text-sm text-black/65 underline underline-offset-4 transition hover:text-black"
                        >
                          <LinkIcon className="size-3.5 shrink-0" />
                          <span className="min-w-0 truncate">{link}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* VIDEOS */}
              {artwork.videos.length > 0 && (
                <div className="mt-8 max-w-3xl">
                  <p className="text-xs uppercase tracking-[0.25em] text-black/40">
                    Videos
                  </p>

                  <ul className="mt-4 space-y-2">
                    {artwork.videos.map((video) => (
                      <li key={video}>
                        <a
                          href={video}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-2 text-sm text-black/65 underline underline-offset-4 transition hover:text-black"
                        >
                          <LinkIcon className="size-3.5 shrink-0" />
                          <span className="min-w-0 truncate">{video}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* AUDIO METADATA */}
              {artwork.audio && (
                <div className="mt-8 max-w-3xl">
                  <p className="text-xs uppercase tracking-[0.25em] text-black/40">
                    Audio
                  </p>

                  <p className="mt-3 text-sm text-black/55">
                    {artwork.audio} (file upload arrives with a later update)
                  </p>
                </div>
              )}
            </>
          )}
        </article>
      </main>
    </div>
  );
}

export default ArtworkDetail;

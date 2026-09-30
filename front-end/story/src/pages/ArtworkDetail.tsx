import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Bell,
  ChevronDown,
  Link as LinkIcon,
  MapPin,
  Menu,
  Search,
} from "lucide-react";

import AccountDropdown from "../components/AccountDropdown";
import AppSidebar from "../components/AppSidebar";

import { getArtwork, type Artwork } from "../data/firestore/artworks";

import { auth } from "../firebase";

import { PLACEHOLDER_IMAGE } from "../data/artworks";

type DetailState =
  | "loading"
  | "found"
  | "not-found"
  | "forbidden"
  | "error";

/*
 * Artwork detail — hydrates from Firestore via getArtwork(artworkId)
 * where the artworkId comes from the URL (?id=<artworkId>).
 *
 * Visibility: only public artworks render for other users. A
 * private artwork is shown exclusively to its owner; everyone
 * else gets the not-available state. No demo fallback anywhere.
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

function ArtworkDetail() {
  const [artworkId, setArtworkId] = useState<string | null>(null);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [artwork, setArtwork] = useState<Artwork | null>(null);

  const [state, setState] = useState<DetailState>("loading");

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
         * Visibility enforcement for the UI path: private
         * artworks are only ever shown to their owner.
         */
        if (doc.visibility === "private") {
          try {
            await auth.authStateReady();

            const uid = auth.currentUser?.uid;

            if (doc.ownerId !== uid) {
              setState("forbidden");
              return;
            }
          } catch {
            setState("forbidden");
            return;
          }
        }

        setArtwork(doc);
        setState("found");
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
              FOUND
              ================================================= */}
          {state === "found" && artwork && (
            <>
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

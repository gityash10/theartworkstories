import {
  Bell,
  Bookmark,
  ChevronDown,
  Compass,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Settings,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import AccountDropdown from "../components/AccountDropdown";

import { listArtworks, type Artwork } from "../data/firestore/artworks";

import LikeButton from "../components/LikeButton";

const categories = [
  "All",
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
];

const fallbackImage = "/assets/images/story/story-mosaic.jpg";

/*
 * Discover feed card model — hydrated from Firestore via
 * listArtworks() (public artworks only). Demo artwork arrays
 * elsewhere on this page are presentation-only and are never
 * mixed into these results.
 */
type FeedCard = {
  id: string;
  title: string;
  artist: string;
  category: string;
  image: string;
  description: string;
};

const STORY_PREVIEW_LENGTH = 160;

function toFeedCard(artwork: Artwork): FeedCard {
  const story = artwork.story ?? "";

  return {
    id: artwork.id,
    title: artwork.title,
    artist: artwork.artist,
    category: artwork.category,
    /*
     * Images are not uploaded anywhere yet (imageUrl stays
     * empty until Firebase Storage) — cards fall back to the
     * page's existing placeholder image, the same one the old
     * onError handler used.
     */
    image: artwork.imageUrl || fallbackImage,
    description:
      story.length > STORY_PREVIEW_LENGTH
        ? `${story.slice(0, STORY_PREVIEW_LENGTH).trimEnd()}…`
        : story,
  };
}

const recentArtworks = [
  {
    title: "Flowers After Rain",
    artist: "Maya Kapoor",
    image: "/assets/images/artworks/flowers.jpg",
  },
  {
    title: "The Old Building",
    artist: "Kabir Singh",
    image: "/assets/images/artworks/building.jpg",
  },
  {
    title: "Fragments of Memory",
    artist: "Anaya Shah",
    image: "/assets/images/artworks/fragments.jpg",
  },
  {
    title: "The Clay Vessel",
    artist: "Arjun Rao",
    image: "/assets/images/artworks/vessel.jpg",
  },
  {
    title: "Between Mountains",
    artist: "Sara Khan",
    image: "/assets/images/artworks/mountains.jpg",
  },
];

const storyOfTheWeek = {
  title: "Flowers After Rain",
  creator: "Maya Kapoor",
  image: "/assets/images/artworks/flowers.jpg",
  likes: "2.4K",
  discussions: "86",
  description:
    "A quiet story about finding beauty after everything feels washed away.",
};

const moods = [
  "Peaceful",
  "Melancholy",
  "Joyful",
  "Bold",
  "Nostalgic",
  "Mysterious",
  "Hopeful",
  "Dramatic",
];

const places = [
  "Asia",
  "Europe",
  "North America",
  "South America",
  "Africa",
  "Oceania",
];

function Discover() {
  const [activeCategory, setActiveCategory] = useState("All");

  const [feedArtworks, setFeedArtworks] = useState<FeedCard[]>([]);

  const [feedState, setFeedState] = useState<
    "loading" | "ready" | "error"
  >("loading");

  const [menuOpen, setMenuOpen] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [shareQuestionOpen, setShareQuestionOpen] = useState(false);

  const openShareQuestion = () => {
    setShareQuestionOpen(true);
  };

  const closeShareQuestion = () => {
    setShareQuestionOpen(false);
  };

  /*
   * Load the public artwork feed from Firestore. On failure the
   * page shows an error state instead of silently falling back
   * to demo data.
   */
  useEffect(() => {
    let cancelled = false;

    async function loadFeed() {
      try {
        const publicArtworks = await listArtworks({
          visibility: "public",
        });

        if (cancelled) {
          return;
        }

        setFeedArtworks(publicArtworks.map(toFeedCard));
        setFeedState("ready");
      } catch (error) {
        console.error("Failed to load artworks from Firestore:", error);

        if (!cancelled) {
          setFeedState("error");
        }
      }
    }

    loadFeed();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * Category chips filter the Firestore feed client-side.
   */
  const visibleArtworks =
    activeCategory === "All"
      ? feedArtworks
      : feedArtworks.filter(
          (artwork) => artwork.category === activeCategory,
        );

  const continueToCreate = (type: "own" | "other") => {
    window.location.href = `../create/index.html?type=${type}`;
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;

    if (image.dataset.fallbackApplied === "true") {
      return;
    }

    image.dataset.fallbackApplied = "true";
    image.src = fallbackImage;
  };

  return (
    <div className="min-h-screen bg-[#f4eee2] text-[#211f1b]">
      {/* =====================================================
          DESKTOP SIDEBAR
          ===================================================== */}

      <aside
        className={`fixed left-0 top-0 z-50 hidden h-screen flex-col bg-[#1d1c19] text-[#f5efe4] transition-all duration-300 lg:flex ${
          sidebarOpen ? "w-[220px]" : "w-[72px]"
        }`}
      >
        {/* LOGO */}

        <div
          className={`border-b border-white/10 py-7 transition-all ${
            sidebarOpen ? "px-7" : "px-3"
          }`}
        >
          <a
            href="../../home/index.html"
            className={`block font-display leading-[0.95] ${
              sidebarOpen ? "text-[24px]" : "text-center text-[18px]"
            }`}
          >
            {sidebarOpen ? (
              <>
                The ArtWork
                <br />
                Stories
              </>
            ) : (
              "TAS"
            )}
          </a>
        </div>

        {/* SIDEBAR TOGGLE */}

        <button
          type="button"
          onClick={() => setSidebarOpen((value) => !value)}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          className={`absolute -right-3 top-[78px] flex size-7 items-center justify-center rounded-full border border-white/10 bg-[#24231f] text-white shadow-lg transition hover:scale-105 ${
            sidebarOpen ? "" : "rotate-180"
          }`}
        >
          {sidebarOpen ? (
            <PanelLeftClose className="size-3.5" />
          ) : (
            <PanelLeftOpen className="size-3.5" />
          )}
        </button>

        {/* NAVIGATION */}

        <nav className="mt-8 flex flex-col gap-2 px-3">
          <a
            href="../discover/index.html"
            title="Discover"
            className={`flex items-center rounded-md bg-white/10 py-3 text-sm ${
              sidebarOpen ? "gap-4 px-5" : "justify-center px-0"
            }`}
          >
            <Compass className="size-5 shrink-0" />

            {sidebarOpen && <span>Discover</span>}
          </a>

          <a
            href="../collections/index.html"
            title="Collections"
            className={`flex items-center rounded-md py-3 text-sm text-white/70 transition hover:bg-white/5 hover:text-white ${
              sidebarOpen ? "gap-4 px-5" : "justify-center px-0"
            }`}
          >
            <Bookmark className="size-5 shrink-0" />

            {sidebarOpen && <span>Collections</span>}
          </a>

          <div className="my-2 h-px bg-white/10" />

          <button
            type="button"
            onClick={openShareQuestion}
            title="Share an Artwork"
            className={`flex w-full items-center rounded-md py-3 text-left text-sm text-white/70 transition hover:bg-white/5 hover:text-white ${
              sidebarOpen ? "gap-4 px-5" : "justify-center px-0"
            }`}
          >
            <Plus className="size-5 shrink-0" />

            {sidebarOpen && <span>Share an Artwork</span>}
          </button>

          <div className="my-2 h-px bg-white/10" />

          <a
            href="../profile/index.html"
            title="Profile"
            className={`flex items-center rounded-md py-3 text-sm text-white/70 transition hover:bg-white/5 hover:text-white ${
              sidebarOpen ? "gap-4 px-5" : "justify-center px-0"
            }`}
          >
            <User className="size-5 shrink-0" />

            {sidebarOpen && <span>Profile</span>}
          </a>

          <a
            href="../settings/account/index.html"
            title="Settings"
            className={`flex items-center rounded-md py-3 text-sm text-white/70 transition hover:bg-white/5 hover:text-white ${
              sidebarOpen ? "gap-4 px-5" : "justify-center px-0"
            }`}
          >
            <Settings className="size-5 shrink-0" />

            {sidebarOpen && <span>Settings</span>}
          </a>
        </nav>

        {/* SIDEBAR QUOTE */}

        {sidebarOpen && (
          <div className="mt-auto px-7 pb-8">
            <div className="mb-5 h-px bg-white/10" />

            <p className="font-display text-sm leading-6 text-white/55">
              “Art is a conversation
              <br />
              across time.”
            </p>

            <div className="mt-5 h-px w-8 bg-white/40" />
          </div>
        )}
      </aside>

      {/* =====================================================
          MOBILE HEADER
          ===================================================== */}

      <header className="relative flex h-16 items-center justify-between border-b border-black/10 bg-[#f4eee2] px-5 lg:hidden">
        <a
          href="../../home/index.html"
          className="font-display text-xl leading-none"
        >
          The ArtWork Stories
        </a>

        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          className="rounded-full p-2"
          aria-label="Open menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        {menuOpen && (
          <div className="absolute right-5 top-14 z-50 w-56 overflow-hidden rounded-xl border border-black/10 bg-[#24231f] p-2 text-white shadow-xl">
            <a
              href="../discover/index.html"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-white/10"
              onClick={() => setMenuOpen(false)}
            >
              <Compass className="size-4" />
              Discover
            </a>

            <a
              href="../collections/index.html"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-white/10"
              onClick={() => setMenuOpen(false)}
            >
              <Bookmark className="size-4" />
              Collections
            </a>

            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                openShareQuestion();
              }}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm hover:bg-white/10"
            >
              <Plus className="size-4" />
              Share an Artwork
            </button>

            <a
              href="../profile/index.html"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-white/10"
              onClick={() => setMenuOpen(false)}
            >
              <User className="size-4" />
              Profile
            </a>

            <a
              href="../settings/account/index.html"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-white/10"
              onClick={() => setMenuOpen(false)}
            >
              <Settings className="size-4" />
              Settings
            </a>
          </div>
        )}
      </header>

      {/* =====================================================
          MAIN
          ===================================================== */}

      <main
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-[220px]" : "lg:ml-[72px]"
        }`}
      >
        {/* =================================================
            TOP BAR
            ================================================= */}

        <div className="sticky top-0 z-30 flex h-[78px] items-center justify-between border-b border-black/5 bg-[#f4eee2]/95 px-5 backdrop-blur-md sm:px-8 lg:px-10">
          <div className="relative w-full max-w-[800px]">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-black/45" />

            <input
              type="search"
              placeholder="Search artworks, artists, styles, or anything..."
              className="h-11 w-full rounded-xl border border-black/5 bg-black/[0.035] pl-12 pr-5 text-sm outline-none transition placeholder:text-black/40 focus:border-black/20 focus:bg-white/60"
            />
          </div>

          <div className="ml-5 hidden items-center gap-6 sm:flex">
            <a
              href="/pages/app/notifications/index.html"
              className="text-black/65 transition hover:text-black"
              aria-label="Notifications"
            >
              <Bell className="size-5" />
            </a>

            <AccountDropdown>
              <span className="flex size-9 items-center justify-center rounded-full bg-[#292723] text-sm text-white">
                Y
              </span>

              <span className="hidden text-sm xl:block">Hi, Yash</span>

              <ChevronDown className="size-4" />
            </AccountDropdown>
          </div>
        </div>

        {/* =================================================
            PAGE CONTENT
            ================================================= */}

        <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10">
          {/* =================================================
              HERO
              ================================================= */}

          <section className="relative min-h-[280px] overflow-hidden rounded-2xl bg-[#e8ddca]">
            <div className="relative z-10 max-w-[620px] px-7 py-10 sm:px-10 sm:py-12">
              <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-black/55">
                Discover
              </p>

              <h1 className="mt-4 font-display text-[clamp(3.2rem,6vw,6rem)] leading-[0.86]">
                Art lives
                <br />
                in stories.
              </h1>

              <p className="mt-6 max-w-[520px] font-sans text-sm leading-6 text-black/60">
                Explore artworks, their creators, and the stories behind them.
              </p>
            </div>

            <div className="absolute right-0 top-0 hidden h-full w-[48%] overflow-hidden lg:block">
              <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#e8ddca] via-transparent to-transparent" />

              <img
                src="/assets/images/story/story-mosaic.jpg"
                alt=""
                className="h-full w-full object-cover"
              />

              <div className="absolute right-8 top-8 z-20 font-display text-3xl italic text-white/90">
                More Art.
                <br />
                Deeper Stories.
              </div>
            </div>
          </section>

          {/* =================================================
              CATEGORIES
              ================================================= */}

          <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap rounded-full px-5 py-2 text-xs transition ${
                  activeCategory === category
                    ? "bg-[#24231f] text-white"
                    : "bg-black/[0.035] text-black/65 hover:bg-black/[0.08]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* =================================================
              MAIN CONTENT + SIDEBAR
              ================================================= */}

          <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px]">
            {/* =================================================
                LEFT CONTENT
                ================================================= */}

            <div className="min-w-0">
              {/* =================================================
                  TRENDING STORIES
                  ================================================= */}

              <section>
                <div className="mb-5 flex items-end justify-between">
                  <div>
                    <h2 className="font-display text-3xl">Trending Stories</h2>

                    <p className="mt-1 text-sm text-black/50">
                      Artworks the community is talking about right now.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="hidden text-sm text-black/60 transition hover:text-black sm:block"
                  >
                    See all →
                  </button>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {feedState === "loading" && (
                    <div className="col-span-full rounded-2xl border border-black/5 bg-white/50 p-10 text-center text-sm text-black/50">
                      Loading artworks…
                    </div>
                  )}

                  {feedState === "error" && (
                    <div className="col-span-full rounded-2xl border border-black/5 bg-white/50 p-10 text-center text-sm text-black/50">
                      We couldn't load artworks right now. Please refresh the
                      page to try again.
                    </div>
                  )}

                  {feedState === "ready" && visibleArtworks.length === 0 && (
                    <div className="col-span-full rounded-2xl border border-black/5 bg-white/50 p-10 text-center text-sm text-black/50">
                      {activeCategory === "All"
                        ? "No artworks have been shared yet. Be the first to share one."
                        : `No ${activeCategory} artworks have been shared yet.`}
                    </div>
                  )}

                  {feedState === "ready" &&
                    visibleArtworks.map((artwork) => (
                    <a
                      key={artwork.id}
                      href={`/pages/app/artwork/index.html?id=${artwork.id}`}
                      className="group cursor-pointer"
                    >
                      <div className="relative aspect-[0.9] overflow-hidden rounded-xl bg-black/10">
                        <img
                          src={artwork.image}
                          alt={artwork.title}
                          onError={handleImageError}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />

                        <LikeButton
                          variant="badge"
                          targetType="artwork"
                          targetId={artwork.id}
                          showCount
                        />
                      </div>

                      <h3 className="mt-3 text-sm font-medium">
                        {artwork.title}
                      </h3>

                      <p className="text-xs text-black/50">
                        {artwork.artist}
                      </p>

                      {artwork.category && (
                        <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-black/35">
                          {artwork.category}
                        </p>
                      )}

                      <p className="mt-3 text-xs leading-5 text-black/60">
                        {artwork.description}
                      </p>

                      <p className="mt-1 text-xs">Read the story →</p>
                    </a>
                  ))}
                </div>
              </section>

              {/* =================================================
                  RECENTLY SHARED
                  ================================================= */}

              <section className="mt-14">
                <div className="mb-5 flex items-end justify-between">
                  <div>
                    <h2 className="font-display text-3xl">Recently Shared</h2>

                    <p className="mt-1 text-sm text-black/50">
                      Fresh artworks and stories from the community.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="hidden text-sm text-black/60 transition hover:text-black sm:block"
                  >
                    See all →
                  </button>
                </div>

                {/* ARTWORK GRID */}

                <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                  {recentArtworks.map((artwork, index) => (
                    <article
                      key={artwork.title}
                      className="group cursor-pointer"
                    >
                      <div className="relative aspect-square overflow-visible">
                        <div className="h-full w-full overflow-hidden rounded-xl bg-black/10">
                          <img
                            src={artwork.image}
                            alt={artwork.title}
                            onError={handleImageError}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                          />
                        </div>
                      </div>

                      <h3 className="mt-3 text-sm font-medium">
                        {artwork.title}
                      </h3>

                      <p className="mt-1 text-xs text-black/50">
                        {artwork.artist}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              {/* =================================================
                  COMMUNITY COLLECTIONS
                  FIXES THE EMPTY-SPACE PROBLEM
                  ================================================= */}

              <section className="mt-16">
                <div className="mb-5 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-black/40">
                      Curated by the community
                    </p>

                    <h2 className="mt-2 font-display text-3xl">
                      Collections worth wandering into.
                    </h2>
                  </div>

                  <button
                    type="button"
                    className="hidden text-sm text-black/60 transition hover:text-black sm:block"
                  >
                    Explore all →
                  </button>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* COLLECTION ONE */}

                  <article className="group relative min-h-[270px] overflow-hidden rounded-2xl bg-[#d8c8ae]">
                    <img
                      src="/assets/images/story/story-mosaic.jpg"
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                    <div className="relative z-10 flex min-h-[270px] flex-col justify-end p-6 text-white">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">
                        24 artworks
                      </p>

                      <h3 className="mt-2 font-display text-3xl">
                        Art that remembers.
                      </h3>

                      <p className="mt-2 max-w-[360px] text-xs leading-5 text-white/70">
                        Works about memory, places, people and the things we
                        carry with us.
                      </p>
                    </div>
                  </article>

                  {/* COLLECTION TWO */}

                  <article className="group relative min-h-[270px] overflow-hidden rounded-2xl bg-[#d8c8ae]">
                    <img
                      src="/assets/images/story/journey-collage.jpg"
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                    <div className="relative z-10 flex min-h-[270px] flex-col justify-end p-6 text-white">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">
                        18 artworks
                      </p>

                      <h3 className="mt-2 font-display text-3xl">
                        Made along the way.
                      </h3>

                      <p className="mt-2 max-w-[360px] text-xs leading-5 text-white/70">
                        Art created during journeys, transitions and unexpected
                        moments.
                      </p>
                    </div>
                  </article>
                </div>
              </section>

              {/* =================================================
                  COMMUNITY NOTE
                  ================================================= */}

              <section className="mt-16">
                <div className="rounded-2xl bg-[#e8ddca] px-7 py-10 sm:px-10">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-black/40">
                    A note from the community
                  </p>

                  <div className="mt-5 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
                    <div>
                      <h2 className="max-w-[700px] font-display text-[clamp(2.2rem,4vw,4rem)] leading-[0.95]">
                        “Sometimes the story behind the artwork is the artwork.”
                      </h2>

                      <p className="mt-5 max-w-[540px] text-sm leading-6 text-black/55">
                        Share what you made, why you made it, and the moment
                        that made it matter.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={openShareQuestion}
                      className="flex w-fit items-center gap-3 rounded-full bg-[#24231f] px-6 py-3 text-sm text-white transition hover:bg-black"
                    >
                      Share your artwork
                      <Plus className="size-4" />
                    </button>
                  </div>
                </div>
              </section>

              {/* =================================================
                  MORE TO EXPLORE
                  ================================================= */}

              <section className="mt-16">
                <div className="mb-5">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-black/40">
                    Keep exploring
                  </p>

                  <h2 className="mt-2 font-display text-3xl">
                    There is more to discover.
                  </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <a
                    href="/pages/app/artists/index.html"
                    className="rounded-2xl border border-black/10 bg-white/30 p-6 text-left transition hover:-translate-y-1 hover:bg-white/50"
                  >
                    <span className="text-2xl">○</span>

                    <h3 className="mt-6 font-display text-2xl">
                      Find an artist
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-black/50">
                      Discover artists, their work and the stories behind what
                      they create.
                    </p>

                    <span className="mt-5 block text-xs">
                      Meet the artists →
                    </span>
                  </a>

                  <a
                    href="/pages/app/stories/index.html"
                    className="rounded-2xl border border-black/10 bg-white/30 p-6 text-left transition hover:-translate-y-1 hover:bg-white/50"
                  >
                    <span className="text-2xl">○</span>

                    <h3 className="mt-6 font-display text-2xl">
                      Browse Stories
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-black/50">
                      Read the stories that live behind the art.
                    </p>

                    <span className="mt-5 block text-xs">
                      Read the stories →
                    </span>
                  </a>

                  <button
                    type="button"
                    onClick={openShareQuestion}
                    className="rounded-2xl border border-black/10 bg-white/30 p-6 text-left transition hover:-translate-y-1 hover:bg-white/50"
                  >
                    <span className="text-2xl">+</span>

                    <h3 className="mt-6 font-display text-2xl">
                      Share your art
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-black/50">
                      Give your artwork a place and its story a voice.
                    </p>

                    <span className="mt-5 block text-xs">
                      Share an artwork →
                    </span>
                  </button>
                </div>
              </section>

              <div className="h-20" />
            </div>

            {/* =================================================
                RIGHT SIDEBAR
                ================================================= */}

            <aside className="hidden space-y-5 xl:block">
              {/* GENTLER INTERNET */}

              <div className="rounded-2xl bg-[#e8ddca] p-6">
                <div className="text-2xl">☼</div>

                <h3 className="mt-3 font-display text-2xl leading-tight">
                  A gentler internet
                  <br />
                  for art lovers.
                </h3>

                <p className="mt-4 text-sm leading-6 text-black/60">
                  Discover. Share. Save. Learn. Be part of a community that
                  cares about art and its stories.
                </p>

                <a
                  href="/pages/app/explore/index.html"
                  className="mt-5 block w-full rounded-lg bg-[#24231f] px-5 py-3 text-center text-sm text-white transition hover:bg-black"
                >
                  Start exploring →
                </a>
              </div>

              {/* EXPLORE BY MOOD */}

              <div>
                <h3 className="font-display text-2xl">Explore by Mood</h3>

                <div className="mt-4 flex flex-wrap gap-2">
                  {moods.map((mood) => (
                    <button
                      key={mood}
                      type="button"
                      className="rounded-full bg-black/[0.045] px-3 py-2 text-xs text-black/65 hover:bg-black/[0.09]"
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>

              {/* FROM AROUND THE WORLD */}

              <div>
                <h3 className="font-display text-2xl">From Around the World</h3>

                <div className="mt-4 flex flex-wrap gap-2">
                  {places.map((place) => (
                    <button
                      key={place}
                      type="button"
                      className="rounded-full bg-black/[0.045] px-3 py-2 text-xs text-black/65 hover:bg-black/[0.09]"
                    >
                      {place}
                    </button>
                  ))}
                </div>
              </div>

              {/* STORY OF THE WEEK */}

              <div className="overflow-hidden rounded-2xl bg-[#24231f] text-white">
                <div className="px-6 pt-6">
                  <p className="font-sans text-[10px] uppercase tracking-[0.24em] text-white/50">
                    Story of the Week
                  </p>

                  <p className="mt-2 font-display text-xl">By the Community</p>
                </div>

                <div className="mx-5 mt-5 overflow-hidden rounded-xl">
                  <img
                    src={storyOfTheWeek.image}
                    alt={storyOfTheWeek.title}
                    onError={handleImageError}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>

                <div className="px-6 py-6">
                  <h3 className="font-display text-2xl leading-tight">
                    {storyOfTheWeek.title}
                  </h3>

                  <p className="mt-1 text-xs text-white/50">
                    by {storyOfTheWeek.creator}
                  </p>

                  <p className="mt-4 text-xs leading-5 text-white/65">
                    {storyOfTheWeek.description}
                  </p>

                  <div className="mt-5 flex items-center gap-4 text-[11px] text-white/50">
                    <span>♡ {storyOfTheWeek.likes}</span>

                    <span>·</span>

                    <span>{storyOfTheWeek.discussions} discussions</span>
                  </div>

                  <a
                    href="/pages/app/story-of-week/index.html"
                    className="inline-block text-xs transition hover:text-black/60"
                  >
                    Read the story →
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* =====================================================
          MOBILE FLOATING SHARE
          ===================================================== */}

      <button
        type="button"
        onClick={openShareQuestion}
        className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-[#24231f] text-white shadow-xl lg:hidden"
        aria-label="Share an artwork"
      >
        <Plus className="size-6" />
      </button>

      {/* =====================================================
          SHARE TYPE QUESTION MODAL
          ===================================================== */}

      {shareQuestionOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-5 backdrop-blur-sm"
          onClick={closeShareQuestion}
        >
          <div
            className="relative w-full max-w-[520px] rounded-3xl bg-[#f4eee2] p-7 shadow-2xl sm:p-9"
            onClick={(event) => event.stopPropagation()}
          >
            {/* CLOSE */}

            <button
              type="button"
              onClick={closeShareQuestion}
              aria-label="Close"
              className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-full bg-black/[0.05] transition hover:bg-black/[0.1]"
            >
              <X className="size-4" />
            </button>

            {/* QUESTION */}

            <p className="text-[10px] uppercase tracking-[0.25em] text-black/40">
              Before you share
            </p>

            <h2 className="mt-4 max-w-[430px] font-display text-[clamp(2rem,5vw,3.2rem)] leading-[0.95]">
              Whose artwork
              <br />
              are you sharing?
            </h2>

            <p className="mt-5 max-w-[430px] text-sm leading-6 text-black/55">
              This helps us show the right information and give proper context
              to every artwork shared on The ArtWork Stories.
            </p>

            {/* OPTIONS */}

            <div className="mt-8 grid gap-3">
              <button
                type="button"
                onClick={() => continueToCreate("own")}
                className="group rounded-2xl border border-black/10 bg-white/40 p-5 text-left transition hover:-translate-y-0.5 hover:border-black/20 hover:bg-white/70"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-2xl">
                      I created this artwork
                    </p>

                    <p className="mt-2 text-xs leading-5 text-black/50">
                      Share your own work and tell the story behind what you
                      created.
                    </p>
                  </div>

                  <span className="text-xl transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => continueToCreate("other")}
                className="group rounded-2xl border border-black/10 bg-white/40 p-5 text-left transition hover:-translate-y-0.5 hover:border-black/20 hover:bg-white/70"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-2xl">
                      I’m sharing someone else’s artwork
                    </p>

                    <p className="mt-2 text-xs leading-5 text-black/50">
                      Give credit, add the source, and share the story or
                      context behind the work.
                    </p>
                  </div>

                  <span className="text-xl transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </button>
            </div>

            <p className="mt-6 text-center text-[11px] text-black/35">
              You can always change your mind before publishing.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Discover;

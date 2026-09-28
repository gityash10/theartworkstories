import {
  ArrowRight,
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
import { useState } from "react";

import AccountDropdown from "../components/AccountDropdown";

const categories = [
  "All",
  "Community",
  "Staff Picks",
  "Artists",
  "Themes",
  "Places",
  "Mediums",
  "Time Periods",
  "More",
];

const featuredCollections = [
  {
    id: "mountains-quiet-places",
    title: "Mountains and Quiet Places",
    description:
      "Artworks inspired by mountains, nature and the stillness they bring.",
    tag: "Staff Pick",
    count: 24,
    image: "/assets/images/artworks/starry-night.png",
    avatars: ["M", "A", "Y"],
    extra: 12,
  },
  {
    id: "faces-feelings",
    title: "Faces & Feelings",
    description:
      "Portraits that capture the human emotion in its many forms.",
    tag: "Community",
    count: 38,
    image: "/assets/images/artworks/sunflower-field.png",
    avatars: ["A", "R", "S"],
    extra: 28,
  },
  {
    id: "everyday-life",
    title: "Everyday Life",
    description: "Ordinary moments, extraordinary stories.",
    tag: "Theme",
    count: 31,
    image: "/assets/images/artworks/sample1-bg.png",
    avatars: ["D", "L", "T"],
    extra: 19,
  },
];

const trendingCollections = [
  {
    id: "dreamlike-worlds",
    title: "Dreamlike Worlds",
    description: "Surreal, imaginative and otherworldly artworks.",
    count: 42,
    image: "/assets/images/artworks/starry-night.png",
  },
  {
    id: "architecture-space",
    title: "Architecture & Space",
    description: "Buildings, spaces and the stories they hold.",
    count: 36,
    image: "/assets/images/artworks/sample1-bg.png",
  },
  {
    id: "sea-everything-it-holds",
    title: "The Sea and Everything It Holds",
    description: "Oceans, rivers and the mysteries of water.",
    count: 28,
    image: "/assets/images/artworks/cafe-terrace.jpg",
  },
  {
    id: "flowers-art",
    title: "Flowers in Art",
    description: "From delicate studies to bold expressions.",
    count: 33,
    image: "/assets/images/artworks/sunflower-field.png",
  },
];

const tagFilters = [
  "Nature",
  "People",
  "Culture",
  "Cities",
  "Dreams",
  "Animals",
  "Minimal",
  "Colorful",
  "Black & White",
  "Vintage",
  "Modern",
  "Abstract",
];

const creators = [
  {
    name: "Maya Kapoor",
    collections: 12,
    artworks: 24,
    followed: true,
  },
  {
    name: "Arjun Mehta",
    collections: 8,
    artworks: 36,
    followed: true,
  },
  {
    name: "Diya Sharma",
    collections: 10,
    artworks: 19,
    followed: false,
  },
  {
    name: "Kabir Singh",
    collections: 6,
    artworks: 18,
    followed: true,
  },
];

const handleShareArtwork = () => {
  window.location.href = "../create/index.html?from=collections";
};

export default function CollectionsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#efe9df] text-[#1f1d1a]">
      {/* =========================================================
          DESKTOP SIDEBAR
      ========================================================= */}
      <aside
        className={`fixed left-0 top-0 z-50 hidden h-screen flex-col bg-[#1d1b1a] text-[#f4f0e8] transition-all duration-300 lg:flex ${
          sidebarOpen ? "w-[220px]" : "w-[72px]"
        }`}
      >
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

        <nav className="mt-8 flex flex-col gap-2 px-3">
          <a
            href="../discover/index.html"
            title="Discover"
            className={`flex items-center rounded-md py-3 text-sm text-white/70 transition hover:bg-white/5 hover:text-white ${
              sidebarOpen ? "gap-4 px-5" : "justify-center px-0"
            }`}
          >
            <Compass className="size-5 shrink-0" />
            {sidebarOpen && <span>Discover</span>}
          </a>

          <a
            href="../collections/index.html"
            title="Collections"
            aria-current="page"
            className={`flex items-center rounded-md bg-white/10 py-3 text-sm text-white ${
              sidebarOpen ? "gap-4 px-5" : "justify-center px-0"
            }`}
          >
            <Bookmark className="size-5 shrink-0" />
            {sidebarOpen && <span>Collections</span>}
          </a>

          <div className="my-2 h-px bg-white/10" />

          <button
            type="button"
            onClick={handleShareArtwork}
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
            href="/pages/app/settings/account/index.html"
            title="Settings"
            className={`flex items-center rounded-md py-3 text-sm text-white/70 transition hover:bg-white/5 hover:text-white ${
              sidebarOpen ? "gap-4 px-5" : "justify-center px-0"
            }`}
          >
            <Settings className="size-5 shrink-0" />
            {sidebarOpen && <span>Settings</span>}
          </a>
        </nav>

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

      {/* =========================================================
          MOBILE HEADER
      ========================================================= */}
      <header className="relative flex h-16 items-center justify-between border-b border-black/10 bg-[#efe9df] px-5 lg:hidden">
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
          {menuOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
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
              className="flex items-center gap-3 rounded-lg bg-white/10 px-4 py-3 text-sm text-white"
              onClick={() => setMenuOpen(false)}
            >
              <Bookmark className="size-4" />
              Collections
            </a>

            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                handleShareArtwork();
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
              href="/pages/app/settings/account/index.html"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-white/10"
              onClick={() => setMenuOpen(false)}
            >
              <Settings className="size-4" />
              Settings
            </a>
          </div>
        )}
      </header>

      {/* =========================================================
          MAIN
      ========================================================= */}
      <main
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-[220px]" : "lg:ml-[72px]"
        }`}
      >
        {/* =======================================================
            TOP SEARCH HEADER
        ======================================================= */}
        <div className="sticky top-0 z-30 flex h-[78px] items-center justify-between border-b border-black/5 bg-[#efe9df]/95 px-5 backdrop-blur-md sm:px-8 lg:px-10">
          <div className="relative w-full max-w-[800px]">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-black/45" />

            <input
              type="search"
              placeholder="Search collections, artworks, artists, or themes..."
              className="h-11 w-full rounded-xl border border-black/5 bg-[#f3efe8] pl-12 pr-5 text-sm text-[#1f1d1a] outline-none transition placeholder:text-black/45 focus:border-black/20 focus:bg-white/80"
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
              <button type="button" className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-[#292723] text-sm text-white">
                Y
              </span>

              <span className="hidden text-sm xl:block">Hi, Yash</span>

              <ChevronDown className="size-4" />
            </button>
            </AccountDropdown>
          </div>
        </div>

        {/* =======================================================
            PAGE CONTENT
        ======================================================= */}
        <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10">
          {/* =====================================================
              HERO
          ===================================================== */}
          <section className="pb-1">
            <div className="mb-5 flex items-start gap-8">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] uppercase tracking-[0.34em] text-black/55">
                  Collections
                </p>

                <h1 className="mt-4 max-w-[820px] font-display text-[clamp(3.2rem,4.8vw,6.4rem)] leading-[0.88] tracking-[-0.055em] text-[#1d1b18]">
                  Art, grouped
                  <br />
                  by what moves you.
                </h1>

                <p className="mt-5 max-w-[720px] text-[16px] leading-[1.55] text-[#312f2b]/72">
                  Explore handpicked collections from the community, creators,
                  and our team. Different perspectives, themes, places and
                  feelings — all in one place.
                </p>
              </div>

              <div className="hidden flex-1 justify-end xl:flex">
                <div className="relative mt-3 h-[255px] w-[500px] overflow-hidden rounded-[26px] bg-[#d8c7ad] shadow-[0_20px_50px_rgba(24,19,14,0.08)]">
                  <img
                    src="/assets/images/story/hero-collage.jpg"
                    alt=""
                    className="h-full w-full object-cover"
                  />

                  <div className="hand-note absolute left-10 top-10 rotate-[-10deg] bg-transparent text-[32px] text-[#281f1d]/80">
                    Different
                    <br />
                    Stories.
                    <br />
                    Same
                    <br />
                    Humanity.
                  </div>
                </div>
              </div>
            </div>

            {/* ===================================================
                CATEGORY BAR
            =================================================== */}
            <div className="mt-5 flex items-center justify-between gap-5">
              <div className="flex flex-1 gap-2 overflow-x-auto pb-2">
                {categories.map((category, index) => (
                  <button
                    key={category}
                    type="button"
                    className={`whitespace-nowrap rounded-full border px-4 py-2 text-[12px] transition ${
                      index === 0
                        ? "border-[#221f1c] bg-[#201d1a] text-white"
                        : "border-black/10 bg-[#f3efe8] text-[#221f1d]/75 hover:bg-[#eae2d3]"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="hidden shrink-0 items-center gap-2 rounded-full border border-black/10 bg-[#f3efe8] px-4 py-2.5 text-sm text-[#201d1a] md:flex"
              >
                Latest First
                <ChevronDown className="size-4" />
              </button>
            </div>
          </section>

          {/* =====================================================
              YOUR COLLECTIONS
          ===================================================== */}
          <section className="mt-7">
            <a
              href="../my-collections/index.html"
              className="group flex flex-col gap-5 rounded-[22px] border border-black/5 bg-[#e5dcc9] p-5 transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(21,17,13,0.07)] sm:flex-row sm:items-center sm:justify-between sm:p-6"
            >
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.28em] text-black/50">
                  Your Collections
                </p>

                <h2 className="mt-2 font-display text-[clamp(1.8rem,2.5vw,2.5rem)] leading-[0.95] tracking-[-0.035em] text-[#1d1b1a]">
                  Your personal archive of artworks and stories.
                </h2>

                <p className="mt-2 max-w-[650px] text-[14px] leading-[1.5] text-[#2d2925]/65">
                  Create, organize, and revisit the collections you&apos;ve
                  gathered.
                </p>
              </div>

              <span className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#1d1b1a] px-5 py-3 text-sm font-medium text-white transition group-hover:bg-[#302d29]">
                View My Collections
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>
          </section>

          {/* =====================================================
              MAIN CONTENT + RIGHT SIDEBAR
          ===================================================== */}
          <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
            {/* ===================================================
                LEFT / MAIN CONTENT
            =================================================== */}
            <div className="space-y-8">
              {/* =================================================
                  FEATURED COLLECTIONS
              ================================================= */}
              <section>
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <h2 className="font-display text-[clamp(2.2rem,3vw,3.2rem)] leading-none text-[#1c1a17]">
                      Featured Collections
                    </h2>

                    <p className="mt-2 text-[15px] text-[#2d2925]/65">
                      Thoughtfully curated collections to start your journey.
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-3">
                  {featuredCollections.map((collection) => (
                    <a
                      key={collection.id}
                      href={`../collection/index.html?id=${encodeURIComponent(
                        collection.id
                      )}`}
                      className="group block overflow-hidden rounded-[20px] bg-[#e6dccb] shadow-[0_12px_30px_rgba(21,17,13,0.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(21,17,13,0.10)]"
                    >
                      <div className="relative h-[400px] overflow-hidden">
                        <img
                          src={collection.image}
                          alt={collection.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/18 to-black/10" />

                        <div className="absolute left-4 top-4 rounded-full bg-black/25 px-2.5 py-1.5 text-[10px] uppercase tracking-[0.22em] text-white backdrop-blur-sm">
                          {collection.tag}
                        </div>

                        <div className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1.5 text-[10px] font-medium text-white backdrop-blur-sm">
                          <span className="inline-flex size-3 items-center justify-center rounded-full border border-white/70">
                            ◌
                          </span>
                          {collection.count} artworks
                        </div>

                        <div className="absolute inset-x-0 bottom-0 p-5">
                          <h3 className="font-display text-[32px] leading-[0.92] tracking-[-0.035em] text-white">
                            {collection.title}
                          </h3>

                          <p className="mt-3 max-w-[270px] text-[14px] leading-[1.45] text-white/80">
                            {collection.description}
                          </p>

                          <div className="mt-5 flex items-center justify-between">
                            <div className="flex -space-x-2">
                              {collection.avatars.map((avatar, index) => (
                                <span
                                  key={`${collection.id}-${avatar}-${index}`}
                                  className="flex size-8 items-center justify-center rounded-full border-2 border-[#efe9df] bg-[#d1b793] text-[10px] font-semibold text-[#1d1b1a]"
                                >
                                  {avatar}
                                </span>
                              ))}

                              <span className="flex size-8 items-center justify-center rounded-full border-2 border-[#efe9df] bg-[#322f2a] text-[10px] font-semibold text-white">
                                +{collection.extra}
                              </span>
                            </div>

                            <span className="flex size-9 items-center justify-center rounded-full bg-white/90 text-[#1d1b1a]">
                              <ArrowRight className="size-4" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </section>

              {/* =================================================
                  TRENDING COLLECTIONS
              ================================================= */}
              <section>
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <h2 className="font-display text-[clamp(2.2rem,2.8vw,3rem)] leading-none text-[#181512]">
                      Trending Collections
                    </h2>

                    <p className="mt-2 text-[15px] text-[#2d2925]/65">
                      Collections the community is loving right now.
                    </p>
                  </div>

                  <a
                    href="#"
                    className="hidden text-[15px] text-[#2d2925]/75 hover:text-[#1d1b1a] sm:block"
                  >
                    See all →
                  </a>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {trendingCollections.map((collection) => (
                    <a
                      key={collection.id}
                      href={`../collection/index.html?id=${encodeURIComponent(
                        collection.id
                      )}`}
                      className="group block overflow-hidden rounded-[20px] border border-black/5 bg-[#f3efe8] transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="relative h-[150px] overflow-hidden">
                        <img
                          src={collection.image}
                          alt={collection.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />

                        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-[#1d1b1a]">
                            <span className="inline-flex size-3 items-center justify-center rounded-full border border-[#1d1b1a]/30">
                              ◌
                            </span>
                            {collection.count} artworks
                          </span>
                        </div>
                      </div>

                      <div className="p-4 pb-5">
                        <h3 className="font-display text-[22px] leading-[1.05] tracking-[-0.035em] text-[#1d1b1a]">
                          {collection.title}
                        </h3>

                        <p className="mt-2 text-[13px] leading-[1.45] text-[#322f2b]/68">
                          {collection.description}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            </div>

            {/* ===================================================
    RIGHT DISCOVERY SIDEBAR
=================================================== */}
<aside className="space-y-5">
  {/* =================================================
      FIND COLLECTIONS
  ================================================= */}
  <section className="rounded-[22px] bg-[#e5dcc9] p-5 shadow-[0_12px_30px_rgba(21,17,13,0.04)]">
    <div className="flex items-start gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f6f2eb] text-[#1d1b1a]">
        <Search className="size-4" />
      </div>

      <div>
        <h3 className="font-display text-[28px] leading-none text-[#1d1b1a]">
          Find Collections
        </h3>

        <p className="mt-2 text-[14px] leading-[1.5] text-[#2e2b28]/68">
          Explore by themes, places,
          <br />
          mediums and more.
        </p>
      </div>
    </div>

    {/* Search */}
    <div className="relative mt-5">
      <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-black/45" />

      <input
        type="search"
        placeholder="Search collections..."
        className="h-11 w-full rounded-full border border-black/10 bg-[#f5f2ea] pl-11 pr-4 text-sm text-[#1d1b1a] outline-none placeholder:text-black/45"
      />
    </div>

    {/* Tags */}
    <div className="mt-6 flex flex-wrap gap-2.5">
      {tagFilters.map((tag) => (
        <button
          key={tag}
          type="button"
          className="rounded-full border border-black/10 bg-[#f5f2ea] px-3 py-1.5 text-[12px] text-[#2d2925] transition hover:bg-[#e7dfd3]"
        >
          {tag}
        </button>
      ))}
    </div>
  </section>

  {/* =================================================
      POPULAR CREATORS
  ================================================= */}
  <section className="rounded-[22px] bg-[#e5dcc9] p-5 shadow-[0_12px_30px_rgba(21,17,13,0.04)]">
    <div className="flex items-start justify-between gap-4">
      <h4 className="font-display text-[28px] leading-[0.95] text-[#1d1b1a]">
        Popular
        <br />
        Creators
      </h4>

      <a
        href="#"
        className="pt-1 text-[14px] leading-5 text-[#2d2925]/75 transition hover:text-[#1d1b1a]"
      >
        See all
        <br />
        →
      </a>
    </div>

    <div className="mt-6 space-y-5">
      {creators.map((creator) => (
        <div
          key={creator.name}
          className="flex items-center justify-between gap-3"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#d4b99e] text-[12px] font-semibold text-[#1d1b1a]">
              {creator.name
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")}
            </div>

            <div className="min-w-0">
              <p className="text-[15px] font-medium text-[#1d1b1a]">
                {creator.name}
              </p>

              <p className="text-[12px] leading-5 text-[#2d2925]/62">
                {creator.collections} collections • {creator.artworks} artworks
              </p>
            </div>
          </div>

          <button
            type="button"
            className={`shrink-0 rounded-full px-4 py-2 text-[11px] font-medium transition ${
              creator.followed
                ? "bg-[#1d1b1a] text-white"
                : "bg-[#f5f2ea] text-[#1d1b1a] hover:bg-white"
            }`}
          >
            {creator.followed ? "Following" : "Follow"}
          </button>
        </div>
      ))}
    </div>
  </section>
</aside>
          </div>
        </div>
      </main>
    </div>
  );
}
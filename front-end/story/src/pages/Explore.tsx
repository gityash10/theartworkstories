import React, { useState } from "react";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Menu,
  Search,
} from "lucide-react";

import AccountDropdown from "../components/AccountDropdown";
import AppSidebar from "../components/AppSidebar";
import NotificationsBell from "../components/NotificationsBell";

const moods = [
  "Quiet",
  "Dreamy",
  "Joyful",
  "Melancholic",
  "Mysterious",
  "Peaceful",
  "Bold",
  "Nostalgic",
];

const mediums = [
  "Painting",
  "Photography",
  "Sculpture",
  "Illustration",
  "Digital Art",
  "Architecture",
  "Textile",
  "Mixed Media",
];

const eras = [
  "Ancient",
  "Renaissance",
  "Baroque",
  "Impressionism",
  "Modern",
  "Contemporary",
];

const places = [
  "India",
  "Japan",
  "France",
  "Italy",
  "Mexico",
  "Egypt",
  "United Kingdom",
  "United States",
];

const artworks = [
  {
    title: "The Great Wave off Kanagawa",
    artist: "Katsushika Hokusai",
    image: "/assets/images/artworks/great-wave.jpg",
    description:
      "A powerful image of nature, movement and the fragile presence of humanity.",
    tag: "Japanese Art",
  },
  {
    title: "Café Terrace at Night",
    artist: "Vincent van Gogh",
    image: "/assets/images/artworks/cafe-terrace.jpg",
    description:
      "A night scene transformed into a study of light, colour and atmosphere.",
    tag: "Post-Impressionism",
  },
  {
    title: "Winged Victory of Samothrace",
    artist: "Unknown",
    image: "/assets/images/artworks/winged-victory.jpg",
    description:
      "An ancient sculpture that turns movement, wind and victory into stone.",
    tag: "Ancient Sculpture",
  },
];

const artists = [
  {
    name: "Vincent van Gogh",
    handle: "@vincentvangogh",
    initial: "V",
    bio: "Colour, emotion and ordinary moments transformed into unforgettable images.",
  },
  {
    name: "Katsushika Hokusai",
    handle: "@hokusai",
    initial: "H",
    bio: "Japanese artist known for observing nature, movement and everyday life.",
  },
  {
    name: "Frida Kahlo",
    handle: "@fridakahlo",
    initial: "F",
    bio: "Personal experience, identity and symbolism brought together through art.",
  },
];

function Explore() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
              <NotificationsBell />
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

        <div className="mx-auto max-w-[1450px] px-5 py-10 sm:px-8 lg:px-10">
          {/* HERO */}
          <section className="relative overflow-hidden rounded-[2rem] bg-[#24231f] px-7 py-12 text-white sm:px-12 sm:py-16 lg:px-16 lg:py-20">
            <div className="relative z-10 max-w-2xl">
              <p className="text-xs uppercase tracking-[0.25em] text-white/45">
                Explore
              </p>

              <h1 className="mt-5 font-display text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
                Follow your
                <br />
                curiosity.
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
                There is no single way to discover art. Follow a feeling,
                explore a place, find an artist, or simply see where the next
                story takes you.
              </p>
            </div>

            <div className="absolute -right-10 -top-20 size-72 rounded-full border border-white/10" />
            <div className="absolute -bottom-40 right-20 size-96 rounded-full border border-white/10" />

            <div className="absolute bottom-8 right-8 hidden text-7xl text-white/10 lg:block">
              ✦
            </div>
          </section>

          {/* MOOD */}
          <section className="mt-16">
            <div className="flex items-end justify-between gap-5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black/35">
                  Start with a feeling
                </p>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl">
                  Explore by Mood
                </h2>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {moods.map((mood) => (
                <button
                  key={mood}
                  type="button"
                  className="rounded-full border border-black/10 bg-white/50 px-5 py-2.5 text-sm transition hover:-translate-y-0.5 hover:bg-white"
                >
                  {mood}
                </button>
              ))}
            </div>
          </section>

          {/* MEDIUM */}
          <section className="mt-16">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-black/35">
                Choose your medium
              </p>

              <h2 className="mt-2 font-display text-3xl sm:text-4xl">
                Explore by Medium
              </h2>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {mediums.map((medium, index) => (
                <button
                  key={medium}
                  type="button"
                  className={`group rounded-2xl border border-black/10 p-5 text-left transition hover:-translate-y-1 ${
                    index % 3 === 0 ? "bg-[#e8ddca]" : "bg-white/50"
                  }`}
                >
                  <span className="text-2xl text-black/20">
                    {["◌", "△", "◇", "○"][index % 4]}
                  </span>

                  <span className="mt-8 block text-sm font-medium">
                    {medium}
                  </span>

                  <span className="mt-2 flex items-center gap-1 text-xs text-black/40 opacity-0 transition group-hover:opacity-100">
                    Explore
                    <ChevronRight className="size-3" />
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* CURATED DISCOVERIES */}
          <section className="mt-20">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black/35">
                  Curated discoveries
                </p>

                <h2 className="mt-2 font-display text-3xl sm:text-4xl">
                  See something unexpected.
                </h2>
              </div>

              <button
                type="button"
                className="hidden text-sm text-black/50 hover:text-black sm:block"
              >
                Explore more →
              </button>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {artworks.map((artwork) => (
                <article key={artwork.title} className="group">
                  <div className="relative aspect-[0.9] overflow-hidden rounded-2xl bg-black/5">
                    <img
                      src={artwork.image}
                      alt={artwork.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] backdrop-blur">
                      {artwork.tag}
                    </div>
                  </div>

                  <h3 className="mt-4 font-display text-2xl">
                    {artwork.title}
                  </h3>

                  <p className="mt-1 text-sm text-black/50">{artwork.artist}</p>

                  <p className="mt-3 max-w-md text-sm leading-6 text-black/60">
                    {artwork.description}
                  </p>

                  <button type="button" className="mt-4 text-xs font-medium">
                    Discover the story →
                  </button>
                </article>
              ))}
            </div>
          </section>

          {/* ERA + PLACE */}
          <section className="mt-20 grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl bg-[#e8ddca] p-7 sm:p-9">
              <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                Travel through time
              </p>

              <h2 className="mt-3 font-display text-3xl">Explore by Era</h2>

              <div className="mt-7 flex flex-wrap gap-2">
                {eras.map((era) => (
                  <button
                    key={era}
                    type="button"
                    className="rounded-full bg-white/60 px-4 py-2 text-xs transition hover:bg-white"
                  >
                    {era}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-[#dfe3dc] p-7 sm:p-9">
              <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                Art has a place
              </p>

              <h2 className="mt-3 font-display text-3xl">Explore by Place</h2>

              <div className="mt-7 flex flex-wrap gap-2">
                {places.map((place) => (
                  <button
                    key={place}
                    type="button"
                    className="rounded-full bg-white/60 px-4 py-2 text-xs transition hover:bg-white"
                  >
                    {place}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ARTISTS */}
          <section className="mt-20">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-black/35">
                Follow the makers
              </p>

              <h2 className="mt-2 font-display text-3xl sm:text-4xl">
                Artists to Discover
              </h2>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {artists.map((artist) => (
                <article
                  key={artist.name}
                  className="rounded-2xl border border-black/10 bg-white/40 p-6 transition hover:-translate-y-1 hover:bg-white/70"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-14 items-center justify-center rounded-full bg-[#292723] font-display text-xl text-white">
                      {artist.initial}
                    </div>

                    <div>
                      <h3 className="text-sm font-medium">{artist.name}</h3>

                      <p className="mt-1 text-xs text-black/40">
                        {artist.handle}
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-6 text-black/60">
                    {artist.bio}
                  </p>

                  <button type="button" className="mt-5 text-xs font-medium">
                    Explore artist →
                  </button>
                </article>
              ))}
            </div>
          </section>

          {/* MORE TO EXPLORE */}
          <section className="mt-20">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-black/35">
                Keep going
              </p>

              <h2 className="mt-2 font-display text-3xl sm:text-4xl">
                More to Explore
              </h2>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-3">
              <a
                href="/pages/app/collections/index.html"
                className="group rounded-2xl border border-black/10 bg-white/40 p-7 transition hover:-translate-y-1 hover:bg-white"
              >
                <span className="text-3xl">◈</span>

                <h3 className="mt-8 font-display text-2xl">Collections</h3>

                <p className="mt-2 text-sm leading-6 text-black/50">
                  Wander through collections created around ideas, artists,
                  places and feelings.
                </p>

                <span className="mt-5 flex items-center gap-2 text-xs">
                  Browse collections
                  <ChevronRight className="size-3 transition group-hover:translate-x-1" />
                </span>
              </a>

              <a
                href="/pages/app/profile/index.html"
                className="group rounded-2xl border border-black/10 bg-white/40 p-7 transition hover:-translate-y-1 hover:bg-white"
              >
                <span className="text-3xl">○</span>

                <h3 className="mt-8 font-display text-2xl">Community</h3>

                <p className="mt-2 text-sm leading-6 text-black/50">
                  See what people are discovering, collecting and sharing across
                  the community.
                </p>

                <span className="mt-5 flex items-center gap-2 text-xs">
                  Meet the community
                  <ChevronRight className="size-3 transition group-hover:translate-x-1" />
                </span>
              </a>

              <a
                href="/pages/app/create/index.html"
                className="group rounded-2xl border border-black/10 bg-[#24231f] p-7 text-white transition hover:-translate-y-1"
              >
                <span className="text-3xl text-white/50">+</span>

                <h3 className="mt-8 font-display text-2xl">Share an Artwork</h3>

                <p className="mt-2 text-sm leading-6 text-white/55">
                  Have a piece of art with a story? Give it a place here.
                </p>

                <span className="mt-5 flex items-center gap-2 text-xs">
                  Share your art
                  <ChevronRight className="size-3 transition group-hover:translate-x-1" />
                </span>
              </a>
            </div>
          </section>

          {/* FOOTER SPACE */}
          <div className="h-24" />
        </div>
      </main>
    </div>
  );
}

export default Explore;

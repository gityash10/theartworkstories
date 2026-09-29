import React, { useState } from "react";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Compass,
  Heart,
  Menu,
  Search,
  Settings,
  User,
  X,
} from "lucide-react";

import AccountDropdown from "../components/AccountDropdown";

const artists = [
  {
    name: "Vincent van Gogh",
    username: "@vincentvangogh",
    initial: "V",
    period: "Post-Impressionism",
    location: "Netherlands",
    description:
      "An artist whose paintings turned colour, light and ordinary moments into deeply personal visual experiences.",
    works: "900+ works",
  },
  {
    name: "Katsushika Hokusai",
    username: "@hokusai",
    initial: "H",
    period: "Edo Period",
    location: "Japan",
    description:
      "A Japanese artist and printmaker whose observations of nature became some of the most recognisable images in art.",
    works: "30,000+ works",
  },
  {
    name: "Frida Kahlo",
    username: "@fridakahlo",
    initial: "F",
    period: "Modern Art",
    location: "Mexico",
    description:
      "An artist known for transforming personal experience, identity and symbolism into intimate self-portraits.",
    works: "150+ works",
  },
  {
    name: "Leonardo da Vinci",
    username: "@leonardodavinci",
    initial: "L",
    period: "Renaissance",
    location: "Italy",
    description:
      "Painter, inventor and observer whose notebooks and artworks reveal a lifelong curiosity about the natural world.",
    works: "20+ surviving paintings",
  },
  {
    name: "Georgia O'Keeffe",
    username: "@georgiaokeeffe",
    initial: "G",
    period: "Modernism",
    location: "United States",
    description:
      "An artist who transformed flowers, landscapes and natural forms through abstraction and close observation.",
    works: "2,000+ works",
  },
  {
    name: "Amrita Sher-Gil",
    username: "@amritashergil",
    initial: "A",
    period: "Modern Indian Art",
    location: "India",
    description:
      "A pioneering modern Indian artist whose paintings brought together European training and Indian subjects.",
    works: "200+ works",
  },
];

const periods = [
  "Renaissance",
  "Baroque",
  "Impressionism",
  "Post-Impressionism",
  "Modern",
  "Contemporary",
];

const regions = [
  "India",
  "Japan",
  "Italy",
  "France",
  "Mexico",
  "United States",
];

function Artists() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredArtists = artists.filter((artist) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

    return (
      artist.name.toLowerCase().includes(query) ||
      artist.username.toLowerCase().includes(query) ||
      artist.period.toLowerCase().includes(query) ||
      artist.location.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#24231f]">
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col border-r border-black/10 bg-[#f7f5f0] px-5 py-6 transition-transform duration-300 lg:translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <a
            href="/pages/app/discover/index.html"
            className="font-display text-xl tracking-tight"
          >
            The ArtWork Stories
          </a>

          <button
            type="button"
            className="rounded-lg p-2 hover:bg-black/5 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <X className="size-5" />
          </button>
        </div>

        <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-black/40">
          Every art has a story.
        </p>

        <nav className="mt-10 space-y-1">
          <a
            href="/pages/app/discover/index.html"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-black/65 hover:bg-black/5"
          >
            <Compass className="size-4" />
            Discover
          </a>

          <a
            href="/pages/app/collections/index.html"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-black/65 hover:bg-black/5"
          >
            <Heart className="size-4" />
            Collections
          </a>

          <div className="my-5 border-t border-black/10" />

          <a
            href="/pages/app/create/index.html"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-black/65 hover:bg-black/5"
          >
            <span className="text-base">+</span>
            Share an Artwork
          </a>

          <a
            href="/pages/app/profile/index.html"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-black/65 hover:bg-black/5"
          >
            <User className="size-4" />
            Profile
          </a>

          <a
            href="/pages/app/settings/account/index.html"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-black/65 hover:bg-black/5"
          >
            <Settings className="size-4" />
            Settings
          </a>
        </nav>

        <div className="mt-auto rounded-2xl bg-[#e8ddca] p-4">
          <p className="font-display text-lg">Meet the makers.</p>
          <p className="mt-2 text-xs leading-5 text-black/55">
            Discover the people, ideas and stories behind the artworks.
          </p>
        </div>
      </aside>

      {/* MAIN */}
      <main className="min-h-screen lg:pl-[250px]">
        {/* HEADER */}
        <header className="sticky top-0 z-30 border-b border-black/10 bg-[#f7f5f0]/90 px-5 py-4 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="rounded-lg p-2 hover:bg-black/5 lg:hidden"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="size-5" />
            </button>

            <div className="relative max-w-xl flex-1">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-black/40" />

              <input
                type="search"
                placeholder="Search artists..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-xl border border-black/10 bg-white/60 py-2.5 pl-11 pr-4 text-sm outline-none placeholder:text-black/35 focus:border-black/25"
              />
            </div>

            <a
              href="/pages/app/notifications/index.html"
              className="rounded-lg p-2 text-black/65 hover:bg-black/5"
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

        <div className="mx-auto max-w-[1450px] px-5 py-10 sm:px-8 lg:px-10">
          {/* HERO */}
          <section className="rounded-[2rem] bg-[#24231f] px-7 py-12 text-white sm:px-12 sm:py-16 lg:px-16">
            <p className="text-xs uppercase tracking-[0.25em] text-white/40">
              Find an Artist
            </p>

            <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
              Meet the people
              <br />
              behind the art.
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
              Explore artists across time, places and creative movements.
              Discover their work, their ideas and the stories that shaped what
              they made.
            </p>
          </section>

          {/* FILTERS */}
          <section className="mt-12">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-black/35">
                Browse
              </p>

              <h2 className="mt-2 font-display text-3xl">
                Explore artists by period
              </h2>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {periods.map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setSearch(period)}
                  className="rounded-full border border-black/10 bg-white/50 px-4 py-2 text-xs transition hover:bg-white"
                >
                  {period}
                </button>
              ))}
            </div>
          </section>

          {/* ARTIST GRID */}
          <section className="mt-14">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black/35">
                  Artists
                </p>

                <h2 className="mt-2 font-display text-3xl sm:text-4xl">
                  Discover a maker
                </h2>
              </div>

              <span className="text-xs text-black/40">
                {filteredArtists.length} artists
              </span>
            </div>

            {filteredArtists.length > 0 ? (
              <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredArtists.map((artist) => (
                  <article
                    key={artist.name}
                    className="group rounded-3xl border border-black/10 bg-white/40 p-6 transition hover:-translate-y-1 hover:bg-white"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex size-16 items-center justify-center rounded-full bg-[#292723] font-display text-2xl text-white">
                        {artist.initial}
                      </div>

                      <button
                        type="button"
                        className="rounded-full border border-black/10 p-2 text-black/45 hover:bg-black/5 hover:text-black"
                        aria-label={`Save ${artist.name}`}
                      >
                        <Heart className="size-4" />
                      </button>
                    </div>

                    <p className="mt-7 text-[10px] uppercase tracking-[0.18em] text-black/35">
                      {artist.period}
                    </p>

                    <h3 className="mt-2 font-display text-3xl">
                      {artist.name}
                    </h3>

                    <p className="mt-1 text-xs text-black/40">
                      {artist.username}
                    </p>

                    <p className="mt-5 text-sm leading-6 text-black/60">
                      {artist.description}
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-5">
                      <div>
                        <p className="text-xs text-black/35">Based in</p>
                        <p className="mt-1 text-xs">{artist.location}</p>
                      </div>

                      <div>
                        <p className="text-xs text-black/35">Works</p>
                        <p className="mt-1 text-xs">{artist.works}</p>
                      </div>

                      <button
                        type="button"
                        className="flex items-center gap-1 text-xs font-medium"
                      >
                        Explore
                        <ChevronRight className="size-3 transition group-hover:translate-x-1" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-7 rounded-2xl border border-black/10 bg-white/40 px-6 py-14 text-center">
                <p className="font-display text-2xl">No artists found.</p>

                <p className="mt-2 text-sm text-black/45">
                  Try another artist, period or location.
                </p>

                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-5 rounded-full bg-[#24231f] px-5 py-2.5 text-xs text-white"
                >
                  Show all artists
                </button>
              </div>
            )}
          </section>

          {/* REGIONS */}
          <section className="mt-20">
            <div className="rounded-3xl bg-[#e8ddca] p-7 sm:p-10">
              <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                Art around the world
              </p>

              <h2 className="mt-3 max-w-xl font-display text-4xl">
                Discover artists by place.
              </h2>

              <div className="mt-7 flex flex-wrap gap-2">
                {regions.map((region) => (
                  <button
                    key={region}
                    type="button"
                    onClick={() => setSearch(region)}
                    className="rounded-full bg-white/60 px-5 py-2.5 text-xs transition hover:bg-white"
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mt-16 rounded-3xl bg-[#24231f] p-8 text-white sm:p-12">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">
              The community
            </p>

            <h2 className="mt-4 max-w-2xl font-display text-4xl leading-tight sm:text-5xl">
              Know an artist whose story deserves to be heard?
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-6 text-white/55">
              Share an artwork and help bring another creative story into the
              community.
            </p>

            <a
              href="/pages/app/create/index.html"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm text-[#24231f] transition hover:bg-white/90"
            >
              Share an artwork
              <ChevronRight className="size-4" />
            </a>
          </section>

          <div className="h-20" />
        </div>
      </main>
    </div>
  );
}

export default Artists;

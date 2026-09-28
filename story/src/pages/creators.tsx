import { useMemo, useState } from "react";
import {
  Bell,
  ChevronDown,
  Heart,
  Menu,
  Search,
  X,
} from "lucide-react";

type Creator = {
  id: number;
  name: string;
  username: string;
  bio: string;
  location: string;
  artworks: number;
  collections: number;
};

const creators: Creator[] = [
  {
    id: 1,
    name: "Yash Jain",
    username: "@yashjain",
    bio: "Exploring the stories, ideas and emotions behind art.",
    location: "India",
    artworks: 24,
    collections: 4,
  },
  {
    id: 2,
    name: "Maya Kapoor",
    username: "@mayakapoor",
    bio: "Collecting quiet moments and meaningful visual stories.",
    location: "Mumbai, India",
    artworks: 18,
    collections: 6,
  },
  {
    id: 3,
    name: "Arjun Mehta",
    username: "@arjuncreates",
    bio: "Artist, photographer and curious observer.",
    location: "Delhi, India",
    artworks: 31,
    collections: 5,
  },
  {
    id: 4,
    name: "Sara Williams",
    username: "@saraw",
    bio: "Finding connections between old art and modern life.",
    location: "London, UK",
    artworks: 16,
    collections: 8,
  },
  {
    id: 5,
    name: "Noah Chen",
    username: "@noahchen",
    bio: "Architecture, sculpture and visual culture.",
    location: "Singapore",
    artworks: 22,
    collections: 3,
  },
  {
    id: 6,
    name: "Ananya Rao",
    username: "@ananyarao",
    bio: "Stories from Indian art, craft and everyday life.",
    location: "Bengaluru, India",
    artworks: 27,
    collections: 7,
  },
];

function Creators() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [following, setFollowing] = useState<number[]>([]);

  const filteredCreators = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return creators;

    return creators.filter(
      (creator) =>
        creator.name.toLowerCase().includes(query) ||
        creator.username.toLowerCase().includes(query) ||
        creator.bio.toLowerCase().includes(query) ||
        creator.location.toLowerCase().includes(query),
    );
  }, [search]);

  const toggleFollow = (id: number) => {
    setFollowing((current) =>
      current.includes(id)
        ? current.filter((creatorId) => creatorId !== id)
        : [...current, id],
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f2eb] text-[#24231f]">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[250px] border-r border-black/10 bg-[#f5f2eb] px-6 py-7 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <a
            href="/pages/home/index.html"
            className="font-display text-xl tracking-tight"
          >
            The ArtWork Stories
          </a>

          <button
            type="button"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="mt-12 space-y-2">
          <a
            href="/pages/app/discover/index.html"
            className="block rounded-lg px-3 py-2.5 text-sm text-black/60 transition hover:bg-black/5 hover:text-black"
          >
            Discover
          </a>

          <a
            href="/pages/app/collections/index.html"
            className="block rounded-lg px-3 py-2.5 text-sm text-black/60 transition hover:bg-black/5 hover:text-black"
          >
            Collections
          </a>

          <a
            href="/pages/app/create/index.html"
            className="mt-5 block rounded-lg bg-black/[0.04] px-3 py-2.5 text-sm transition hover:bg-black/[0.07]"
          >
            Share an Artwork
          </a>

          <div className="my-5 border-t border-black/10" />

          <a
            href="/pages/app/profile/index.html"
            className="block rounded-lg px-3 py-2.5 text-sm text-black/60 transition hover:bg-black/5 hover:text-black"
          >
            Profile
          </a>

          <a
            href="/pages/app/settings/account/index.html"
            className="block rounded-lg px-3 py-2.5 text-sm text-black/60 transition hover:bg-black/5 hover:text-black"
          >
            Settings
          </a>
        </nav>
      </aside>

      <main className="lg:pl-[250px]">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-black/10 bg-[#f5f2eb]/90 px-5 py-4 backdrop-blur-md lg:px-10">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>

            <div className="relative max-w-xl flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-black/40" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search creators..."
                className="w-full rounded-full border border-black/10 bg-white/50 py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-black/35 focus:border-black/25"
              />
            </div>

            <a
              href="/pages/app/notifications/index.html"
              aria-label="Notifications"
              className="text-black/60 transition hover:text-black"
            >
              <Bell className="size-5" />
            </a>

            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setAccountOpen((open) => !open)}
                className="flex items-center gap-2 text-sm"
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-[#24231f] text-xs text-white">
                  Y
                </span>

                <span className="hidden md:block">Yash</span>

                <ChevronDown
                  className={`size-4 transition-transform ${
                    accountOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {accountOpen && (
                <div className="absolute right-0 top-11 w-52 rounded-xl border border-black/10 bg-white p-2 shadow-xl">
                  <div className="border-b border-black/10 px-3 py-3">
                    <p className="text-sm font-medium">Yash Jain</p>
                    <p className="mt-0.5 text-xs text-black/45">
                      @yashjain
                    </p>
                  </div>

                  <a
                    href="/pages/app/profile/index.html"
                    className="mt-1 block rounded-lg px-3 py-2 text-sm hover:bg-black/5"
                  >
                    Profile
                  </a>

                  <a
                    href="/pages/app/settings/account/index.html"
                    className="block rounded-lg px-3 py-2 text-sm hover:bg-black/5"
                  >
                    Settings
                  </a>

                  <button
                    type="button"
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-black/50 hover:bg-black/5"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-5 py-10 lg:px-10 lg:py-14">
          <a
            href="/pages/app/collections/index.html"
            className="text-xs text-black/45 transition hover:text-black"
          >
            ← Back to Collections
          </a>

          <section className="mt-8 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-black/40">
              Community
            </p>

            <h1 className="mt-3 font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl">
              Meet the people
              <br />
              behind the art.
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-black/55">
              Discover people collecting, creating and sharing the stories
              that make art meaningful.
            </p>
          </section>

          {/* Search / count */}
          <section className="mt-10 flex flex-col justify-between gap-4 border-y border-black/10 py-5 sm:flex-row sm:items-center">
            <p className="text-xs text-black/45">
              {filteredCreators.length} creators
            </p>

            <div className="flex items-center gap-2 text-xs text-black/45">
              <span>Sort by</span>
              <button
                type="button"
                className="rounded-full border border-black/10 bg-white/40 px-4 py-2 text-black"
              >
                Community activity
                <ChevronDown className="ml-2 inline size-3" />
              </button>
            </div>
          </section>

          {/* Creator grid */}
          {filteredCreators.length > 0 ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredCreators.map((creator) => {
                const isFollowing = following.includes(creator.id);

                return (
                  <article
                    key={creator.id}
                    className="rounded-2xl border border-black/10 bg-white/35 p-6 transition hover:-translate-y-1 hover:bg-white/60"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex size-14 items-center justify-center rounded-full bg-[#24231f] font-display text-xl text-white">
                        {creator.name.charAt(0)}
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleFollow(creator.id)}
                        className={`rounded-full border px-4 py-2 text-xs transition ${
                          isFollowing
                            ? "border-[#24231f] bg-[#24231f] text-white"
                            : "border-black/10 hover:border-black/25"
                        }`}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                    </div>

                    <h2 className="mt-6 font-display text-2xl">
                      {creator.name}
                    </h2>

                    <p className="mt-1 text-xs text-black/40">
                      {creator.username}
                    </p>

                    <p className="mt-4 text-sm leading-6 text-black/55">
                      {creator.bio}
                    </p>

                    <div className="mt-5 text-xs text-black/40">
                      {creator.location}
                    </div>

                    <div className="mt-6 grid grid-cols-2 border-t border-black/10 pt-5">
                      <div>
                        <p className="font-display text-xl">
                          {creator.artworks}
                        </p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-black/40">
                          Artworks
                        </p>
                      </div>

                      <div>
                        <p className="font-display text-xl">
                          {creator.collections}
                        </p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-black/40">
                          Collections
                        </p>
                      </div>
                    </div>

                    <a
                      href="/pages/app/profile/index.html"
                      className="mt-6 flex items-center justify-between border-t border-black/10 pt-5 text-xs transition hover:text-black/50"
                    >
                      View creator
                      <span>→</span>
                    </a>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-black/15 px-6 py-16 text-center">
              <h2 className="font-display text-2xl">No creators found</h2>

              <p className="mt-2 text-sm text-black/45">
                Try searching for another creator.
              </p>

              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-5 rounded-lg bg-[#24231f] px-5 py-2.5 text-xs text-white"
              >
                Clear search
              </button>
            </div>
          )}

          {/* CTA */}
          <section className="mt-16 rounded-3xl border border-black/10 bg-white/35 px-7 py-10 sm:px-10">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.18em] text-black/40">
                Join the community
              </p>

              <h2 className="mt-4 font-display text-3xl leading-tight sm:text-4xl">
                Your perspective belongs here.
              </h2>

              <p className="mt-3 text-sm leading-7 text-black/50">
                Share an artwork, build collections and add your own story to
                the growing archive.
              </p>

              <a
                href="/pages/app/create/index.html"
                className="mt-6 inline-flex rounded-lg bg-[#24231f] px-5 py-3 text-sm text-white transition hover:bg-black"
              >
                Share an artwork →
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Creators;    
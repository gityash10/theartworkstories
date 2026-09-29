import { useMemo, useState } from "react";
import { Bell, ChevronDown, Heart, Menu, Search, X } from "lucide-react";

import AccountDropdown from "../components/AccountDropdown";

type Story = {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  readTime: string;
  image: string;
};

const stories: Story[] = [
  {
    id: 1,
    title: "The Wave That Became a Symbol",
    excerpt:
      "How Hokusai transformed a moment of nature into one of the world's most recognizable images.",
    author: "The ArtWork Stories",
    category: "Art History",
    readTime: "8 min",
    image: "/assets/images/artworks/great-wave.jpg",
  },
  {
    id: 2,
    title: "A Café After Midnight",
    excerpt:
      "The quiet atmosphere, restless nights and human stories behind a famous painted café.",
    author: "The ArtWork Stories",
    category: "Painting",
    readTime: "6 min",
    image: "/assets/images/artworks/cafe-terrace.jpg",
  },
  {
    id: 3,
    title: "When Stone Learned to Move",
    excerpt:
      "A closer look at how ancient sculptors created movement, balance and emotion in marble.",
    author: "The ArtWork Stories",
    category: "Sculpture",
    readTime: "7 min",
    image: "/assets/images/artworks/winged-victory.jpg",
  },
  {
    id: 4,
    title: "Why Artists Keep Painting Water",
    excerpt:
      "Water has appeared throughout art history as memory, movement, reflection and metaphor.",
    author: "The ArtWork Stories",
    category: "Ideas",
    readTime: "5 min",
    image: "/assets/images/artworks/great-wave.jpg",
  },
  {
    id: 5,
    title: "The Places Artists Leave Behind",
    excerpt:
      "Studios, streets and homes can become part of an artwork's story long after the artist is gone.",
    author: "The ArtWork Stories",
    category: "Artists",
    readTime: "9 min",
    image: "/assets/images/artworks/cafe-terrace.jpg",
  },
  {
    id: 6,
    title: "Looking at Art Slowly",
    excerpt:
      "What changes when we stop trying to understand an artwork immediately and simply spend time with it?",
    author: "The ArtWork Stories",
    category: "Ideas",
    readTime: "4 min",
    image: "/assets/images/artworks/winged-victory.jpg",
  },
];

const categories = [
  "All",
  "Art History",
  "Painting",
  "Sculpture",
  "Artists",
  "Ideas",
];

function Stories() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [likedStories, setLikedStories] = useState<number[]>([]);

  const filteredStories = useMemo(() => {
    const query = search.trim().toLowerCase();

    return stories.filter((story) => {
      const matchesCategory = category === "All" || story.category === category;

      const matchesSearch =
        !query ||
        story.title.toLowerCase().includes(query) ||
        story.excerpt.toLowerCase().includes(query) ||
        story.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  const toggleLike = (id: number) => {
    setLikedStories((current) =>
      current.includes(id)
        ? current.filter((storyId) => storyId !== id)
        : [...current, id],
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f2eb] text-[#24231f]">
      {/* Mobile overlay */}
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

      {/* Main */}
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
                placeholder="Search stories..."
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

            <AccountDropdown className="hidden sm:block">
              <span className="flex size-8 items-center justify-center rounded-full bg-[#24231f] text-xs text-white">
                Y
              </span>

              <span className="hidden md:block">Yash</span>

              <ChevronDown className="size-4" />
            </AccountDropdown>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-5 py-10 lg:px-10 lg:py-14">
          {/* Intro */}
          <section className="max-w-3xl">
            <a
              href="/pages/app/discover/index.html"
              className="text-xs text-black/45 transition hover:text-black"
            >
              ← Back to Discover
            </a>

            <p className="mt-8 text-xs uppercase tracking-[0.2em] text-black/40">
              Stories
            </p>

            <h1 className="mt-3 font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl">
              Stories worth
              <br />
              spending time with.
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-black/55">
              Explore stories about artworks, artists, ideas and the moments
              that give creative work its meaning.
            </p>
          </section>

          {/* Categories */}
          <div className="mt-10 flex gap-2 overflow-x-auto pb-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs transition ${
                  category === item
                    ? "border-[#24231f] bg-[#24231f] text-white"
                    : "border-black/10 bg-white/40 hover:border-black/25"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Featured story */}
          {category === "All" && !search && (
            <section className="mt-10 overflow-hidden rounded-3xl border border-black/10 bg-white/40">
              <div className="grid lg:grid-cols-2">
                <img
                  src="/assets/images/artworks/great-wave.jpg"
                  alt="The Great Wave"
                  className="h-[300px] w-full object-cover lg:h-full"
                />

                <div className="flex flex-col justify-center p-7 sm:p-10">
                  <p className="text-xs uppercase tracking-[0.18em] text-black/40">
                    Featured story
                  </p>

                  <h2 className="mt-4 font-display text-3xl leading-tight sm:text-4xl">
                    The Wave That Became a Symbol
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-black/55">
                    How one image travelled from nineteenth-century Japan into
                    the visual language of the modern world.
                  </p>

                  <div className="mt-6 flex items-center gap-4 text-xs text-black/45">
                    <span>Art History</span>
                    <span>•</span>
                    <span>8 min read</span>
                  </div>

                  <a
                    href="/pages/app/story-of-week/index.html"
                    className="mt-7 inline-flex w-fit rounded-lg bg-[#24231f] px-5 py-3 text-sm text-white transition hover:bg-black"
                  >
                    Read the story →
                  </a>
                </div>
              </div>
            </section>
          )}

          {/* Story grid */}
          <section className="mt-12">
            <div className="flex items-end justify-between gap-5">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-black/40">
                  Explore
                </p>

                <h2 className="mt-2 font-display text-3xl">
                  {search || category !== "All"
                    ? "Stories you might like"
                    : "Latest stories"}
                </h2>
              </div>

              <span className="hidden text-xs text-black/40 sm:block">
                {filteredStories.length} stories
              </span>
            </div>

            {filteredStories.length > 0 ? (
              <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredStories.map((story) => {
                  const liked = likedStories.includes(story.id);

                  return (
                    <article
                      key={story.id}
                      className="group overflow-hidden rounded-2xl border border-black/10 bg-white/35 transition hover:-translate-y-1 hover:bg-white/60"
                    >
                      <a href="/pages/app/story-of-week/index.html">
                        <div className="overflow-hidden">
                          <img
                            src={story.image}
                            alt=""
                            className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                          />
                        </div>
                      </a>

                      <div className="p-5">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[10px] uppercase tracking-[0.15em] text-black/40">
                            {story.category}
                          </span>

                          <button
                            type="button"
                            aria-label={liked ? "Unlike story" : "Like story"}
                            onClick={() => toggleLike(story.id)}
                            className="rounded-full p-1.5 transition hover:bg-black/5"
                          >
                            <Heart
                              className={`size-4 ${
                                liked ? "fill-current" : ""
                              }`}
                            />
                          </button>
                        </div>

                        <a href="/pages/app/story-of-week/index.html">
                          <h3 className="mt-4 font-display text-2xl leading-tight transition group-hover:text-black/60">
                            {story.title}
                          </h3>
                        </a>

                        <p className="mt-3 line-clamp-3 text-xs leading-6 text-black/50">
                          {story.excerpt}
                        </p>

                        <div className="mt-5 flex items-center justify-between text-[11px] text-black/40">
                          <span>{story.author}</span>
                          <span>{story.readTime}</span>
                        </div>

                        <a
                          href="/pages/app/story-of-week/index.html"
                          className="mt-5 block text-xs transition hover:text-black/50"
                        >
                          Read story →
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-7 rounded-2xl border border-dashed border-black/15 px-6 py-16 text-center">
                <h3 className="font-display text-2xl">No stories found</h3>

                <p className="mt-2 text-sm text-black/45">
                  Try another search or explore a different category.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                  }}
                  className="mt-5 rounded-lg bg-[#24231f] px-5 py-2.5 text-xs text-white"
                >
                  Clear filters
                </button>
              </div>
            )}
          </section>

          {/* Bottom CTA */}
          <section className="mt-16 rounded-3xl border border-black/10 bg-[#24231f] px-7 py-10 text-white sm:px-10">
            <p className="text-xs uppercase tracking-[0.18em] text-white/45">
              Have a story?
            </p>

            <div className="mt-4 flex flex-col justify-between gap-7 md:flex-row md:items-end">
              <div>
                <h2 className="max-w-xl font-display text-3xl leading-tight sm:text-4xl">
                  Every artwork has something worth telling.
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">
                  Share an artwork and tell the community why it matters to you.
                </p>
              </div>

              <a
                href="/pages/app/create/index.html"
                className="inline-flex w-fit shrink-0 rounded-lg bg-white px-5 py-3 text-sm text-[#24231f] transition hover:bg-white/90"
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

export default Stories;

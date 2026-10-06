import React, { useState } from "react";
import {
  ArrowLeft,
  Bell,
  Bookmark,
  ChevronDown,
  Heart,
  Menu,
  Search,
  Share2,
} from "lucide-react";

import AccountDropdown from "../components/AccountDropdown";
import AppSidebar from "../components/AppSidebar";
import NotificationsBell from "../components/NotificationsBell";

const chapters = [
  {
    number: "01",
    title: "The first impression",
    text: "Some artworks ask you to stop before you understand why. The first encounter is often visual, immediate and instinctive. Before the history, before the artist, before the explanation, there is simply the experience of looking.",
  },
  {
    number: "02",
    title: "Look a little closer",
    text: "The longer we look, the more details begin to emerge. Small choices in colour, composition, material and gesture can completely change how an artwork feels. What first seemed simple can slowly reveal another layer.",
  },
  {
    number: "03",
    title: "The story behind the work",
    text: "An artwork does not exist separately from the world around it. Its story can include the artist, the place where it was created, the people who experienced it and the moment in history that shaped it.",
  },
  {
    number: "04",
    title: "What remains",
    text: "Long after the original moment has passed, the artwork remains. Different people may see different things in it, but the conversation continues. That is part of what makes art worth returning to.",
  },
];

function StoryOfTheWeek() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

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

        {/* STORY */}
        <article className="mx-auto max-w-[1100px] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
          {/* BACK */}
          <a
            href="/pages/app/discover/index.html"
            className="inline-flex items-center gap-2 text-sm text-black/55 transition hover:text-black"
          >
            <ArrowLeft className="size-4" />
            Back to Discover
          </a>

          {/* CATEGORY */}
          <div className="mt-12">
            <p className="text-xs uppercase tracking-[0.25em] text-black/40">
              Story of the Week
            </p>

            <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
              When an artwork asks you to look twice
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-black/55">
              A closer look at how the story behind an artwork can transform the
              way we experience what we see.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4 text-xs text-black/45">
              <span>Story of the Week</span>
              <span>•</span>
              <span>8 min read</span>
              <span>•</span>
              <span>September 2026</span>
            </div>
          </div>

          {/* HERO IMAGE */}
          <div className="mt-12 overflow-hidden rounded-[2rem] bg-black/5">
            <img
              src="/assets/images/artworks/great-wave.jpg"
              alt="Featured artwork"
              className="aspect-[16/9] h-full w-full object-cover"
            />
          </div>

          {/* ACTIONS */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-6">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLiked((value) => !value)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition ${
                  liked
                    ? "border-black bg-black text-white"
                    : "border-black/10 bg-white/50 hover:bg-white"
                }`}
              >
                <Heart className={`size-4 ${liked ? "fill-current" : ""}`} />
                {liked ? "Liked" : "Like"}
              </button>

              <button
                type="button"
                onClick={() => setSaved((value) => !value)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition ${
                  saved
                    ? "border-black bg-black text-white"
                    : "border-black/10 bg-white/50 hover:bg-white"
                }`}
              >
                <Bookmark className={`size-4 ${saved ? "fill-current" : ""}`} />
                {saved ? "Saved" : "Save"}
              </button>

              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-black/10 bg-white/50 px-4 py-2.5 text-sm transition hover:bg-white"
              >
                <Share2 className="size-4" />
                Share
              </button>
            </div>

            <p className="text-xs text-black/40">Part of The ArtWork Stories</p>
          </div>

          {/* CONTENT */}
          <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_280px]">
            <div>
              <p className="font-display text-3xl leading-tight sm:text-4xl">
                Sometimes the most interesting part of an artwork is the moment
                when we stop looking at it as just an object.
              </p>

              <div className="mt-10 space-y-7 text-[15px] leading-8 text-black/65">
                <p>
                  An artwork can first arrive as an image. We notice its
                  colours, its scale, its composition or simply the feeling it
                  gives us. But looking is only the beginning.
                </p>

                <p>
                  Behind the visible surface there can be a person, a place, a
                  particular moment in time and a reason the work came into
                  existence.
                </p>

                <p>
                  Learning that context does not have to tell us what an artwork
                  means. Instead, it can give us another way into the work. A
                  detail that seemed ordinary can suddenly become meaningful.
                </p>
              </div>

              {/* CHAPTERS */}
              <div className="mt-16 space-y-0 border-t border-black/10">
                {chapters.map((chapter) => (
                  <section
                    key={chapter.number}
                    className="grid gap-5 border-b border-black/10 py-9 sm:grid-cols-[80px_1fr]"
                  >
                    <span className="text-xs text-black/35">
                      {chapter.number}
                    </span>

                    <div>
                      <h2 className="font-display text-3xl">{chapter.title}</h2>

                      <p className="mt-4 max-w-2xl text-[15px] leading-8 text-black/60">
                        {chapter.text}
                      </p>
                    </div>
                  </section>
                ))}
              </div>

              {/* CLOSING */}
              <div className="mt-16 rounded-3xl bg-[#e8ddca] p-7 sm:p-10">
                <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                  Take another look
                </p>

                <p className="mt-5 max-w-2xl font-display text-3xl leading-tight sm:text-4xl">
                  The next time an artwork catches your attention, stay a little
                  longer. There might be a story waiting underneath the first
                  impression.
                </p>
              </div>
            </div>

            {/* SIDEBAR */}
            <aside className="lg:pt-2">
              <div className="sticky top-28 space-y-6">
                <div className="rounded-2xl border border-black/10 bg-white/40 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-black/35">
                    In this story
                  </p>

                  <div className="mt-4 space-y-3">
                    {chapters.map((chapter) => (
                      <a
                        key={chapter.number}
                        href={`#${chapter.number}`}
                        className="block text-sm text-black/55 transition hover:text-black"
                      >
                        {chapter.number} — {chapter.title}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-[#24231f] p-5 text-white">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                    Keep exploring
                  </p>

                  <p className="mt-3 font-display text-2xl leading-tight">
                    There is always another story.
                  </p>

                  <a
                    href="/pages/app/explore/index.html"
                    className="mt-5 inline-block text-sm text-white/70 transition hover:text-white"
                  >
                    Explore artworks →
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </article>
      </main>
    </div>
  );
}

export default StoryOfTheWeek;

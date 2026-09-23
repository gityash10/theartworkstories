import { ArrowDown, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";

import heroCollage from "../../../assets/images/story/hero-collage.jpg";
import journeyCollage from "../../../assets/images/story/journey-collage.jpg";
import pearlPortrait from "../../../assets/images/story/pearl-portrait.jpg";
import storyMosaic from "../../../assets/images/story/story-mosaic.jpg";
import coverforfour from "../../../assets/images/story/coverforfour.jpg";

import { Button } from "@/components/ui/button";

const chapters = [
  {
    title: "Why Art?",
    image: pearlPortrait,
    position: "center",
  },
  {
    title: "Bigger Than Art",
    image: storyMosaic,
    position: "12% center",
  },
  {
    title: "The Invisible Part",
    image: storyMosaic,
    position: "31% center",
  },
  {
    title: "A World Without Art",
    image: coverforfour,
    position: "44% center",
  },
  {
    title: "The Story",
    image: storyMosaic,
    position: "57% center",
  },
  {
    title: "Why We Exist",
    image: storyMosaic,
    position: "70% center",
  },
  {
    title: "For People Who Care",
    image: storyMosaic,
    position: "84% center",
  },
  {
    title: "Every Art Has a Story",
    image: storyMosaic,
    position: "98% center",
  },
] as const;

const chapterCopy = [
  {
    statement: "Why have humans always felt the need to create?",
    story:
      "Before we knew how to write history, we were already making art. We painted on walls, carved figures from stone, turned rhythm into music, and passed stories from one generation to another. Art was never simply decoration. It was one of the earliest ways we made sense of ourselves and the world around us.",
    emphasis:
      "We didn't create art because we had everything figured out. We created it because we had something to say.",
  },
  {
    statement: "Art has always been bigger than the object itself.",
    story:
      "A painting is more than pigment on a surface. A sculpture is more than stone. A song is more than sound. Behind every creation is a person, a place, a time, an emotion, or an idea. The object is what remains visible, but its meaning can travel far beyond it.",
    emphasis:
      "The artwork may be an object. The story is what makes it human.",
  },
  {
    statement:
      "The most important part of an artwork is often the part we cannot see.",
    story:
      "We can look at colours, shapes, textures and materials. But we cannot always see the memory that inspired them, the struggle behind them, or the feeling that made someone create them. Context changes the way we see. Knowing the story behind an artwork can turn something familiar into something deeply personal.",
    emphasis:
      "Sometimes, to really see an artwork, we first have to understand what we cannot see.",
  },
  {
    statement:
      "Imagine a world where nothing was created just because it mattered to someone.",
    story:
      "No songs to remember moments. No paintings to preserve memories. No stories passed between generations. No sculptures, photographs, performances, poems or designs that existed simply because someone wanted to express something. Life might still function. But something deeply human would be missing.",
    emphasis:
      "Art is not something extra we added to life. It became part of what life means.",
  },
  {
    statement: "Every artwork begins with a story.",
    story:
      "Sometimes the story belongs to the artist. Sometimes it belongs to the people, culture or moment that surrounded the work. Sometimes a story is hidden in a small detail that most people walk past. Every artwork carries traces of where it came from and why it came into existence.",
    emphasis:
      "Every artwork leaves something behind. A moment. A thought. A feeling. A story.",
  },
  {
    statement: "That is why The ArtWork Stories exists.",
    story:
      "We wanted a place where people could go beyond simply looking at an artwork. A place to discover the artist, the history, the meaning, the context and the human story behind what they see. Not to tell people what they should feel, but to give them enough of the story to begin their own conversation with the art.",
    emphasis:
      "We don't want to tell you what art means. We want to help you discover why it matters.",
  },
  {
    statement: "This is for people who stop and look twice.",
    story:
      "For the curious. For the people who wonder who made something, why they made it, what was happening around them, and what they were trying to say. For artists, students, collectors, researchers, casual observers and anyone who has ever felt something in front of an artwork without knowing exactly why.",
    emphasis:
      "You don't need to be an art expert. You only need to care enough to look.",
  },
  {
    statement: "Because every art has a story.",
    story:
      "Some stories are famous.\nSome belong to history.\nSome belong to artists whose names we all know.\nOthers belong to someone sitting alone in their bedroom, making something nobody has seen yet.\n\nSome stories took years.\nSome took five minutes.\nSome were carefully planned.\nSome happened by accident.\n\nBut every time a human being creates something and says,",
    emphasis: "",
  },
] as const;

function Story() {
  const [active, setActive] = useState(0);

  const activeChapter = chapters[active] ?? chapters[0];

  const copy = useMemo(
    () => chapterCopy[active] ?? chapterCopy[0],
    [active],
  );

  const nextChapter =
    chapters[(active + 1) % chapters.length] ?? chapters[0];

  const selectChapter = (index: number) => {
    setActive(index);

    window.setTimeout(() => {
      document.querySelector("#chapter")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 50);
  };

  return (
    <main className="story-page min-h-screen overflow-hidden bg-background text-foreground">

      {/* HERO */}
      <section className="relative mx-auto min-h-[760px] max-w-[1600px] px-5 pb-8 sm:px-8 lg:min-h-[820px] lg:px-12">
        <div
          id="top"
          className="relative grid min-h-[570px] items-center lg:grid-cols-[0.78fr_1.22fr]"
        >
          <div className="relative z-20 pt-14 lg:pt-6">
            <h1 className="max-w-[530px] font-display text-[clamp(4.3rem,8vw,8.4rem)] leading-[0.76] tracking-normal">
              <span className="block">STORY</span>
              <span className="block">OF</span>
              <em className="mt-5 block text-art">ARTWORK</em>
            </h1>

            <p className="mt-8 max-w-[290px] font-sans text-sm leading-6 text-foreground/75">
              A journey through human creativity,
              <br />
              the stories behind what we make,
              <br />
              and why it all matters.
            </p>

            <a
              href="#chapters"
              className="mt-8 inline-flex items-center gap-4 font-sans text-[10px] uppercase tracking-[0.24em] text-foreground/80"
            >
              <span className="flex size-8 items-center justify-center rounded-full border border-foreground/50">
                <ArrowDown className="size-3" />
              </span>
              Scroll to explore
            </a>
          </div>

          <img
            src={heroCollage}
            alt="Classical sculpture assembled with flowers, painted fragments, and mountain photography"
            width={1536}
            height={1024}
            className="hero-art pointer-events-none absolute -right-[31%] top-0 z-10 h-full w-[104%] object-cover object-center mix-blend-normal lg:-right-[7%] lg:w-[78%]"
          />

          <p className="hand-note absolute right-[6%] top-[18%] z-20 hidden -rotate-6 text-2xl text-foreground/70 lg:block">
            More than
            <br />
            objects.
          </p>

          <p className="hand-note absolute bottom-[14%] right-[26%] z-20 hidden rotate-3 text-xl text-foreground/70 lg:block">
            Stories
            <br />
            live here.
          </p>
        </div>
      </section>

      {/* CHAPTER STRIP */}
      <section
        id="chapters"
        className="relative z-20 mx-auto max-w-[1600px] px-4 pb-10 sm:px-8 lg:-mt-20 lg:px-12"
      >
        <div className="chapter-strip grid auto-cols-[minmax(128px,1fr)] grid-flow-col gap-2 overflow-x-auto pb-3 lg:grid-flow-row lg:grid-cols-8 lg:overflow-visible">
          {chapters.map((chapter, index) => (
            <button
              key={chapter.title}
              type="button"
              onClick={() => selectChapter(index)}
              className={`group relative h-[320px] min-w-0 overflow-hidden rounded-t-[999px] border text-left transition-all duration-500 ${
                active === index
                  ? "border-highlight shadow-[0_0_22px_var(--chapter-glow)]"
                  : "border-foreground/10 opacity-75 hover:opacity-100"
              }`}
            >
              <img
                src={chapter.image}
                alt=""
                width={index === 0 ? 1024 : 1536}
                height={index === 0 ? 1280 : 1024}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{
                  objectPosition: chapter.position,
                }}
              />

              <span className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />

              <span className="absolute inset-x-4 bottom-4 z-10 text-foreground">
                <span className="block font-sans text-[10px]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="mt-2 block font-display text-[clamp(1.35rem,1.6vw,2rem)] leading-[0.9]">
                  {chapter.title}
                </span>

                {active === index && (
                  <span className="mt-3 flex items-center gap-2 font-sans text-[9px] uppercase tracking-[0.18em]">
                    Now reading
                    <ArrowRight className="size-3" />
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ACTIVE CHAPTER */}
      <section
        id="chapter"
        className="mx-auto max-w-[1510px] px-4 sm:px-8 lg:px-12"
      >
        <article className="grid min-h-[510px] overflow-hidden rounded-[28px] bg-paper text-ink lg:grid-cols-[0.48fr_1.15fr_1.22fr]">

          {/* Chapter information */}
          <div className="flex flex-col p-8 sm:p-10 lg:p-12">
            <span className="font-sans text-xs">
              {String(active + 1).padStart(2, "0")}
            </span>

            <h2 className="mt-6 font-display text-6xl leading-[0.83] tracking-normal">
              {activeChapter.title}
            </h2>

            <span className="mt-8 h-px w-8 bg-ink/40" />

            <p className="mt-8 max-w-44 font-sans text-sm leading-5 text-ink/70">
              {copy.statement}
            </p>

            <span className="mt-auto pt-10 font-sans text-[10px] text-ink/50">
              {active + 1} / 8
            </span>
          </div>

          {/* Artwork */}
          <div className="relative min-h-[390px] overflow-hidden lg:my-8">
            <img
              key={active}
              src={activeChapter.image}
              alt={`Artwork for ${activeChapter.title}`}
              width={active === 0 ? 1024 : 1536}
              height={active === 0 ? 1280 : 1024}
              loading="lazy"
              className="h-full w-full animate-soft-in object-cover"
              style={{
                objectPosition: activeChapter.position,
              }}
            />

            <span className="hand-note absolute right-5 top-1/3 max-w-28 -rotate-6 text-xl text-paper">
              Beauty
              <br />
              has always
              <br />
              been human.
            </span>
          </div>

          {/* Story copy */}
          <div className="relative flex flex-col justify-center p-8 font-sans sm:p-10 lg:p-14">

            {active === 7 ? (
              /* =====================================================
                 CHAPTER 08 — EVERY ART HAS A STORY
                 ===================================================== */
              <>
                <div className="max-w-xl whitespace-pre-line text-sm leading-6 text-ink/65">
                  {copy.story}
                </div>

                <p className="mt-8 max-w-xl font-display text-2xl leading-tight text-ink">
                  “This is how I see the world.”
                </p>

                <p className="mt-3 max-w-xl font-display text-lg leading-tight text-ink/80">
                  there is a story <em>worth hearing.</em>
                </p>
              </>
            ) : (
              /* =====================================================
                 CHAPTERS 01–07
                 ===================================================== */
              <>
                <p className="max-w-md text-sm leading-6 text-ink/65">
                  We could have built shelters and stopped there.
                  <br />
                  We could have made food simply to eat.
                  <br />
                  We could have lived without colours, music or stories.
                </p>

                <p className="mt-6 text-sm font-bold">
                  But we didn’t.
                </p>

                <p className="mt-6 max-w-md text-sm leading-6 text-ink/65">
                  {copy.story}
                </p>

                <p className="mt-6 max-w-md font-display text-lg">
                  {copy.emphasis}
                </p>
              </>
            )}

            {/* Next chapter */}
            <Button
              variant="ghost"
              className="mt-8 w-fit gap-4 px-0 text-ink hover:bg-transparent"
              onClick={() =>
                selectChapter((active + 1) % chapters.length)
              }
            >
              Next: {nextChapter.title}
              <ArrowRight />
            </Button>

            {/* Chapter progress */}
            <div
              className="absolute right-5 top-1/2 hidden -translate-y-1/2 flex-col gap-2 lg:flex"
              aria-hidden="true"
            >
              {chapters.map((chapter, index) => (
                <span
                  key={chapter.title}
                  className={`size-1.5 rounded-full border border-ink/30 ${
                    index === active
                      ? "bg-ink"
                      : "bg-transparent"
                  }`}
                />
              ))}
            </div>
          </div>
        </article>
      </section>

      {/* FINALE */}
      <section
        id="contribute"
        className="relative mx-auto grid min-h-[520px] max-w-[1510px] items-center px-7 py-14 sm:px-12 lg:grid-cols-[0.78fr_1.22fr] lg:py-8"
      >
        <div className="relative z-10">
          <h2 className="max-w-[560px] font-display text-[clamp(3.2rem,5.5vw,6rem)] leading-[0.9] tracking-normal">
            We didn’t just
            <br />
            build a world.
            <br />
            <em>
              We made one
              <br />
              worth looking at.
            </em>
          </h2>

          <div className="mt-12 flex max-w-[440px] items-center gap-4 font-sans text-[9px] uppercase tracking-[0.25em]">
            <span>The Artwork Stories</span>
            <span className="h-px flex-1 bg-foreground/35" />
          </div>

          <p className="mt-3 font-sans text-xs text-foreground/50">
            Explore the stories. Share your story. Be part of it.
          </p>
        </div>

        <img
          src={journeyCollage}
          alt="Photographer looking toward a mountain landscape in a paper collage"
          width={1536}
          height={1024}
          loading="lazy"
          className="mt-8 h-[370px] w-full object-cover object-center lg:mt-0 lg:h-[500px]"
        />

        <Button
          asChild
          variant="outline"
          className="absolute bottom-10 right-8 z-20 rounded-full border-foreground/45 bg-transparent px-6 text-foreground hover:bg-foreground hover:text-background lg:right-16"
        >
          <a href="../signup/index.html">
            Continue the journey
            <ArrowRight />
          </a>
        </Button>
      </section>
    </main>
  );
}

export default Story;
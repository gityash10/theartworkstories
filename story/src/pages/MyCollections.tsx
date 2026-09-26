import { ArrowRight, FolderOpen, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { getCollections } from "../data/collections";
import { availableArtworks } from "../data/artworks";
import type { Collection } from "../types/collection";

const CURRENT_USER_ID = "demo-user-yash";

function getCollectionImage(collection: Collection) {
  if (collection.coverImage) {
    return collection.coverImage;
  }

  const firstArtwork = collection.artworks
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((item) =>
      availableArtworks.find(
        (artwork) => artwork.id === item.artworkId,
      ),
    )
    .find(Boolean);

  return firstArtwork?.image ?? "/assets/images/story/story-mosaic.jpg";
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default function MyCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    const allCollections = getCollections();
    const ownedCollections = allCollections.filter(
      (collection) => collection.ownerId === CURRENT_USER_ID,
    );

    setCollections(ownedCollections);
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f1e8] text-[#191816]">
      <header className="border-b border-black/10">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-5 lg:px-10">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-black/45">
              Your archive
            </p>
            <h1 className="mt-2 font-serif text-4xl sm:text-5xl">
              My Collections
            </h1>
          </div>

          <a
            href="../create-collection/index.html"
            className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-sm text-white transition hover:bg-black/80"
          >
            <Plus size={16} />
            Create Collection
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-[1500px] px-5 py-10 lg:px-10 lg:py-14">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-black/40">
              Personal workspace
            </p>
            <h2 className="mt-2 max-w-xl font-serif text-3xl sm:text-4xl">
              Your personal archive of artworks, ideas, and stories.
            </h2>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-2 text-sm text-black/70">
            <FolderOpen size={16} />
            {collections.length} created
          </div>
        </div>

        {collections.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-black/20 bg-white/30 px-6 py-20 text-center shadow-[inset_0_0_0_1px_rgba(0,0,0,0.02)]">
            <h2 className="font-serif text-3xl">You haven't created a collection yet.</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-black/60">
              Build a themed archive of artworks and stories that feels like your own editorial space.
            </p>
            <a
              href="../create-collection/index.html"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm text-white"
            >
              Create your first collection
              <ArrowRight size={16} />
            </a>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {collections.map((collection) => (
              <article
                key={collection.id}
                className="group overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[1.35] overflow-hidden bg-[#ded5c6]">
                  <img
                    src={getCollectionImage(collection)}
                    alt={collection.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em]">
                    {collection.visibility}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-2xl leading-tight text-black">
                        {collection.title}
                      </h3>
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-black/45">
                        Created by you
                      </p>
                    </div>
                    <a
                      href={`../collection/index.html?id=${encodeURIComponent(collection.id)}`}
                      className="inline-flex items-center rounded-full border border-black/10 px-3 py-2 text-xs text-black/70 transition hover:bg-black hover:text-white"
                    >
                      Open
                    </a>
                  </div>

                  {collection.description && (
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-black/60">
                      {collection.description}
                    </p>
                  )}

                  <div className="mt-5 space-y-2 border-t border-black/10 pt-4 text-xs text-black/55">
                    <div className="flex items-center justify-between">
                      <span>{collection.artworks.length} artworks</span>
                      <span>{collection.tags.length} tags</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{collection.visibility}</span>
                      <span>{formatDate(collection.updatedAt)}</span>
                    </div>
                  </div>

                  <a
                    href={`../collection/index.html?id=${encodeURIComponent(collection.id)}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-black underline-offset-4 hover:underline"
                  >
                    View collection
                    <ArrowRight size={16} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

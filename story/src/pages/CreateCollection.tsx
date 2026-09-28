import {
  ArrowLeft,
  Check,
  ImagePlus,
  Lock,
  Plus,
  Search,
  Upload,
  Users,
  X,
} from "lucide-react";
import {
  useMemo,
  useState,
  type ChangeEvent,
} from "react";

import AppSidebar from "../components/AppSidebar";

import {
  addArtworkToCollection,
  createCollection,
} from "../data/collections";
import { availableArtworks } from "../data/artworks";


/* =========================================================
   ARTWORK DATA
   ========================================================= */

/* =========================================================
   TAGS
   ========================================================= */

const suggestedTags = [
  "Nature",
  "Portraits",
  "Architecture",
  "Vintage",
  "Minimal",
  "Emotions",
  "Photography",
  "Painting",
  "Travel",
  "Abstract",
];


/* =========================================================
   COMPONENT
   ========================================================= */

function CreateCollection() {

  /* -------------------------------------------------------
     BASIC COLLECTION STATE
     ------------------------------------------------------- */

  const [title, setTitle] = useState("");

  const [description, setDescription] =
    useState("");

  const [visibility, setVisibility] =
    useState<"public" | "private">("public");


  /* -------------------------------------------------------
     ARTWORK STATE
     ------------------------------------------------------- */

  const [selectedArtworks, setSelectedArtworks] =
    useState<string[]>([
      "himalayan-dawn",
      "flowers",
    ]);


  /* -------------------------------------------------------
     TAG STATE
     ------------------------------------------------------- */

  const [selectedTags, setSelectedTags] =
    useState<string[]>([]);


  /* -------------------------------------------------------
     COVER
     ------------------------------------------------------- */

  const [coverImage, setCoverImage] =
    useState<string | null>(
      "/assets/images/artworks/starry-night.png",
    );


  /* -------------------------------------------------------
     ARTWORK PICKER
     ------------------------------------------------------- */

  const [showArtworkPicker, setShowArtworkPicker] =
    useState(false);

  const [search, setSearch] =
    useState("");


  /* -------------------------------------------------------
     SAVE STATE
     ------------------------------------------------------- */

  const [saved, setSaved] =
    useState(false);

  const [publishing, setPublishing] =
    useState(false);


  /* =======================================================
     FILTER ARTWORKS
     ======================================================= */

  const filteredArtworks = useMemo(() => {

    const value =
      search.trim().toLowerCase();

    if (!value) {
      return availableArtworks;
    }

    return availableArtworks.filter(
      (artwork) =>
        artwork.title
          .toLowerCase()
          .includes(value) ||
        artwork.artist
          .toLowerCase()
          .includes(value),
    );

  }, [search]);


  /* =======================================================
     SELECTED ARTWORK OBJECTS
     ======================================================= */

  const selectedArtworkObjects =
    availableArtworks.filter(
      (artwork) =>
        selectedArtworks.includes(
          artwork.id,
        ),
    );


  /* =======================================================
     TOGGLE ARTWORK
     ======================================================= */

  const toggleArtwork = (
    artworkId: string,
  ) => {

    setSelectedArtworks((current) => {

      if (current.includes(artworkId)) {

        return current.filter(
          (id) => id !== artworkId,
        );

      }

      return [
        ...current,
        artworkId,
      ];

    });

  };


  /* =======================================================
     REMOVE ARTWORK
     ======================================================= */

  const removeArtwork = (
    artworkId: string,
  ) => {

    setSelectedArtworks((current) =>
      current.filter(
        (id) => id !== artworkId,
      ),
    );

  };


  /* =======================================================
     TOGGLE TAG
     ======================================================= */

  const toggleTag = (
    tag: string,
  ) => {

    setSelectedTags((current) => {

      if (current.includes(tag)) {

        return current.filter(
          (item) => item !== tag,
        );

      }

      return [
        ...current,
        tag,
      ];

    });

  };


  /* =======================================================
     COVER UPLOAD
     ======================================================= */

  const handleCoverUpload = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const url =
      URL.createObjectURL(file);

    setCoverImage(url);

  };


  /* =======================================================
     SAVE DRAFT
     ======================================================= */

  const saveDraft = () => {

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2500);

  };


  /* =======================================================
     PUBLISH COLLECTION
     ======================================================= */

  const publishCollection = () => {

    if (publishing) {
      return;
    }


    /* -----------------------------------------------------
       VALIDATE TITLE
       ----------------------------------------------------- */

    if (!title.trim()) {

      window.alert(
        "Please give your collection a name first.",
      );

      return;
    }


    /* -----------------------------------------------------
       VALIDATE ARTWORKS
       ----------------------------------------------------- */

    if (selectedArtworks.length === 0) {

      window.alert(
        "Add at least one artwork to your collection.",
      );

      return;
    }


    /* -----------------------------------------------------
       START PUBLISHING
       ----------------------------------------------------- */

    setPublishing(true);


    try {

      /* ---------------------------------------------------
         CREATE COLLECTION
         --------------------------------------------------- */

      const collection =
        createCollection({
          title: title.trim(),

          description:
            description.trim(),

          coverImage,

          visibility,

          tags: selectedTags,
        });


      /* ---------------------------------------------------
         ADD SELECTED ARTWORKS
         --------------------------------------------------- */

      selectedArtworks.forEach(
        (artworkId) => {

          addArtworkToCollection(
            collection.id,
            artworkId,
          );

        },
      );


      /* ---------------------------------------------------
         OPEN COLLECTION PAGE
         --------------------------------------------------- */

      window.location.href =
        `../collection/index.html?id=${encodeURIComponent(
          collection.id,
        )}`;

    } catch (error) {

      console.error(
        "Failed to create collection:",
        error,
      );

      window.alert(
        "Something went wrong while creating your collection. Please try again.",
      );

      setPublishing(false);

    }

  };


  /* =======================================================
     RENDER
     ======================================================= */

  return (

    <div className="min-h-screen bg-[#f4eee2] text-[#211f1b]">

      <AppSidebar active="collections" />



      {/* ===================================================
          TOP BAR
          =================================================== */}

      <header className="sticky top-0 z-50 flex h-[72px] items-center justify-between border-b border-black/10 bg-[#f4eee2]/95 px-5 backdrop-blur-md sm:px-8 lg:pl-[260px] lg:pr-12">


        {/* BACK */}

        <a
          href="../collections/index.html"
          className="flex items-center gap-3 text-sm text-black/65 transition hover:text-black"
        >

          <span className="flex size-8 items-center justify-center rounded-full border border-black/15">

            <ArrowLeft className="size-4" />

          </span>

          <span className="hidden sm:inline">
            Back to Collections
          </span>

        </a>


        {/* CENTER TITLE */}

        <div className="absolute left-1/2 -translate-x-1/2 text-center">

          <p className="hidden text-[9px] uppercase tracking-[0.25em] text-black/40 sm:block">
            The ArtWork Stories
          </p>

          <h1 className="font-display text-lg">
            Create Collection
          </h1>

        </div>


        {/* ACTIONS */}

        <div className="flex items-center gap-2 sm:gap-3">

          <button
            type="button"
            onClick={saveDraft}
            className="rounded-full border border-black/15 px-4 py-2 text-xs transition hover:bg-black/[0.04] sm:px-5"
          >

            {saved
              ? "Saved"
              : "Save Draft"}

          </button>


          <button
            type="button"
            onClick={publishCollection}
            disabled={publishing}
            className="rounded-full bg-[#24231f] px-4 py-2 text-xs text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50 sm:px-5"
          >

            {publishing
              ? "Publishing..."
              : "Publish"}

          </button>

        </div>

      </header>


      {/* ===================================================
          MAIN
          =================================================== */}

      <main className="mx-auto max-w-[1450px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">


        <div className="grid gap-10 xl:grid-cols-[minmax(0,0.92fr)_minmax(500px,1.08fr)]">


          {/* =================================================
              LEFT — DETAILS
              ================================================= */}

          <section>


            {/* INTRO */}

            <div className="mb-8">

              <p className="text-[10px] uppercase tracking-[0.26em] text-black/40">
                01 — Collection details
              </p>

              <h2 className="mt-3 font-display text-[clamp(2.8rem,5vw,5rem)] leading-[0.9]">

                Give your
                <br />

                collection a
                <br />

                <em>personality.</em>

              </h2>

              <p className="mt-5 max-w-[500px] text-sm leading-6 text-black/55">

                A collection is more than a group
                of artworks. Give people a reason
                to explore it.

              </p>

            </div>


            {/* TITLE */}

            <div className="border-b border-black/15 py-5">

              <label
                htmlFor="collection-title"
                className="block text-[10px] uppercase tracking-[0.22em] text-black/40"
              >
                Collection name
              </label>

              <input
                id="collection-title"
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value,
                  )
                }
                placeholder="e.g. Quiet Places"
                maxLength={80}
                className="mt-3 w-full bg-transparent font-display text-3xl outline-none placeholder:text-black/20 sm:text-4xl"
              />

              <div className="mt-2 text-right text-[10px] text-black/30">
                {title.length}/80
              </div>

            </div>


            {/* DESCRIPTION */}

            <div className="border-b border-black/15 py-5">

              <label
                htmlFor="collection-description"
                className="block text-[10px] uppercase tracking-[0.22em] text-black/40"
              >
                Description
              </label>

              <textarea
                id="collection-description"
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value,
                  )
                }
                rows={4}
                maxLength={500}
                placeholder="What connects these artworks?"
                className="mt-3 w-full resize-none bg-transparent text-sm leading-6 outline-none placeholder:text-black/25"
              />

              <div className="text-right text-[10px] text-black/30">
                {description.length}/500
              </div>

            </div>


            {/* VISIBILITY */}

            <div className="border-b border-black/15 py-6">

              <p className="text-[10px] uppercase tracking-[0.22em] text-black/40">
                Who can see this?
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">


                {/* PUBLIC */}

                <button
                  type="button"
                  onClick={() =>
                    setVisibility("public")
                  }
                  className={`rounded-xl border p-4 text-left transition ${
                    visibility === "public"
                      ? "border-black bg-white/40"
                      : "border-black/10 hover:bg-white/30"
                  }`}
                >

                  <div className="flex items-start justify-between">

                    <div className="flex size-9 items-center justify-center rounded-full bg-black/[0.05]">

                      <Users className="size-4" />

                    </div>

                    {visibility ===
                      "public" && (

                      <span className="flex size-5 items-center justify-center rounded-full bg-[#24231f] text-white">

                        <Check className="size-3" />

                      </span>

                    )}

                  </div>

                  <p className="mt-4 text-sm font-medium">
                    Public
                  </p>

                  <p className="mt-1 text-xs leading-5 text-black/45">
                    Anyone can discover and view
                    this collection.
                  </p>

                </button>


                {/* PRIVATE */}

                <button
                  type="button"
                  onClick={() =>
                    setVisibility("private")
                  }
                  className={`rounded-xl border p-4 text-left transition ${
                    visibility === "private"
                      ? "border-black bg-white/40"
                      : "border-black/10 hover:bg-white/30"
                  }`}
                >

                  <div className="flex items-start justify-between">

                    <div className="flex size-9 items-center justify-center rounded-full bg-black/[0.05]">

                      <Lock className="size-4" />

                    </div>

                    {visibility ===
                      "private" && (

                      <span className="flex size-5 items-center justify-center rounded-full bg-[#24231f] text-white">

                        <Check className="size-3" />

                      </span>

                    )}

                  </div>

                  <p className="mt-4 text-sm font-medium">
                    Private
                  </p>

                  <p className="mt-1 text-xs leading-5 text-black/45">
                    Only you can see this
                    collection.
                  </p>

                </button>

              </div>

            </div>


            {/* TAGS */}

            <div className="py-6">

              <p className="text-[10px] uppercase tracking-[0.22em] text-black/40">
                Add some tags
              </p>

              <p className="mt-2 text-xs text-black/45">
                Help people discover your collection.
              </p>


              <div className="mt-4 flex flex-wrap gap-2">

                {suggestedTags.map(
                  (tag) => {

                    const active =
                      selectedTags.includes(
                        tag,
                      );

                    return (

                      <button
                        key={tag}
                        type="button"
                        onClick={() =>
                          toggleTag(tag)
                        }
                        className={`rounded-full px-3.5 py-2 text-xs transition ${
                          active
                            ? "bg-[#24231f] text-white"
                            : "bg-black/[0.045] text-black/60 hover:bg-black/[0.09]"
                        }`}
                      >

                        {active && (
                          <span className="mr-1">
                            ✓
                          </span>
                        )}

                        {tag}

                      </button>

                    );

                  },
                )}

              </div>

            </div>

          </section>


          {/* =================================================
              RIGHT — PREVIEW
              ================================================= */}

          <section>


            <p className="text-[10px] uppercase tracking-[0.26em] text-black/40">
              Collection preview
            </p>


            {/* COVER */}

            <div className="relative mt-4 aspect-[1.35] overflow-hidden rounded-2xl bg-[#ded5c6]">


              {coverImage ? (

                <img
                  src={coverImage}
                  alt="Collection cover"
                  className="h-full w-full object-cover"
                />

              ) : (

                <div className="flex h-full flex-col items-center justify-center text-center text-black/35">

                  <ImagePlus className="size-10" />

                  <p className="mt-3 text-sm">
                    Add a cover image
                  </p>

                </div>

              )}


              {/* GRADIENT */}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />


              {/* TEXT */}

              <div className="absolute bottom-7 left-7 right-7 text-white sm:bottom-9 sm:left-9 sm:right-9">

                <p className="text-[9px] uppercase tracking-[0.25em] text-white/60">
                  Collection
                </p>

                <h2 className="mt-2 font-display text-3xl leading-none sm:text-5xl">

                  {title ||
                    "Your Collection"}

                </h2>

                <p className="mt-3 max-w-[500px] text-xs leading-5 text-white/65 sm:text-sm">

                  {description ||
                    "A place for artworks that belong together."}

                </p>

              </div>


              {/* CHANGE COVER */}

              <label className="absolute right-5 top-5 flex cursor-pointer items-center gap-2 rounded-full bg-white/90 px-4 py-2.5 text-xs text-black shadow-lg backdrop-blur transition hover:bg-white">

                <Upload className="size-3.5" />

                Change cover

                <input
                  type="file"
                  accept="image/*"
                  onChange={
                    handleCoverUpload
                  }
                  className="hidden"
                />

              </label>

            </div>


            {/* COVER INFO */}

            <div className="mt-3 flex items-center justify-between text-[11px] text-black/40">

              <span>
                Recommended: landscape image
              </span>

              <span>
                JPG, PNG
              </span>

            </div>


            {/* =================================================
                SELECTED ARTWORKS
                ================================================= */}

            <div className="mt-10">


              <div className="flex items-end justify-between">

                <div>

                  <p className="text-[10px] uppercase tracking-[0.22em] text-black/40">
                    02 — Artworks
                  </p>

                  <h2 className="mt-2 font-display text-3xl">
                    Your collection
                  </h2>

                </div>


                <span className="text-xs text-black/45">
                  {selectedArtworks.length} selected
                </span>

              </div>


              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">


                {/* SELECTED ARTWORKS */}

                {selectedArtworkObjects.map(
                  (artwork) => (

                    <article
                      key={artwork.id}
                      className="group relative overflow-hidden rounded-xl bg-black/5"
                    >

                      <div className="aspect-square">

                        <img
                          src={artwork.image}
                          alt={artwork.title}
                          className="h-full w-full object-cover"
                        />

                      </div>


                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-10 text-white">

                        <p className="truncate text-xs font-medium">
                          {artwork.title}
                        </p>

                        <p className="mt-0.5 truncate text-[10px] text-white/60">
                          {artwork.artist}
                        </p>

                      </div>


                      <button
                        type="button"
                        onClick={() =>
                          removeArtwork(
                            artwork.id,
                          )
                        }
                        aria-label={`Remove ${artwork.title}`}
                        className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/60 text-white opacity-100 backdrop-blur transition sm:opacity-0 sm:group-hover:opacity-100"
                      >

                        <X className="size-3.5" />

                      </button>

                    </article>

                  ),
                )}


                {/* ADD ARTWORK */}

                <button
                  type="button"
                  onClick={() =>
                    setShowArtworkPicker(true)
                  }
                  className="flex aspect-square flex-col items-center justify-center rounded-xl border border-dashed border-black/20 bg-black/[0.025] text-black/45 transition hover:border-black/40 hover:bg-black/[0.05]"
                >

                  <span className="flex size-11 items-center justify-center rounded-full bg-black/[0.06]">

                    <Plus className="size-5" />

                  </span>

                  <span className="mt-3 text-xs">
                    Add artwork
                  </span>

                </button>

              </div>

            </div>

          </section>

        </div>


        {/* =================================================
            BOTTOM ACTIONS
            ================================================= */}

        <div className="mt-12 flex flex-col-reverse gap-3 border-t border-black/10 pt-6 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={saveDraft}
            className="rounded-full border border-black/15 px-6 py-3 text-sm transition hover:bg-black/[0.04]"
          >

            {saved
              ? "Draft Saved"
              : "Save as Draft"}

          </button>


          <button
            type="button"
            onClick={publishCollection}
            disabled={publishing}
            className="rounded-full bg-[#24231f] px-7 py-3 text-sm text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
          >

            {publishing
              ? "Publishing..."
              : "Publish Collection →"}

          </button>

        </div>

      </main>


      {/* =====================================================
          ARTWORK PICKER MODAL
          ===================================================== */}

      {showArtworkPicker && (

        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/45 p-0 backdrop-blur-sm sm:items-center sm:p-6">


          <div className="flex max-h-[92vh] w-full max-w-[1000px] flex-col overflow-hidden rounded-t-2xl bg-[#f4eee2] shadow-2xl sm:rounded-2xl">


            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 sm:px-7">

              <div>

                <p className="text-[9px] uppercase tracking-[0.24em] text-black/40">
                  Add to collection
                </p>

                <h2 className="mt-1 font-display text-2xl">
                  Choose artworks
                </h2>

              </div>


              <button
                type="button"
                onClick={() =>
                  setShowArtworkPicker(false)
                }
                className="flex size-9 items-center justify-center rounded-full bg-black/[0.05] transition hover:bg-black/[0.1]"
                aria-label="Close artwork picker"
              >

                <X className="size-4" />

              </button>

            </div>


            {/* SEARCH */}

            <div className="border-b border-black/10 px-5 py-4 sm:px-7">

              <div className="relative">

                <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-black/35" />

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value,
                    )
                  }
                  placeholder="Search your artworks..."
                  className="h-11 w-full rounded-xl bg-black/[0.045] pl-11 pr-4 text-sm outline-none placeholder:text-black/35 focus:bg-white/50"
                />

              </div>

            </div>


            {/* ARTWORK GRID */}

            <div className="overflow-y-auto p-5 sm:p-7">

              {filteredArtworks.length > 0 ? (

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

                  {filteredArtworks.map(
                    (artwork) => {

                      const selected =
                        selectedArtworks.includes(
                          artwork.id,
                        );

                      return (

                        <button
                          key={artwork.id}
                          type="button"
                          onClick={() =>
                            toggleArtwork(
                              artwork.id,
                            )
                          }
                          className={`group relative overflow-hidden rounded-xl text-left transition ${
                            selected
                              ? "ring-2 ring-[#24231f] ring-offset-2 ring-offset-[#f4eee2]"
                              : ""
                          }`}
                        >

                          <div className="aspect-square overflow-hidden rounded-xl">

                            <img
                              src={artwork.image}
                              alt={artwork.title}
                              className={`h-full w-full object-cover transition duration-500 ${
                                selected
                                  ? "scale-105"
                                  : "group-hover:scale-105"
                              }`}
                            />

                          </div>


                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-3 pt-12 text-white">

                            <p className="truncate text-xs font-medium">
                              {artwork.title}
                            </p>

                            <p className="mt-0.5 truncate text-[10px] text-white/60">
                              {artwork.artist}
                            </p>

                          </div>


                          {selected && (

                            <span className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-[#24231f] text-white shadow-lg">

                              <Check className="size-4" />

                            </span>

                          )}

                        </button>

                      );

                    },
                  )}

                </div>

              ) : (

                <div className="py-16 text-center">

                  <Search className="mx-auto size-8 text-black/25" />

                  <p className="mt-4 font-display text-2xl">
                    No artworks found
                  </p>

                  <p className="mt-2 text-xs text-black/45">
                    Try another search.
                  </p>

                </div>

              )}

            </div>


            {/* MODAL FOOTER */}

            <div className="flex items-center justify-between border-t border-black/10 px-5 py-4 sm:px-7">

              <p className="text-xs text-black/45">

                {selectedArtworks.length} artwork
                {selectedArtworks.length === 1
                  ? ""
                  : "s"} selected

              </p>


              <button
                type="button"
                onClick={() =>
                  setShowArtworkPicker(false)
                }
                className="rounded-full bg-[#24231f] px-6 py-2.5 text-xs text-white transition hover:bg-black"
              >
                Done
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}

export default CreateCollection;
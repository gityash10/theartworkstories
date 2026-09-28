import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Bell,
  Bookmark,
  CalendarDays,
  Camera,
  Check,
  Compass,
  Edit3,
  Eye,
  Globe,
  Heart,
  Link as LinkIcon,
  MapPin,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Plus,
  Search,
  Settings,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";

type Tab = "Overview" | "Artworks" | "Collections" | "Liked" | "Activity";

const recentArtworks = [
  {
    id: "artwork-1",
    title: "The Persistence of Memory",
    artist: "Salvador Dalí",
    year: "1931",
    image: "/assets/images/artworks/starry-night.png",
  },
  {
    id: "artwork-2",
    title: "Girl with a Pearl Earring",
    artist: "Johannes Vermeer",
    year: "1665",
    image: "/assets/images/artworks/sunflower-field.png",
  },
  {
    id: "artwork-3",
    title: "The Starry Night",
    artist: "Vincent van Gogh",
    year: "1889",
    image: "/assets/images/artworks/sample 3.jpg",
  },
];

const myCollections = [
  {
    id: "collection-1",
    title: "Art That Makes Me Think",
    description: "Works that stay with me long after I see them.",
    count: 18,
    image: "/assets/images/artworks/the-thinker.png",
  },
  {
    id: "collection-2",
    title: "Quiet Moments",
    description: "Soft, intimate works for slower days.",
    count: 12,
    image: "/assets/images/artworks/starry-night.png",
  },
  {
    id: "collection-3",
    title: "Art & Memory",
    description: "Works connected to memory, time and identity.",
    count: 9,
    image: "/assets/images/artworks/surreal-hand.png",
  },
];

const likedArtworks = [
  {
    id: "liked-1",
    title: "The Great Wave off Kanagawa",
    artist: "Katsushika Hokusai",
    image: "/assets/images/artworks/great-wave.jpg",
  },
  {
    id: "liked-2",
    title: "Composition VIII",
    artist: "Wassily Kandinsky",
    image: "/assets/images/artworks/composition-viii.jpg",
  },
  {
    id: "liked-3",
    title: "Nighthawks",
    artist: "Edward Hopper",
    image: "/assets/images/artworks/nighthawks.jpg",
  },
];

const activities = [
  {
    icon: Heart,
    text: "You liked",
    title: "The Great Wave off Kanagawa",
    time: "2 hours ago",
  },
  {
    icon: Bookmark,
    text: "You added an artwork to",
    title: "Art That Makes Me Think",
    time: "Yesterday",
  },
  {
    icon: Plus,
    text: "You created",
    title: "Quiet Moments",
    time: "3 days ago",
  },
  {
    icon: Users,
    text: "You joined the community",
    title: "The ArtWork Stories",
    time: "1 week ago",
  },
];

const tabs: Tab[] = [
  "Overview",
  "Artworks",
  "Collections",
  "Liked",
  "Activity",
];

function SidebarLink({
  href,
  icon: Icon,
  label,
  active = false,
  collapsed,
  onClick,
}: {
  href: string;
  icon: typeof Compass;
  label: string;
  active?: boolean;
  collapsed: boolean;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      title={collapsed ? label : undefined}
      aria-current={active ? "page" : undefined}
      className={`flex items-center rounded-md py-3 text-sm transition ${
        active
          ? "bg-white/10 text-white"
          : "text-white/60 hover:bg-white/5 hover:text-white"
      } ${collapsed ? "justify-center px-0" : "gap-4 px-5"}`}
    >
      <Icon className="size-5 shrink-0" />

      {!collapsed && (
        <span className="truncate">
          {label}
        </span>
      )}
    </a>
  );
}

function ProfilePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [coverImage, setCoverImage] = useState("/assets/images/story/hero-collage.jpg");
  const [avatarImage, setAvatarImage] = useState("");
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const [savedProfile, setSavedProfile] = useState<{
    name: string;
    username: string;
    bio: string;
    location: string;
    website: string;
    joinedDate: string;
  } | null>(null);

  /*
   * Load the saved profile (same source as the Edit Profile page)
   * so the hero reflects what the user saved there.
   */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(
        "the-artwork-stories-profile",
      );

      if (!stored) {
        return;
      }

      const parsed = JSON.parse(stored);

      setSavedProfile({
        name:
          typeof parsed.name === "string"
            ? parsed.name
            : "Yash Jain",

        username:
          typeof parsed.username === "string"
            ? parsed.username
            : "@yashjain",

        bio:
          typeof parsed.bio === "string"
            ? parsed.bio
            : "Exploring the stories, ideas and emotions hidden inside great works of art.",

        location:
          typeof parsed.location === "string"
            ? parsed.location
            : "India",

        website:
          typeof parsed.website === "string"
            ? parsed.website.trim()
            : "",

        joinedDate:
          typeof parsed.joinedDate === "string"
            ? parsed.joinedDate
            : "2026",
      });
    } catch {
      /*
       * Ignore malformed localStorage data
       * and keep the defaults.
       */
    }
  }, []);

  useEffect(() => {
    return () => {
      if (coverImage.startsWith("blob:")) {
        URL.revokeObjectURL(coverImage);
      }
    };
  }, [coverImage]);

  useEffect(() => {
    return () => {
      if (avatarImage.startsWith("blob:")) {
        URL.revokeObjectURL(avatarImage);
      }
    };
  }, [avatarImage]);

  const handleCoverChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file || !file.type.startsWith("image/")) {
      event.target.value = "";
      return;
    }

    setCoverImage(URL.createObjectURL(file));
    event.target.value = "";
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file || !file.type.startsWith("image/")) {
      event.target.value = "";
      return;
    }

    setAvatarImage(URL.createObjectURL(file));
    event.target.value = "";
  };

  /*
   * Build a safe href for the saved website value:
   * full URLs pass through, bare domains get https://.
   */
  const savedWebsite = savedProfile?.website ?? "";

  const websiteHref = savedWebsite
    ? /^https?:\/\//i.test(savedWebsite)
      ? savedWebsite
      : `https://${savedWebsite}`
    : "";

  const handleShareArtwork = () => {
    window.location.href = "../create/index.html";
  };

  return (
    <div className="min-h-screen bg-[#f5f2ea] text-[#1d1b1a]">

      {/* =========================================================
          DESKTOP SIDEBAR
      ========================================================= */}

      <aside
        className={`fixed left-0 top-0 z-50 hidden h-screen flex-col bg-[#1d1c19] text-[#f5efe4] transition-all duration-300 lg:flex ${
          sidebarCollapsed ? "w-[72px]" : "w-[220px]"
        }`}
      >
        <div
          className={`border-b border-white/10 py-7 transition-all ${sidebarCollapsed ? "px-3" : "px-7"}`}
        >
          <a
            href="../../home/index.html"
            className={`block font-display leading-[0.95] ${sidebarCollapsed ? "text-center text-[18px]" : "text-[24px]"}`}
          >
            {sidebarCollapsed ? "TAS" : <>The ArtWork<br />Stories</>}
          </a>
        </div>

        <button
          type="button"
          onClick={() => setSidebarCollapsed((value) => !value)}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`absolute -right-3 top-[78px] flex size-7 items-center justify-center rounded-full border border-white/10 bg-[#24231f] text-white shadow-lg transition hover:scale-105 ${sidebarCollapsed ? "rotate-180" : ""}`}
        >
          {sidebarCollapsed ? <PanelLeftOpen className="size-3.5" /> : <PanelLeftClose className="size-3.5" />}
        </button>

        <nav className="mt-8 flex flex-col gap-2 px-3">
          <SidebarLink href="../discover/index.html" icon={Compass} label="Discover" collapsed={sidebarCollapsed} />
          <SidebarLink href="../collections/index.html" icon={Bookmark} label="Collections" collapsed={sidebarCollapsed} />
          <div className="my-2 h-px bg-white/10" />
          <SidebarLink href="../create/index.html?from=profile" icon={Plus} label="Share an Artwork" collapsed={sidebarCollapsed} />
          <div className="my-2 h-px bg-white/10" />
          <SidebarLink href="../profile/index.html" icon={User} label="Profile" active collapsed={sidebarCollapsed} />
          <SidebarLink href="/pages/app/settings/account/index.html" icon={Settings} label="Settings" collapsed={sidebarCollapsed} />
        </nav>

        {!sidebarCollapsed && (
          <div className="mt-auto px-7 pb-8">
            <div className="mb-5 h-px bg-white/10" />
            <p className="font-display text-sm leading-6 text-white/55">“Art is a conversation<br />across time.”</p>
            <div className="mt-5 h-px w-8 bg-white/40" />
          </div>
        )}
      </aside>

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}

      <main
        className={`min-h-screen transition-all duration-300 ${
          sidebarCollapsed
            ? "lg:ml-[72px]"
            : "lg:ml-[220px]"
        }`}
      >

        {/* =======================================================
            TOP HEADER
        ======================================================= */}

        <header className="sticky top-0 z-30 border-b border-black/5 bg-[#f5f2ea]/95 backdrop-blur-xl">
          <div className="flex h-[76px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">

            {/* Mobile menu */}
            <div className="relative lg:hidden">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen((value) => !value)}
                aria-label={mobileSidebarOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileSidebarOpen}
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#1d1b1a] text-white"
              >
                {mobileSidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
              {mobileSidebarOpen && (
                <nav className="absolute left-0 top-12 z-50 w-56 overflow-hidden rounded-xl border border-black/10 bg-[#24231f] p-2 text-white shadow-xl">
                  <SidebarLink href="../discover/index.html" icon={Compass} label="Discover" collapsed={false} onClick={() => setMobileSidebarOpen(false)} />
                  <SidebarLink href="../collections/index.html" icon={Bookmark} label="Collections" collapsed={false} onClick={() => setMobileSidebarOpen(false)} />
                  <SidebarLink href="../create/index.html?from=profile" icon={Plus} label="Share an Artwork" collapsed={false} onClick={() => setMobileSidebarOpen(false)} />
                  <SidebarLink href="../profile/index.html" icon={User} label="Profile" active collapsed={false} onClick={() => setMobileSidebarOpen(false)} />
                  <SidebarLink href="/pages/app/settings/account/index.html" icon={Settings} label="Settings" collapsed={false} onClick={() => setMobileSidebarOpen(false)} />
                </nav>
              )}
            </div>

            {/* Search */}
            <div className="relative max-w-[520px] flex-1">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-black/40" />

              <input
                type="search"
                placeholder="Search artworks, artists, stories..."
                className="h-11 w-full rounded-full border border-black/10 bg-white/55 pl-11 pr-5 text-sm text-[#1d1b1a] outline-none transition placeholder:text-black/40 focus:border-black/20 focus:bg-white"
              />
            </div>

            {/* Header Right */}
            <div className="hidden items-center gap-3 sm:flex">
              <button
                type="button"
                className="flex size-10 items-center justify-center rounded-full border border-black/10 bg-white/50 text-[#1d1b1a] transition hover:bg-white"
                aria-label="Notifications"
              >
                <BellIcon />
              </button>

              <div className="flex size-10 items-center justify-center rounded-full bg-[#d4b99e] text-xs font-semibold">
                Y
              </div>
            </div>
          </div>
        </header>

        {/* =======================================================
            PAGE CONTENT
        ======================================================= */}

        <div className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 lg:px-10 lg:py-10">

          {/* =====================================================
              PROFILE HERO
          ===================================================== */}

          <section className="overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-[0_20px_50px_rgba(21,17,13,0.06)]">

            {/* Cover */}
            <div className="relative h-[210px] overflow-hidden bg-[#d9c9b7] sm:h-[250px]">

              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverChange}
              />

              <img
                src={coverImage}
                alt="Profile cover"
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="absolute right-5 top-5 rounded-full border border-white/40 bg-black/25 px-4 py-2 text-xs font-medium text-white backdrop-blur-md transition hover:bg-black/40"
              >
                Change Cover
              </button>
            </div>

            {/* Profile Information */}
            <div className="relative px-5 pb-7 sm:px-8 lg:px-10">

              {/* Avatar */}
              <div className="relative -mt-16 flex size-[112px] items-center justify-center overflow-hidden rounded-full border-[6px] border-white bg-[#d4b99e] text-3xl font-semibold text-[#1d1b1a] shadow-lg">
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />

                {avatarImage ? (
                  <img
                    src={avatarImage}
                    alt="Profile avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-semibold">Y</span>
                )}

                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute bottom-1 right-1 flex size-8 items-center justify-center rounded-full border border-white/80 bg-[#1d1b1a]/80 text-white shadow-md backdrop-blur-sm transition hover:bg-[#1d1b1a]"
                  aria-label="Change profile image"
                  title="Change profile image"
                >
                  <Edit3 className="size-3.5" />
                </button>
              </div>

              <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

                {/* Identity */}
                <div className="max-w-[720px]">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h1 className="font-display text-[42px] leading-none tracking-[-0.03em] text-[#1d1b1a] sm:text-[50px]">
                      {savedProfile?.name ?? "Yash Jain"}
                    </h1>

                    <span className="text-sm text-black/45">
                      {savedProfile?.username ?? "@yashjain"}
                    </span>
                  </div>

                  <p className="mt-4 max-w-[680px] text-[15px] leading-7 text-[#2d2925]/70">
                    {savedProfile?.bio ??
                      "Exploring the stories, ideas and emotions hidden inside great works of art."}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#2d2925]/55">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-3.5" />
                      {savedProfile?.location ?? "India"}
                    </span>

                    {savedWebsite && (
                      <a
                        href={websiteHref}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex max-w-[260px] items-center gap-1.5 transition hover:text-[#1d1b1a]"
                      >
                        <LinkIcon className="size-3.5 shrink-0" />

                        <span className="min-w-0 truncate">
                          {savedWebsite}
                        </span>
                      </a>
                    )}

                    <span>
                      Joined {savedProfile?.joinedDate ?? "2026"}
                    </span>
                  </div>
                </div>

                {/* Edit Profile */}
                <a
                  href="./edit/index.html"
                  className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#1d1b1a] px-5 text-sm font-medium text-white transition hover:bg-[#302d2a]"
                >
                  <Edit3 className="size-4" />
                  Edit Profile
                </a>
              </div>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-2 border-t border-black/8 pt-6 sm:grid-cols-4">

                <Stat
                  value="24"
                  label="Artworks"
                />

                <Stat
                  value="4"
                  label="Collections"
                />

                <Stat
                  value="128"
                  label="Likes"
                />

                <Stat
                  value="240"
                  label="Followers"
                />

              </div>
            </div>
          </section>

          {/* =====================================================
              TABS
          ===================================================== */}

          <div className="mt-8 overflow-x-auto border-b border-black/10">
            <div className="flex min-w-max gap-7">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`relative pb-4 text-sm transition ${
                    activeTab === tab
                      ? "font-medium text-[#1d1b1a]"
                      : "text-[#2d2925]/50 hover:text-[#1d1b1a]"
                  }`}
                >
                  {tab}

                  {activeTab === tab && (
                    <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[#1d1b1a]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* =====================================================
              TAB CONTENT
          ===================================================== */}

          {activeTab === "Overview" && (
            <OverviewContent
              recentArtworks={recentArtworks}
              myCollections={myCollections}
              likedArtworks={likedArtworks}
              activities={activities}
              onShareArtwork={handleShareArtwork}
            />
          )}

          {activeTab === "Artworks" && (
            <ArtworksTab artworks={recentArtworks} />
          )}

          {activeTab === "Collections" && (
            <CollectionsTab collections={myCollections} />
          )}

          {activeTab === "Liked" && (
            <LikedTab artworks={likedArtworks} />
          )}

          {activeTab === "Activity" && (
            <ActivityTab activities={activities} />
          )}
        </div>
      </main>
    </div>
  );
}

/* ===============================================================
   PROFILE STAT
=============================================================== */

function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="border-r border-black/8 px-4 first:pl-0 last:border-r-0 sm:px-6">
      <p className="font-display text-2xl text-[#1d1b1a]">
        {value}
      </p>

      <p className="mt-1 text-xs text-black/45">
        {label}
      </p>
    </div>
  );
}

/* ===============================================================
   OVERVIEW
=============================================================== */

function OverviewContent({
  recentArtworks,
  myCollections,
  likedArtworks,
  activities,
  onShareArtwork,
}: {
  recentArtworks: typeof recentArtworks;
  myCollections: typeof myCollections;
  likedArtworks: typeof likedArtworks;
  activities: typeof activities;
  onShareArtwork: () => void;
}) {
  return (
    <div className="mt-9 space-y-12">

      {/* Recent Artworks */}
      <section>
        <SectionHeader
          title="Recent Artworks"
          action="View all"
          onClick={() => undefined}
        />

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recentArtworks.map((artwork) => (
            <ArtworkCard
              key={artwork.id}
              title={artwork.title}
              artist={artwork.artist}
              year={artwork.year}
              image={artwork.image}
            />
          ))}
        </div>
      </section>

      {/* Collections */}
      <section>
        <SectionHeader
          title="My Collections"
          action="View all"
          href="../my-collections/index.html"
        />

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {myCollections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
            />
          ))}
        </div>
      </section>

      {/* Liked */}
      <section>
        <SectionHeader
          title="Liked Artworks"
          action="View all"
          onClick={() => undefined}
        />

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {likedArtworks.map((artwork) => (
            <ArtworkCard
              key={artwork.id}
              title={artwork.title}
              artist={artwork.artist}
              image={artwork.image}
              liked
            />
          ))}
        </div>
      </section>

      {/* Activity */}
      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-black/40">
              Your journey
            </p>

            <h2 className="mt-2 font-display text-[34px] leading-none text-[#1d1b1a]">
              Recent Activity
            </h2>
          </div>

          <Activity className="size-5 text-black/30" />
        </div>

        <div className="mt-5 rounded-[22px] border border-black/5 bg-white p-5 sm:p-6">
          <div className="divide-y divide-black/7">
            {activities.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={`${item.title}-${index}`}
                  className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f0ebe2]">
                    <Icon className="size-4 text-[#1d1b1a]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[#2d2925]/60">
                      {item.text}
                    </p>

                    <p className="mt-0.5 truncate text-sm font-medium text-[#1d1b1a]">
                      {item.title}
                    </p>
                  </div>

                  <span className="shrink-0 text-xs text-black/35">
                    {item.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contribution CTA */}
      <section className="overflow-hidden rounded-[26px] bg-[#1d1b1a] px-6 py-8 text-white sm:px-8 sm:py-10">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-[620px]">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/40">
              Keep the stories growing
            </p>

            <h2 className="mt-3 font-display text-[34px] leading-[1.05] sm:text-[40px]">
              Share an artwork
              <br />
              that means something to you.
            </h2>

            <p className="mt-4 text-sm leading-6 text-white/55">
              Add a work, tell its story, and help someone else
              discover something worth remembering.
            </p>
          </div>

          <button
            type="button"
            onClick={onShareArtwork}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-[#1d1b1a] transition hover:bg-[#f0ebe2]"
          >
            Share an Artwork
            <ArrowRight className="size-4" />
          </button>
        </div>
      </section>
    </div>
  );
}

/* ===============================================================
   ARTWORKS TAB
=============================================================== */

function ArtworksTab({
  artworks,
}: {
  artworks: typeof recentArtworks;
}) {
  return (
    <div className="mt-9">
      <SectionIntro
        eyebrow="Your work"
        title="Artworks"
        description="The artworks and stories you've shared with the community."
      />

      <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {artworks.map((artwork) => (
          <ArtworkCard
            key={artwork.id}
            title={artwork.title}
            artist={artwork.artist}
            year={artwork.year}
            image={artwork.image}
          />
        ))}
      </div>
    </div>
  );
}

/* ===============================================================
   COLLECTIONS TAB
=============================================================== */

function CollectionsTab({
  collections,
}: {
  collections: typeof myCollections;
}) {
  return (
    <div className="mt-9">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <SectionIntro
          eyebrow="Your archive"
          title="My Collections"
          description="Organize artworks into personal groups and revisit them anytime."
        />

        <a
          href="../my-collections/index.html"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#1d1b1a] px-5 text-sm font-medium text-white transition hover:bg-[#302d2a]"
        >
          Open My Collections
          <ArrowRight className="size-4" />
        </a>
      </div>

      <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {collections.map((collection) => (
          <CollectionCard
            key={collection.id}
            collection={collection}
          />
        ))}
      </div>
    </div>
  );
}

/* ===============================================================
   LIKED TAB
=============================================================== */

function LikedTab({
  artworks,
}: {
  artworks: typeof likedArtworks;
}) {
  return (
    <div className="mt-9">
      <SectionIntro
        eyebrow="Saved inspiration"
        title="Liked Artworks"
        description="Artworks you've saved because they caught your attention."
      />

      <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {artworks.map((artwork) => (
          <ArtworkCard
            key={artwork.id}
            title={artwork.title}
            artist={artwork.artist}
            image={artwork.image}
            liked
          />
        ))}
      </div>
    </div>
  );
}

/* ===============================================================
   ACTIVITY TAB
=============================================================== */

function ActivityTab({
  activities,
}: {
  activities: typeof activities;
}) {
  return (
    <div className="mt-9 max-w-[820px]">
      <SectionIntro
        eyebrow="Your journey"
        title="Activity"
        description="A record of your recent activity across The ArtWork Stories."
      />

      <div className="mt-7 rounded-[24px] border border-black/5 bg-white p-5 sm:p-7">
        <div className="divide-y divide-black/7">
          {activities.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={`${item.title}-${index}`}
                className="flex items-center gap-4 py-5 first:pt-0 last:pb-0"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#f0ebe2]">
                  <Icon className="size-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm text-black/55">
                    {item.text}
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {item.title}
                  </p>
                </div>

                <span className="shrink-0 text-xs text-black/35">
                  {item.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ===============================================================
   SECTION HEADER
=============================================================== */

function SectionHeader({
  title,
  action,
  href,
  onClick,
}: {
  title: string;
  action: string;
  href?: string;
  onClick?: () => void;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <h2 className="font-display text-[34px] leading-none text-[#1d1b1a]">
        {title}
      </h2>

      {href ? (
        <a
          href={href}
          className="inline-flex items-center gap-1 text-sm text-[#2d2925]/55 transition hover:text-[#1d1b1a]"
        >
          {action}
          <ArrowRight className="size-3.5" />
        </a>
      ) : (
        <button
          type="button"
          onClick={onClick}
          className="inline-flex items-center gap-1 text-sm text-[#2d2925]/55 transition hover:text-[#1d1b1a]"
        >
          {action}
          <ArrowRight className="size-3.5" />
        </button>
      )}
    </div>
  );
}

/* ===============================================================
   SECTION INTRO
=============================================================== */

function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-black/40">
        {eyebrow}
      </p>

      <h2 className="mt-2 font-display text-[42px] leading-none tracking-[-0.025em] text-[#1d1b1a]">
        {title}
      </h2>

      <p className="mt-3 max-w-[620px] text-sm leading-6 text-black/50">
        {description}
      </p>
    </div>
  );
}

/* ===============================================================
   ARTWORK CARD
=============================================================== */

function ArtworkCard({
  title,
  artist,
  year,
  image,
  liked = false,
}: {
  title: string;
  artist: string;
  year?: string;
  image: string;
  liked?: boolean;
}) {
  return (
    <article className="group overflow-hidden rounded-[22px] border border-black/5 bg-white shadow-[0_10px_30px_rgba(21,17,13,0.04)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#e7dfd3]">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
        />

        {liked && (
          <div className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-white/90 backdrop-blur">
            <Heart className="size-4 fill-current text-[#1d1b1a]" />
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-display text-[24px] leading-[1.05] text-[#1d1b1a]">
          {title}
        </h3>

        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-sm text-black/50">
            {artist}
          </p>

          {year && (
            <span className="text-xs text-black/35">
              {year}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

/* ===============================================================
   COLLECTION CARD
=============================================================== */

function CollectionCard({
  collection,
}: {
  collection: (typeof myCollections)[number];
}) {
  return (
    <a
      href={`../collection/index.html?id=${collection.id}`}
      className="group overflow-hidden rounded-[22px] border border-black/5 bg-white shadow-[0_10px_30px_rgba(21,17,13,0.04)] transition hover:-translate-y-0.5"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#e7dfd3]">
        <img
          src={collection.image}
          alt={collection.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
        />

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-5 pt-14">
          <span className="text-xs text-white/75">
            {collection.count} artworks
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-display text-[25px] leading-none text-[#1d1b1a]">
          {collection.title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-black/50">
          {collection.description}
        </p>
      </div>
    </a>
  );
}

/* ===============================================================
   BELL ICON
=============================================================== */

function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-[18px]"
      aria-hidden="true"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export default ProfilePage;
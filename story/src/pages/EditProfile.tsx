import {
  ArrowLeft,
  Bell,
  Bookmark,
  CalendarDays,
  Camera,
  Check,
  Compass,
  Eye,
  Globe,
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
  X,
} from "lucide-react";
import type { ChangeEvent, ReactNode } from "react";
import { useEffect, useState } from "react";

import AccountDropdown from "../components/AccountDropdown";

const DEFAULT_COVER =
  "/assets/images/story/hero-collage.jpg";

const DEFAULT_PROFILE_IMAGE: string | null = null;

const DEFAULT_PROFILE = {
  name: "Yash Jain",
  username: "@yashjain",
  bio: "Exploring the stories, ideas and emotions hidden inside great works of art.",
  location: "India",
  website: "portfolio.com",
  joinedDate: "2026",
};

type SidebarLinkProps = {
  href: string;
  icon: typeof User;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
};

function SidebarLink({
  href,
  icon: Icon,
  label,
  active = false,
  collapsed = false,
  onClick,
}: SidebarLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
        active
          ? "bg-white/10 text-white"
          : "text-white/60 hover:bg-white/5 hover:text-white"
      } ${collapsed ? "justify-center" : ""}`}
    >
      <Icon className="size-[18px] shrink-0" />

      {!collapsed && (
        <span className="truncate">
          {label}
        </span>
      )}
    </a>
  );
}

function EditProfilePage() {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  const [coverImage, setCoverImage] =
    useState(DEFAULT_COVER);

  const [profileImage, setProfileImage] =
    useState<string | null>(
      DEFAULT_PROFILE_IMAGE,
    );

  const [profile, setProfile] =
    useState(DEFAULT_PROFILE);

  const [isPublic, setIsPublic] =
    useState(true);

  const [showLikes, setShowLikes] =
    useState(true);

  const [saved, setSaved] =
    useState(false);

  const [coverObjectUrl, setCoverObjectUrl] =
    useState<string | null>(null);

  const [profileObjectUrl, setProfileObjectUrl] =
    useState<string | null>(null);

  /*
   * Load saved profile text data if it exists.
   */
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(
        "the-artwork-stories-profile",
      );

      if (!savedProfile) {
        return;
      }

      const parsed = JSON.parse(savedProfile);

      setProfile({
        name:
          typeof parsed.name === "string"
            ? parsed.name
            : DEFAULT_PROFILE.name,

        username:
          typeof parsed.username === "string"
            ? parsed.username
            : DEFAULT_PROFILE.username,

        bio:
          typeof parsed.bio === "string"
            ? parsed.bio
            : DEFAULT_PROFILE.bio,

        location:
          typeof parsed.location === "string"
            ? parsed.location
            : DEFAULT_PROFILE.location,

        website:
          typeof parsed.website === "string"
            ? parsed.website
            : DEFAULT_PROFILE.website,

        joinedDate:
          typeof parsed.joinedDate === "string"
            ? parsed.joinedDate
            : DEFAULT_PROFILE.joinedDate,
      });

      if (typeof parsed.isPublic === "boolean") {
        setIsPublic(parsed.isPublic);
      }

      if (typeof parsed.showLikes === "boolean") {
        setShowLikes(parsed.showLikes);
      }
    } catch {
      /*
       * Ignore malformed localStorage data
       * and keep the default profile.
       */
    }
  }, []);

  /*
   * Clean up temporary image URLs.
   */
  useEffect(() => {
    return () => {
      if (coverObjectUrl) {
        URL.revokeObjectURL(coverObjectUrl);
      }

      if (profileObjectUrl) {
        URL.revokeObjectURL(profileObjectUrl);
      }
    };
  }, [
    coverObjectUrl,
    profileObjectUrl,
  ]);

  /*
   * Cover image handler.
   */
  const handleCoverChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      event.target.value = "";
      return;
    }

    const objectUrl = URL.createObjectURL(file);

    if (coverObjectUrl) {
      URL.revokeObjectURL(coverObjectUrl);
    }

    setCoverObjectUrl(objectUrl);
    setCoverImage(objectUrl);

    event.target.value = "";
  };

  /*
   * Profile image handler.
   */
  const handleProfileImageChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      event.target.value = "";
      return;
    }

    const objectUrl = URL.createObjectURL(file);

    if (profileObjectUrl) {
      URL.revokeObjectURL(profileObjectUrl);
    }

    setProfileObjectUrl(objectUrl);
    setProfileImage(objectUrl);

    event.target.value = "";
  };

  /*
   * Remove profile image.
   */
  const handleRemoveProfileImage = () => {
    if (profileObjectUrl) {
      URL.revokeObjectURL(profileObjectUrl);
      setProfileObjectUrl(null);
    }

    setProfileImage(null);
  };

  /*
   * Save profile information.
   */
  const handleSave = () => {
    try {
      localStorage.setItem(
        "the-artwork-stories-profile",
        JSON.stringify({
          ...profile,
          isPublic,
          showLikes,
        }),
      );
    } catch {
      // Ignore localStorage errors.
    }

    /*
     * Return to the Profile page after saving so the
     * user sees their changes applied.
     */
    window.location.href = "../index.html";
  };

  /*
   * Cancel editing.
   */
  const handleCancel = () => {
    window.location.href = "../index.html";
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f2ea] text-[#1d1b1a]">

      {/* =====================================================
          DESKTOP SIDEBAR
      ===================================================== */}

      <aside
        className={`fixed left-0 top-0 z-40 hidden h-screen flex-col bg-[#1d1c19] text-[#f5efe4] transition-all duration-300 lg:flex ${
          sidebarCollapsed
            ? "w-[72px]"
            : "w-[220px]"
        }`}
      >
        {/* Sidebar Header */}
        <div
          className={`border-b border-white/10 py-7 transition-all ${
            sidebarCollapsed
              ? "px-3"
              : "px-7"
          }`}
        >
          <a
            href="../../home/index.html"
            className={`block font-display leading-[0.95] ${
              sidebarCollapsed
                ? "text-center text-[18px]"
                : "text-[24px]"
            }`}
          >
            {sidebarCollapsed ? (
              "TAS"
            ) : (
              <>
                The ArtWork
                <br />
                Stories
              </>
            )}
          </a>
        </div>

        {/* Sidebar Toggle */}
        <button
          type="button"
          onClick={() =>
            setSidebarCollapsed(
              (value) => !value,
            )
          }
          aria-label={
            sidebarCollapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          className={`absolute -right-3 top-[78px] flex size-7 items-center justify-center rounded-full border border-white/10 bg-[#24231f] text-white shadow-lg transition hover:scale-105 ${
            sidebarCollapsed ? "rotate-180" : ""
          }`}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="size-3.5" />
          ) : (
            <PanelLeftClose className="size-3.5" />
          )}
        </button>

        {/* Navigation */}
        <nav className="mt-8 flex flex-col gap-2 px-3">

          <SidebarLink
            href="../../discover/index.html"
            icon={Compass}
            label="Discover"
            collapsed={sidebarCollapsed}
          />

          <SidebarLink
            href="../../collections/index.html"
            icon={Bookmark}
            label="Collections"
            collapsed={sidebarCollapsed}
          />

          <div className="my-2 h-px bg-white/10" />

          <SidebarLink
            href="../../create/index.html?from=edit-profile"
            icon={Plus}
            label="Share an Artwork"
            collapsed={sidebarCollapsed}
          />

          <div className="my-2 h-px bg-white/10" />

          <SidebarLink
            href="../index.html"
            icon={User}
            label="Profile"
            active
            collapsed={sidebarCollapsed}
          />

          <SidebarLink
            href="/pages/app/settings/account/index.html"
            icon={Settings}
            label="Settings"
            collapsed={sidebarCollapsed}
          />

        </nav>

        {/* Sidebar Quote */}
        {!sidebarCollapsed && (
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

      {/* =====================================================
          MOBILE SIDEBAR
      ===================================================== */}

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">

          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close navigation"
            onClick={closeMobileSidebar}
            className="absolute inset-0 bg-black/45"
          />

          {/* Sidebar */}
          <aside className="relative flex h-full w-[280px] flex-col bg-[#1d1b1a] px-4 py-5 shadow-2xl">

            <div className="flex items-center justify-between">
              <a
                href="../../discover/index.html"
                onClick={closeMobileSidebar}
                className="font-display text-lg leading-tight text-white"
              >
                The ArtWork
                <br />
                Stories
              </a>

              <button
                type="button"
                onClick={closeMobileSidebar}
                aria-label="Close navigation"
                className="flex size-10 items-center justify-center rounded-xl text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>

            <nav className="mt-8 flex-1">
              <div className="space-y-1">

                <SidebarLink
                  href="../../discover/index.html"
                  icon={Compass}
                  label="Discover"
                  onClick={closeMobileSidebar}
                />

                <SidebarLink
                  href="../../collections/index.html"
                  icon={Bookmark}
                  label="Collections"
                  onClick={closeMobileSidebar}
                />

                <div className="my-4 h-px bg-white/10" />

                <SidebarLink
                  href="../../create/index.html?from=edit-profile"
                  icon={Plus}
                  label="Share an Artwork"
                  onClick={closeMobileSidebar}
                />

                <div className="my-4 h-px bg-white/10" />

                <SidebarLink
                  href="../index.html"
                  icon={User}
                  label="Profile"
                  active
                  onClick={closeMobileSidebar}
                />

                <SidebarLink
                  href="/pages/app/settings/account/index.html"
                  icon={Settings}
                  label="Settings"
                  onClick={closeMobileSidebar}
                />

              </div>
            </nav>
          </aside>
        </div>
      )}

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main
        className={`min-h-screen transition-all duration-300 ${
          sidebarCollapsed
            ? "lg:pl-[72px]"
            : "lg:pl-[220px]"
        }`}
      >

        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="sticky top-0 z-30 border-b border-black/5 bg-[#f5f2ea]/95 backdrop-blur-xl">
          <div className="flex h-[76px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">

            {/* Mobile menu */}
            <button
              type="button"
              onClick={() =>
                setMobileSidebarOpen(true)
              }
              aria-label="Open navigation"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#1d1b1a] text-white lg:hidden"
            >
              <Menu className="size-5" />
            </button>

            {/* Search */}
            <div className="relative hidden max-w-[650px] flex-1 sm:block">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-black/40" />

              <input
                type="search"
                placeholder="Search artworks, collections, artists, or themes..."
                className="h-11 w-full rounded-xl border border-black/10 bg-white/45 pl-11 pr-5 text-sm outline-none placeholder:text-black/40 focus:border-black/20 focus:bg-white/70"
              />
            </div>

            {/* Right */}
            <div className="ml-auto flex items-center gap-4">

              <button
                type="button"
                aria-label="Notifications"
                className="flex size-10 items-center justify-center rounded-full text-[#1d1b1a] transition hover:bg-black/5"
              >
                <Bell className="size-5" />
              </button>

              <AccountDropdown className="hidden sm:flex">
                <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-[#1d1b1a] text-sm font-medium text-white">
                  Y
                </div>

                <span className="text-sm font-medium">
                  Hi, Yash
                </span>

                <span className="text-xs text-black/50">
                  ⌄
                </span>
                </div>
              </AccountDropdown>

            </div>
          </div>
        </header>

        {/* ===================================================
            PAGE
        =================================================== */}

        <div className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">

          {/* Back */}
          <a
            href="../index.html"
            className="inline-flex items-center gap-2 text-sm text-black/55 transition hover:text-[#1d1b1a]"
          >
            <ArrowLeft className="size-4" />
            Back to Profile
          </a>

          {/* Heading */}
          <div className="mt-5">
            <h1 className="font-display text-[42px] leading-none tracking-[-0.03em] text-[#1d1b1a] sm:text-[50px]">
              Edit Profile
            </h1>

            <p className="mt-3 text-[15px] text-black/55">
              Update your profile information, images and preferences.
            </p>
          </div>

          {/* =================================================
              TWO COLUMNS
          ================================================= */}

          <div className="mt-8 grid items-start gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(340px,0.9fr)]">

            {/* =================================================
                LEFT
            ================================================= */}

            <div className="space-y-5">

              {/* =================================================
                  COVER IMAGE
              ================================================= */}

              <section className="overflow-hidden rounded-[22px] border border-black/5 bg-white/70 shadow-[0_12px_35px_rgba(21,17,13,0.04)]">

                <div className="p-5 sm:p-6">

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                    <div>
                      <h2 className="font-display text-[25px] leading-none">
                        Cover Image
                      </h2>

                      <p className="mt-2 text-sm text-black/50">
                        Add a cover image that represents your artistic journey.
                      </p>
                    </div>

                    <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 text-sm transition hover:bg-white">
                      <Camera className="size-4" />
                      Change Cover

                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleCoverChange}
                        className="hidden"
                      />
                    </label>

                  </div>

                  <div className="relative mt-5 overflow-hidden rounded-xl">
                    <img
                      src={coverImage}
                      alt="Profile cover"
                      className="h-[180px] w-full object-cover sm:h-[210px]"
                    />
                  </div>

                  <p className="mt-3 text-xs text-black/40">
                    Recommended size: 1500 × 500 px.
                    Supports JPG, PNG, or WEBP.
                  </p>

                </div>
              </section>

              {/* =================================================
                  PROFILE PICTURE
              ================================================= */}

              <section className="rounded-[22px] border border-black/5 bg-white/70 shadow-[0_12px_35px_rgba(21,17,13,0.04)]">

                <div className="p-5 sm:p-6">

                  <h2 className="font-display text-[25px] leading-none">
                    Profile Picture
                  </h2>

                  <p className="mt-2 text-sm text-black/50">
                    This will be shown on your profile and with your contributions.
                  </p>

                  <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">

                    {/* Avatar */}
                    <div className="relative shrink-0">

                      <div className="flex size-[120px] items-center justify-center overflow-hidden rounded-full bg-[#d4b99e] ring-4 ring-white">

                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt="Profile"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-4xl font-semibold text-[#1d1b1a]">
                            Y
                          </span>
                        )}

                      </div>

                      {/* Camera badge */}
                      <label
                        title="Change profile photo"
                        className="absolute bottom-0 right-0 flex size-10 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-[#f5f2ea] shadow-sm transition hover:bg-white"
                      >
                        <Camera className="size-4" />

                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={handleProfileImageChange}
                          className="hidden"
                        />
                      </label>

                    </div>

                    {/* Buttons */}
                    <div className="min-w-0">

                      <div className="flex flex-wrap gap-3">

                        <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1d1b1a] px-5 text-sm font-medium text-white transition hover:bg-[#302d2a]">
                          <Camera className="size-4" />
                          Change Photo

                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handleProfileImageChange}
                            className="hidden"
                          />
                        </label>

                        {profileImage && (
                          <button
                            type="button"
                            onClick={handleRemoveProfileImage}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-black/10 bg-white/70 px-5 text-sm transition hover:bg-white"
                          >
                            <Trash2 className="size-4" />
                            Remove
                          </button>
                        )}

                      </div>

                      <p className="mt-3 max-w-[360px] text-xs leading-5 text-black/40">
                        Recommended size: 400 × 400 px.
                        Supports JPG, PNG, or WEBP.
                      </p>

                    </div>

                  </div>
                </div>
              </section>

              {/* =================================================
                  PROFILE INFORMATION
              ================================================= */}

              <section className="rounded-[22px] border border-black/5 bg-white/70 shadow-[0_12px_35px_rgba(21,17,13,0.04)]">

                <div className="p-5 sm:p-6">

                  <h2 className="font-display text-[25px] leading-none">
                    Profile Information
                  </h2>

                  <p className="mt-2 text-sm text-black/50">
                    Tell the community a little about yourself.
                  </p>

                  <div className="mt-6 space-y-5">

                    {/* Name + Username */}
                    <div className="grid gap-5 md:grid-cols-2">

                      <FormField label="Name">
                        <div className="relative">

                          <input
                            type="text"
                            value={profile.name}
                            onChange={(event) =>
                              setProfile({
                                ...profile,
                                name: event.target.value,
                              })
                            }
                            className="profile-input pr-11"
                          />

                          <Pencil className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-black/30" />

                        </div>
                      </FormField>

                      <FormField label="Username">
                        <div className="relative">

                          <input
                            type="text"
                            value={profile.username}
                            onChange={(event) =>
                              setProfile({
                                ...profile,
                                username: event.target.value,
                              })
                            }
                            className="profile-input pr-11"
                          />

                          <Pencil className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-black/30" />

                        </div>
                      </FormField>

                    </div>

                    {/* Bio */}
                    <FormField label="Bio">
                      <div className="relative">

                        <textarea
                          value={profile.bio}
                          maxLength={280}
                          rows={4}
                          onChange={(event) =>
                            setProfile({
                              ...profile,
                              bio: event.target.value,
                            })
                          }
                          className="profile-input min-h-[112px] resize-none pr-12 pb-8"
                        />

                        <Pencil className="pointer-events-none absolute right-4 top-4 size-4 text-black/30" />

                        <span className="pointer-events-none absolute bottom-3 right-4 text-xs text-black/35">
                          {profile.bio.length}/280
                        </span>

                      </div>
                    </FormField>

                    {/* Location / Website / Joined */}
                    <div className="grid gap-5 md:grid-cols-3">

                      {/* Location */}
                      <FormField label="Location">
                        <div className="relative">

                          <MapPin className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-black/40" />

                          <input
                            type="text"
                            value={profile.location}
                            onChange={(event) =>
                              setProfile({
                                ...profile,
                                location: event.target.value,
                              })
                            }
                            className="profile-input pl-10 pr-10"
                          />

                          <Pencil className="pointer-events-none absolute right-3.5 top-1/2 size-3.5 -translate-y-1/2 text-black/30" />

                        </div>
                      </FormField>

                      {/* Website */}
                      <FormField label="Website">
                        <div className="relative">

                          <LinkIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-black/40" />

                          <input
                            type="text"
                            value={profile.website}
                            onChange={(event) =>
                              setProfile({
                                ...profile,
                                website: event.target.value,
                              })
                            }
                            className="profile-input pl-10 pr-10"
                          />

                          <Pencil className="pointer-events-none absolute right-3.5 top-1/2 size-3.5 -translate-y-1/2 text-black/30" />

                        </div>
                      </FormField>

                      {/* Joined Date */}
                      <FormField label="Joined Date">
                        <div className="relative">

                          <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-black/40" />

                          <input
                            type="text"
                            value={profile.joinedDate}
                            onChange={(event) =>
                              setProfile({
                                ...profile,
                                joinedDate: event.target.value,
                              })
                            }
                            className="profile-input pl-10 pr-10"
                          />

                          <Pencil className="pointer-events-none absolute right-3.5 top-1/2 size-3.5 -translate-y-1/2 text-black/30" />

                        </div>
                      </FormField>

                    </div>

                  </div>
                </div>
              </section>
            </div>

            {/* =================================================
                RIGHT
            ================================================= */}

            <div className="space-y-5 xl:sticky xl:top-[96px]">

              {/* =================================================
                  PROFILE PREVIEW
              ================================================= */}

              <section className="overflow-hidden rounded-[22px] border border-black/5 bg-white/70 shadow-[0_12px_35px_rgba(21,17,13,0.04)]">

                <div className="p-5 sm:p-6">

                  <h2 className="font-display text-[25px] leading-none">
                    Profile Preview
                  </h2>

                  <p className="mt-2 text-sm text-black/50">
                    This is how your profile will look to others.
                  </p>

                </div>

                {/* Preview */}
                <div className="mx-5 mb-5 overflow-hidden rounded-[18px] border border-black/5 bg-[#f5f2ea]">

                  {/* Preview cover */}
                  <div className="relative h-[120px] w-full overflow-hidden rounded-t-[14px] bg-[#d4b99e] sm:h-[140px]  ">

                    <img
                      src={coverImage}
                      alt=""
                      className="h-full w-full object-cover"
                    />

                  </div>

                  {/* Preview content */}
                  <div className="px-5 pb-5">

                    {/* Preview avatar */}
                    <div className="relative z-10 -mt-11 flex size-[86px] items-center justify-center overflow-hidden rounded-full border-4 border-[#f5f2ea] bg-[#d4b99e] shadow-md">

                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt={profile.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-semibold text-[#1d1b1a]">
                          {profile.name
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      )}

                    </div>

                    <h3 className="mt-4 font-display text-[27px] leading-none">
                      {profile.name || "Your Name"}
                    </h3>

                    <p className="mt-1 text-sm text-black/45">
                      {profile.username || "@username"}
                    </p>

                    <p className="mt-4 text-sm leading-6 text-black/65">
                      {profile.bio ||
                        "Your profile bio will appear here."}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-black/50">

                      {profile.location && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="size-3.5" />
                          {profile.location}
                        </span>
                      )}

                      {profile.website && (
                        <span className="inline-flex items-center gap-1.5">
                          <LinkIcon className="size-3.5" />
                          {profile.website}
                        </span>
                      )}

                      {profile.joinedDate && (
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="size-3.5" />
                          Joined {profile.joinedDate}
                        </span>
                      )}

                    </div>

                    {/* Stats */}
                    <div className="mt-6 grid grid-cols-4 border-t border-black/8 pt-5">

                      <PreviewStat
                        value="24"
                        label="Artworks"
                      />

                      <PreviewStat
                        value="4"
                        label="Collections"
                      />

                      <PreviewStat
                        value="128"
                        label="Likes"
                      />

                      <PreviewStat
                        value="240"
                        label="Followers"
                      />

                    </div>
                  </div>
                </div>
              </section>

              {/* =================================================
                  PRIVACY
              ================================================= */}

              <section className="rounded-[22px] border border-black/5 bg-white/70 p-5 shadow-[0_12px_35px_rgba(21,17,13,0.04)] sm:p-6">

                <h2 className="font-display text-[25px] leading-none">
                  Privacy & Preferences
                </h2>

                <p className="mt-2 text-sm text-black/50">
                  Manage how your profile appears and what others can see.
                </p>

                <div className="mt-6 space-y-5">

                  <PreferenceRow
                    icon={Globe}
                    title="Make my profile public"
                    description="Allow others to view your profile and collections."
                    enabled={isPublic}
                    onChange={() =>
                      setIsPublic(
                        (value) => !value,
                      )
                    }
                  />

                  <PreferenceRow
                    icon={Eye}
                    title="Show my likes"
                    description="Let others see the artworks you've liked."
                    enabled={showLikes}
                    onChange={() =>
                      setShowLikes(
                        (value) => !value,
                      )
                    }
                  />

                </div>
              </section>

              {/* =================================================
                  ACTIONS
              ================================================= */}

              <div className="grid grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={handleCancel}
                  className="h-12 rounded-full bg-[#e4ddd2] px-5 text-sm font-medium text-[#1d1b1a] transition hover:bg-[#dcd4c8]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#1d1b1a] px-5 text-sm font-medium text-white transition hover:bg-[#302d2a]"
                >
                  {saved ? (
                    <>
                      <Check className="size-4" />
                      Saved
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>

              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ===============================================================
   FORM FIELD
=============================================================== */

function FormField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[12px] font-medium text-[#1d1b1a]">
        {label}
      </span>

      {children}
    </label>
  );
}

/* ===============================================================
   PREVIEW STAT
=============================================================== */

function PreviewStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="border-r border-black/8 text-center last:border-r-0">
      <p className="font-display text-lg">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-black/45">
        {label}
      </p>
    </div>
  );
}

/* ===============================================================
   PREFERENCE ROW
=============================================================== */

function PreferenceRow({
  icon: Icon,
  title,
  description,
  enabled,
  onChange,
}: {
  icon: typeof Globe;
  title: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center gap-3">

      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f0ebe2]">
        <Icon className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-black/45">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={onChange}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          enabled
            ? "bg-[#1d1b1a]"
            : "bg-black/15"
        }`}
      >
        <span
          className={`absolute top-1 size-5 rounded-full bg-white shadow-sm transition ${
            enabled
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>

    </div>
  );
}

export default EditProfilePage;
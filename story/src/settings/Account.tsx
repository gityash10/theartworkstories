import { Camera, Check, ExternalLink, Pencil, Trash2, UserRound } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";

import SettingsLayout from "./SettingsLayout";
import {
  FieldHelper,
  FieldLabel,
  SavedBadge,
  TextArea,
  TextInput,
  useSavedIndicator,
} from "./ui";

/* ===============================================================
   ACCOUNT SETTINGS

   Fully local: profile information mirrors the same
   localStorage record the Profile / Edit Profile pages use
   ("the-artwork-stories-profile"), so changes made here show up
   on the Profile page and vice versa.
   =============================================================== */

type AccountInfo = {
  name: string;
  username: string;
  bio: string;
  location: string;
  website: string;
  email: string;
  phone: string;
};

const PROFILE_KEY = "the-artwork-stories-profile";

const DEFAULT_ACCOUNT: AccountInfo = {
  name: "Yash Jain",
  username: "yashjain",
  bio: "Exploring the stories, ideas and emotions hidden inside great works of art.",
  location: "Indore, Madhya Pradesh",
  website: "https://jainyashportfolio.vercel.app",
  email: "yash@example.com",
  phone: "+91 98765 43210",
};

function readAccount(): AccountInfo {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);

    if (!raw) {
      return DEFAULT_ACCOUNT;
    }

    const parsed = JSON.parse(raw) as Partial<AccountInfo>;

    return {
      name: parsed.name ?? DEFAULT_ACCOUNT.name,
      username: parsed.username
        ? parsed.username.replace(/^@+/, "")
        : DEFAULT_ACCOUNT.username,
      bio: parsed.bio ?? DEFAULT_ACCOUNT.bio,
      location: parsed.location ?? DEFAULT_ACCOUNT.location,
      website: parsed.website ?? DEFAULT_ACCOUNT.website,
      email: parsed.email ?? DEFAULT_ACCOUNT.email,
      phone: parsed.phone ?? DEFAULT_ACCOUNT.phone,
    };
  } catch {
    return DEFAULT_ACCOUNT;
  }
}

export default function Account() {
  const [saved, setSaved] = useState<AccountInfo>(readAccount);
  const [draft, setDraft] = useState<AccountInfo>(saved);
  const [avatar, setAvatar] = useState<string>("");
  const [showPhoneForm, setShowPhoneForm] = useState(false);
  const [savedFlash, flashSaved, savedLabel] = useSavedIndicator();

  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const removedAvatarRef = useRef(false);

  const update = <K extends keyof AccountInfo>(
    key: K,
    value: AccountInfo[K],
  ) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file || !file.type.startsWith("image/")) {
      event.target.value = "";
      return;
    }

    setAvatar((current) => {
      if (current.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }

      return URL.createObjectURL(file);
    });

    removedAvatarRef.current = false;
    event.target.value = "";
  };

  const removeAvatar = () => {
    setAvatar((current) => {
      if (current.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }

      return "";
    });

    removedAvatarRef.current = true;
    flashSaved("Photo removed");
  };

  const handleSave = () => {
    /*
     * Merge into the existing profile record so fields owned by
     * other pages (joinedDate, isPublic, ...) are preserved.
     */
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      const existing = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};

      localStorage.setItem(
        PROFILE_KEY,
        JSON.stringify({
          ...existing,
          name: draft.name,
          username: draft.username,
          bio: draft.bio,
          location: draft.location,
          website: draft.website,
          email: draft.email,
          phone: draft.phone,
          ...(removedAvatarRef.current ? { avatar: "" } : {}),
          ...(avatar ? { avatar } : {}),
        }),
      );
    } catch {
      /* Storage unavailable — keep UI state only. */
    }

    setSaved(draft);
    removedAvatarRef.current = false;
    flashSaved("Changes saved");
  };

  const handleCancel = () => {
    setDraft(saved);

    if (avatar.startsWith("blob:")) {
      URL.revokeObjectURL(avatar);
    }

    setAvatar("");
  };

  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved);

  return (
    <SettingsLayout
      activeSection="account"
      title="Account"
      description="Manage your account information and profile details."
    >
      <div className="space-y-6">
        {/* Profile photo */}
        <section className="tas-card rounded-2xl border border-black/10 bg-white/45 p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative shrink-0">
              <div className="flex size-24 items-center justify-center overflow-hidden rounded-full bg-[#292723] font-display text-3xl text-white">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound className="size-10 text-white/85" />
                )}
              </div>

              <button
                type="button"
                aria-label="Change profile photo"
                onClick={() => avatarInputRef.current?.click()}
                className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full border-2 border-[#f4eee2] bg-[#24231f] text-white transition hover:bg-black"
              >
                <Camera className="size-3.5" />
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                Profile
              </p>

              <h2 className="mt-2 font-display text-3xl">
                {draft.name || "Your name"}
              </h2>

              <p className="mt-1 text-sm text-black/50">
                @{draft.username || "username"}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />

                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-black/10 px-4 text-sm transition hover:bg-black/[0.03]"
                >
                  <Pencil className="size-3.5" />
                  Change photo
                </button>

                <button
                  type="button"
                  onClick={removeAvatar}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-black/10 px-4 text-sm text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 className="size-3.5" />
                  Remove photo
                </button>

                <a
                  href="/pages/app/profile/index.html"
                  className="inline-flex h-10 items-center gap-2 text-sm underline underline-offset-4"
                >
                  View Profile
                  <ExternalLink className="size-3.5" />
                </a>
              </div>

              <p className="mt-3 text-xs text-black/40">
                Photo previews locally. Uploading to the server arrives with
                account integration.
              </p>
            </div>
          </div>
        </section>

        {/* Basic information */}
        <section className="tas-card overflow-hidden rounded-2xl border border-black/10 bg-white/45">
          <div className="border-b border-black/10 px-6 py-5 sm:px-8">
            <h2 className="font-display text-2xl">Basic Information</h2>
            <p className="tas-muted mt-1 text-sm text-black/50">
              Information visible on your ArtWork Stories profile.
            </p>
          </div>

          <div className="space-y-5 p-6 sm:p-8">
            <div>
              <FieldLabel>Name</FieldLabel>

              <TextInput
                className="mt-2"
                value={draft.name}
                onChange={(event) => update("name", event.target.value)}
              />
            </div>

            <div>
              <FieldLabel>Username</FieldLabel>

              <TextInput
                className="mt-2"
                value={draft.username}
                onChange={(event) => update("username", event.target.value)}
              />

              <FieldHelper>
                This is how others see you on The ArtWork Stories.
              </FieldHelper>
            </div>

            <div>
              <FieldLabel>Bio</FieldLabel>

              <TextArea
                className="mt-2"
                value={draft.bio}
                onChange={(event) => update("bio", event.target.value)}
              />
            </div>

            <div>
              <FieldLabel>Location</FieldLabel>

              <TextInput
                className="mt-2"
                value={draft.location}
                onChange={(event) => update("location", event.target.value)}
              />
            </div>

            <div>
              <FieldLabel>Website</FieldLabel>

              <TextInput
                className="mt-2"
                value={draft.website}
                placeholder="https://…"
                onChange={(event) => update("website", event.target.value)}
              />
            </div>

            <div>
              <FieldLabel>Email</FieldLabel>

              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <TextInput
                  type="email"
                  value={draft.email}
                  onChange={(event) => update("email", event.target.value)}
                />

                <span className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#e4f2e2] px-3 text-xs text-[#356c32]">
                  <Check className="size-3.5" />
                  Verified
                </span>
              </div>

              <FieldHelper>
                Email changes are verified through your inbox once account
                integration is connected.
              </FieldHelper>
            </div>

            {/* Phone */}
            <div>
              <FieldLabel>Phone</FieldLabel>

              {draft.phone && !showPhoneForm ? (
                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <div className="flex h-11 flex-1 items-center rounded-xl border border-black/10 bg-white/50 px-4 text-sm">
                    {draft.phone}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPhoneForm(true)}
                    className="h-11 rounded-xl border border-black/10 px-5 text-sm transition hover:bg-black/[0.03]"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <TextInput
                    type="tel"
                    placeholder="+91 00000 00000"
                    value={draft.phone}
                    onChange={(event) => update("phone", event.target.value)}
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setShowPhoneForm(false);
                      flashSaved("Phone updated");
                    }}
                    className="h-11 shrink-0 rounded-xl border border-black/10 px-5 text-sm transition hover:bg-black/[0.03]"
                  >
                    Done
                  </button>
                </div>
              )}

              <FieldHelper>
                {draft.phone
                  ? "Your number stays private and is never shown on your profile."
                  : "No phone number added yet."}
              </FieldHelper>
            </div>
          </div>
        </section>

        {/* Membership */}
        <section className="tas-card rounded-2xl border border-black/10 bg-white/45 p-6 sm:p-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-black/40">
            Account
          </p>

          <div className="mt-3 flex items-center justify-between gap-5">
            <div>
              <h2 className="font-display text-2xl">Member since</h2>
              <p className="mt-1 text-sm text-black/50">September 2026</p>
            </div>
          </div>
        </section>

        {/* Save / Cancel */}
        <div className="sticky bottom-4 z-20 flex flex-col gap-3 rounded-2xl border border-black/10 bg-[#f4eee2]/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <SavedBadge show={savedFlash} label={savedLabel} />

            {isDirty && !savedFlash && (
              <span className="text-xs text-black/45">Unsaved changes</span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="h-11 flex-1 rounded-xl border border-black/10 px-5 text-sm transition hover:bg-black/[0.03] sm:flex-none"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="h-11 flex-1 rounded-xl px-5 text-sm text-white transition hover:opacity-90 sm:flex-none"
              style={{ backgroundColor: "var(--tas-accent, #24231f)" }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}

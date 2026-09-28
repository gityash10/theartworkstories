import type {
  Collection,
  CollectionArtwork,
  CollectionMember,
} from "../types/collection";
import { availableArtworks } from "./artworks";

const STORAGE_KEY = "the-artwork-stories-collections";

const CURRENT_USER_ID = "demo-user-yash";

function readCollections(): Collection[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    return JSON.parse(raw) as Collection[];
  } catch {
    return [];
  }
}

function writeCollections(collections: Collection[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
}

/* --------------------------------------------------
   CREATE
-------------------------------------------------- */

export function createCollection(
  input: Pick<
    Collection,
    "title" | "description" | "coverImage" | "visibility" | "tags"
  >,
): Collection {
  const now = new Date().toISOString();

  const collection: Collection = {
    id: crypto.randomUUID(),

    title: input.title,

    description: input.description,

    coverImage: input.coverImage,

    ownerId: CURRENT_USER_ID,

    visibility: input.visibility,

    tags: input.tags,

    artworks: [],

    members: [
      {
        userId: CURRENT_USER_ID,
        role: "owner",
        joinedAt: now,
      },
    ],

    stats: {
      likes: 0,
      followers: 0,
      views: 0,
      saves: 0,
    },

    createdAt: now,

    updatedAt: now,
  };

  const collections = readCollections();

  collections.unshift(collection);

  writeCollections(collections);

  return collection;
}

/* --------------------------------------------------
   READ
-------------------------------------------------- */

export function getCollections(): Collection[] {
  return readCollections();
}

export function getCollection(id: string): Collection | null {
  const collections = readCollections();

  return collections.find((collection) => collection.id === id) ?? null;
}

/* --------------------------------------------------
   UPDATE
-------------------------------------------------- */

export function updateCollection(
  id: string,
  updates: Partial<Collection>,
): Collection | null {
  const collections = readCollections();

  const index = collections.findIndex((collection) => collection.id === id);

  if (index === -1) {
    return null;
  }

  const updated: Collection = {
    ...collections[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  collections[index] = updated;

  writeCollections(collections);

  return updated;
}

/* --------------------------------------------------
   DELETE
-------------------------------------------------- */

export function deleteCollection(id: string): boolean {
  const collections = readCollections();

  const filtered = collections.filter((collection) => collection.id !== id);

  if (filtered.length === collections.length) {
    return false;
  }

  writeCollections(filtered);

  return true;
}

/* --------------------------------------------------
   ARTWORKS
-------------------------------------------------- */

export function addArtworkToCollection(
  collectionId: string,
  artworkId: string,
): Collection | null {
  const collection = getCollection(collectionId);

  if (!collection) {
    return null;
  }

  const artworkExists = availableArtworks.some(
    (artwork) => artwork.id === artworkId,
  );

  if (!artworkExists) {
    return collection;
  }

  const alreadyExists = collection.artworks.some(
    (artwork) => artwork.artworkId === artworkId,
  );

  if (alreadyExists) {
    return collection;
  }

  const artwork: CollectionArtwork = {
    artworkId,

    position: collection.artworks.length,

    addedAt: new Date().toISOString(),
  };

  return updateCollection(collectionId, {
    artworks: [...collection.artworks, artwork],
  });
}

export function removeArtworkFromCollection(
  collectionId: string,
  artworkId: string,
): Collection | null {
  const collection = getCollection(collectionId);

  if (!collection) {
    return null;
  }

  const artworks = collection.artworks
    .filter((artwork) => artwork.artworkId !== artworkId)
    .map((artwork, index) => ({
      ...artwork,
      position: index,
    }));

  return updateCollection(collectionId, {
    artworks,
  });
}

export function reorderCollectionArtwork(
  collectionId: string,
  fromIndex: number,
  toIndex: number,
): Collection | null {
  const collection = getCollection(collectionId);

  if (!collection) {
    return null;
  }

  const artworks = [...collection.artworks];

  if (
    fromIndex < 0 ||
    fromIndex >= artworks.length ||
    toIndex < 0 ||
    toIndex >= artworks.length
  ) {
    return collection;
  }

  const [moved] = artworks.splice(fromIndex, 1);

  artworks.splice(toIndex, 0, moved);

  const reordered = artworks.map((artwork, index) => ({
    ...artwork,
    position: index,
  }));

  return updateCollection(collectionId, {
    artworks: reordered,
  });
}

/* --------------------------------------------------
   STATS
-------------------------------------------------- */

export function likeCollection(collectionId: string): Collection | null {
  const collection = getCollection(collectionId);

  if (!collection) {
    return null;
  }

  return updateCollection(collectionId, {
    stats: {
      ...collection.stats,

      likes: collection.stats.likes + 1,
    },
  });
}

export function followCollection(collectionId: string): Collection | null {
  const collection = getCollection(collectionId);

  if (!collection) {
    return null;
  }

  return updateCollection(collectionId, {
    stats: {
      ...collection.stats,

      followers: collection.stats.followers + 1,
    },
  });
}

export function saveCollection(collectionId: string): Collection | null {
  const collection = getCollection(collectionId);

  if (!collection) {
    return null;
  }

  return updateCollection(collectionId, {
    stats: {
      ...collection.stats,

      saves: collection.stats.saves + 1,
    },
  });
}

export function incrementCollectionViews(
  collectionId: string,
): Collection | null {
  const collection = getCollection(collectionId);

  if (!collection) {
    return null;
  }

  return updateCollection(collectionId, {
    stats: {
      ...collection.stats,

      views: collection.stats.views + 1,
    },
  });
}

/* --------------------------------------------------
   MEMBERS / COLLABORATORS
-------------------------------------------------- */

export function addCollectionMember(
  collectionId: string,
  userId: string,
  role: "editor" | "viewer",
): Collection | null {
  const collection = getCollection(collectionId);

  if (!collection) {
    return null;
  }

  const exists = collection.members.some((member) => member.userId === userId);

  if (exists) {
    return collection;
  }

  const member: CollectionMember = {
    userId,

    role,

    joinedAt: new Date().toISOString(),
  };

  return updateCollection(collectionId, {
    members: [...collection.members, member],
  });
}

export function removeCollectionMember(
  collectionId: string,
  userId: string,
): Collection | null {
  const collection = getCollection(collectionId);

  if (!collection) {
    return null;
  }

  // The owner cannot be removed.
  if (userId === collection.ownerId) {
    return collection;
  }

  const members = collection.members.filter(
    (member) => member.userId !== userId,
  );

  return updateCollection(collectionId, {
    members,
  });
}

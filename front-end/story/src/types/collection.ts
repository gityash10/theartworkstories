export type CollectionVisibility = "public" | "private";

export interface CollectionArtwork {
  artworkId: string;

  /**
   * Position inside the collection.
   * Lower number = appears earlier.
   */
  position: number;

  addedAt: string;
}

export interface CollectionMember {
  userId: string;

  role: "owner" | "editor" | "viewer";

  joinedAt: string;
}

export interface CollectionStats {
  likes: number;
  followers: number;
  views: number;
  saves: number;
}

export interface Collection {
  id: string;

  title: string;

  description: string;

  coverImage: string | null;

  ownerId: string;

  visibility: CollectionVisibility;

  tags: string[];

  artworks: CollectionArtwork[];

  members: CollectionMember[];

  stats: CollectionStats;

  createdAt: string;

  updatedAt: string;
}

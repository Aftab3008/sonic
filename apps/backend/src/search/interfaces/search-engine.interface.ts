export const SEARCH_ENGINE = 'SEARCH_ENGINE';

export interface SearchOptions {
  type?: 'songs' | 'albums' | 'artists' | 'all';
  limit?: number;
  offset?: number;
}

export interface SongDocument {
  id: string;
  publicId: string;
  title: string; // overrideTitle ?? recording.title
  albumId: string;
  albumPublicId: string;
  albumTitle: string;
  albumType: string;
  coverImageUrl: string | null;
  audioUrl: string | null;
  durationMs: number | null;
  isExplicit: boolean;
  hasLyrics: boolean;
  bpm: number | null;
  artists: string[]; // artist names — for display + search
  artistIds: string[]; // artist UUIDs — for filtering
  genres: string[]; // genre names
  releaseDate: string;
  playCount: number;
  releaseStatus: string;
}

export interface AlbumDocument {
  id: string;
  publicId: string;
  title: string;
  albumType: string;
  coverImageUrl: string | null;
  releaseDate: string;
  artists: string[];
  artistIds: string[];
  genres: string[];
  trackCount: number;
  releaseStatus: string;
}

export interface ArtistDocument {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  imageUrl: string | null;
  isVerified: boolean;
  monthlyListeners: number;
}

export interface SearchHit<T> {
  id: string;
  data: T;
}

export interface SearchResult {
  songs: SongDocument[];
  albums: AlbumDocument[];
  artists: ArtistDocument[];
  processingTimeMs: number;
  query: string;
}

/**
 * Abstract search engine contract.
 * Implement this interface to swap Meilisearch for Elasticsearch, Typesense, etc.
 * Zero changes needed in admin services, indexers, or the controller.
 */
export interface SearchEngine {
  /** Called on startup — create indexes and configure settings (idempotent). */
  ensureIndexes(): Promise<void>;

  /** Upsert one or more documents into the given index. */
  upsertDocuments(index: string, docs: object[]): Promise<void>;

  /** Delete a single document from the given index. */
  deleteDocument(index: string, id: string): Promise<void>;

  /** Delete multiple documents from the given index. */
  deleteDocuments(index: string, ids: string[]): Promise<void>;

  /** Federated search across indexes determined by options.type. */
  search(query: string, options: SearchOptions): Promise<SearchResult>;

  /** Return index-level stats (document counts, last update, etc.) */
  getStats(): Promise<Record<string, unknown>>;
}

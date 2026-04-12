export interface StandardResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface DashboardStats {
  users: number;
  artists: number;
  albums: number;
  tracks: number;
  genres: number;
  recordings: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
  role: string;
  banned?: boolean;
  banReason?: string;
  banExpires?: number;
  lang?: string;
  termsAccepted?: boolean;
  twoFactorEnabled?: boolean;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface ListUsersParams {
  limit?: number;
  offset?: number;
  searchField?: "email" | "name";
  searchValue?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

export interface ListUsersResponse {
  users: User[];
  total: number;
}

export interface BanUserPayload {
  userId: string;
  banReason?: string;
  banExpiresIn?: number;
}

export interface UnbanUserPayload {
  userId: string;
}

export interface RevokeSessionPayload {
  sessionToken: string;
}

export interface RevokeAllSessionsPayload {
  userId: string;
}

export interface SetRolePayload {
  userId: string;
  role: "admin" | "user";
}

export interface Artist {
  id: string;
  name: string;
  slug: string;
  bio?: string | null;
  imageUrl?: string | null;
  headerImageUrl?: string | null;
  isVerified: boolean;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    website?: string;
  } | null;
  monthlyListeners: number;
  createdAt: string;
  updatedAt: string;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AlbumArtist {
  albumId: string;
  artistId: string;
  role: "PRIMARY" | "FEATURED" | "PRODUCER";
  artist: Artist;
}

export interface AlbumGenre {
  albumId: string;
  genreId: string;
  genre: Genre;
}

export interface Album {
  id: string;
  publicId: string;
  title: string;
  albumType: "ALBUM" | "SINGLE" | "EP" | "COMPILATION";
  releaseStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  coverImageUrl?: string | null;
  releaseDate: string;
  upc?: string | null;
  recordLabel?: string | null;
  copyright?: string | null;
  createdAt: string;
  updatedAt: string;
  artists?: AlbumArtist[];
  genres?: AlbumGenre[];
  tracks?: Track[];
}

export interface RecordingArtist {
  recordingId: string;
  artistId: string;
  role: "PRIMARY" | "FEATURED" | "PRODUCER";
  artist: Artist;
}

export interface Recording {
  id: string;
  publicId: string;
  title: string;
  durationMs?: number;
  audioUrl?: string;
  audioProcessStatus:
    | "PENDING_UPLOAD"
    | "UPLOADED"
    | "PROCESSING"
    | "SUCCEEDED"
    | "FAILED";
  fileSize?: number;
  codec?: string;
  bitrate?: number;
  sampleRate?: number;
  isrc?: string;
  isExplicit: boolean;
  hasLyrics: boolean;
  lyrics?: string;
  bpm?: number;
  key?: string;
  createdAt: string;
  updatedAt: string;
  artists?: RecordingArtist[];
  tracks?: Track[];
}

export interface TrackArtist {
  trackId: string;
  artistId: string;
  role: "PRIMARY" | "FEATURED" | "PRODUCER";
  artist: Artist;
}

export interface Track {
  id: string;
  publicId: string;
  albumId: string;
  recordingId: string;
  trackNumber: number;
  discNumber: number;
  overrideTitle?: string;
  overrideIsExplicit?: boolean;
  coverImageUrl?: string;
  playCount: number;
  createdAt: string;
  updatedAt: string;
  recording?: Recording;
  album?: Album;
  artists?: TrackArtist[];
}

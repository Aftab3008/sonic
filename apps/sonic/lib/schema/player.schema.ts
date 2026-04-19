import { z } from "zod";

/**
 * Artist Model
 */
export const ArtistSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  bio: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  isVerified: z.boolean(),
  monthlyListeners: z.number().optional(),
});

export type Artist = z.infer<typeof ArtistSchema>;

export const AlbumTypeSchema = z.enum(["ALBUM", "SINGLE", "EP", "COMPILATION"]);
export type AlbumType = z.infer<typeof AlbumTypeSchema>;

/**
 * Album Model
 */
export const AlbumSchema = z.object({
  id: z.string(),
  title: z.string(),
  coverImageUrl: z.string().optional().nullable(),
  releaseDate: z.string().optional().nullable(),
  albumType: AlbumTypeSchema,
  artists: z
    .array(
      z.object({
        artist: ArtistSchema,
      }),
    )
    .optional(),
});

export type Album = z.infer<typeof AlbumSchema>;

/**
 * Recording Model
 */
export const RecordingSchema = z.object({
  id: z.string(),
  title: z.string(),
  durationMs: z.number().optional().nullable(),
  audioUrl: z.string().optional().nullable(), // HLS .m3u8 URL
  isExplicit: z.boolean(),
  hasLyrics: z.boolean(),
  lyrics: z.string().optional().nullable(),
});

export type Recording = z.infer<typeof RecordingSchema>;

/**
 * Track Model (The Backend Consumer Response)
 */
export const TrackSchema = z.object({
  id: z.string(),
  trackNumber: z.number(),
  overrideTitle: z.string().optional().nullable(),
  coverImageUrl: z.string().optional().nullable(),
  album: AlbumSchema.optional(),
  recording: RecordingSchema.extend({
    artists: z
      .array(
        z.object({
          artist: ArtistSchema,
        }),
      )
      .optional(),
  }),
});

export type Track = z.infer<typeof TrackSchema>;

/**
 * Flattened Track for Audio Player Consumption
 */
export interface PlayerTrack {
  id: string;
  url: string; // audioUrl
  title: string;
  artist: string;
  artwork: string;
  duration?: number;
  album?: string;
  description?: string;
  genre?: string;
  date?: string;
  isExplicit?: boolean;
}

/**
 * Home Discovery Response
 */
export const HomeDiscoverySchema = z.object({
  featured: AlbumSchema.extend({
    tracks: z.array(TrackSchema).optional(),
  }).optional().nullable(),
  recent: z.array(TrackSchema),
  madeForYou: z.array(AlbumSchema),
});

export type HomeDiscoveryResponse = z.infer<typeof HomeDiscoverySchema>;

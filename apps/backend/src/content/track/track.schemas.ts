import { z } from 'zod';

export const CreateTrackSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  albumId: z.string().min(1, 'Album ID is required'),
  trackNumber: z.coerce.number().int().positive(),
  audioUrl: z.string().optional(),
  durationMs: z.coerce.number().int().positive().optional(),
  isrc: z.string().optional(),
  isExplicit: z.boolean().optional().default(false),
  bpm: z.coerce.number().int().positive().optional(),
  hasLyrics: z.boolean().optional().default(false),
  lyrics: z.string().optional(),
  releaseStatus: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  artistIds: z.array(z.object({
    artistId: z.string().min(1),
    role: z.enum(['PRIMARY', 'FEATURED', 'PRODUCER']).default('FEATURED'),
  })).optional(),
});

export const UpdateTrackSchema = CreateTrackSchema.partial();

export type CreateTrackDto = z.infer<typeof CreateTrackSchema>;
export type UpdateTrackDto = z.infer<typeof UpdateTrackSchema>;

import { z } from 'zod';

/**
 * Schema for creating a Recording
 * Recording = the actual audio file with canonical metadata
 */
export const CreateRecordingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  audioUrl: z.string().optional(),
  durationMs: z.coerce.number().int().positive().optional(),
  fileSize: z.coerce.number().int().optional(),
  codec: z.string().optional(),
  bitrate: z.coerce.number().int().optional(),
  sampleRate: z.coerce.number().int().optional(),
  isrc: z.string().optional(),
  isExplicit: z.boolean().optional().default(false),
  hasLyrics: z.boolean().optional().default(false),
  lyrics: z.string().optional(),
  bpm: z.coerce.number().int().positive().optional(),
  key: z.string().optional(),
  artistIds: z
    .array(
      z.object({
        artistId: z.string().min(1),
        role: z.enum(['PRIMARY', 'FEATURED', 'PRODUCER']).default('PRIMARY'),
      }),
    )
    .optional(),
});

export const UpdateRecordingSchema = CreateRecordingSchema.partial();
export type CreateRecordingDto = z.infer<typeof CreateRecordingSchema>;
export type UpdateRecordingDto = z.infer<typeof UpdateRecordingSchema>;

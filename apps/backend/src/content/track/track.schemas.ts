import { z } from 'zod';

/**
 * Schema for creating a Track
 * Track = a Recording in context of an Album
 */
export const CreateTrackSchema = z.object({
  // Required relationships
  recordingId: z.string().min(1, 'Recording ID is required'),
  albumId: z.string().min(1, 'Album ID is required'),

  // Required positioning
  trackNumber: z.coerce.number().int().positive(),
  discNumber: z.coerce.number().int().positive().optional().default(1),

  // Override fields (optional - inherit from recording if not set)
  overrideTitle: z.string().optional().describe('Different title for this album context'),
  overrideIsExplicit: z.boolean().optional().describe('Override recording explicit flag'),

  // Track-specific image (optional - defaults to album cover)
  coverImageUrl: z.string().optional(),

  // Artists (optional - inherit from recording if not set)
  artistIds: z
    .array(
      z.object({
        artistId: z.string().min(1),
        role: z.enum(['PRIMARY', 'FEATURED', 'PRODUCER']).default('PRIMARY'),
      }),
    )
    .optional()
    .describe('Track-specific artists (inherits from recording if not provided)'),
});

export const UpdateTrackSchema = CreateTrackSchema.partial();

export type CreateTrackDto = z.infer<typeof CreateTrackSchema>;
export type UpdateTrackDto = z.infer<typeof UpdateTrackSchema>;

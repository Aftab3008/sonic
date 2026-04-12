import { z } from "zod";

export const CreateTrackSchema = z.object({
  recordingId: z.string().min(1, "Recording ID is required"),
  albumId: z.string().min(1, "Album ID is required"),
  trackNumber: z.coerce.number().int().positive(),
  discNumber: z.coerce.number().int().positive().optional().default(1),
  overrideTitle: z.string().optional(),
  overrideIsExplicit: z.boolean().optional(),
  coverImageUrl: z.string().optional(),
  artistIds: z
    .array(
      z.object({
        artistId: z.string().min(1),
        role: z.enum(["PRIMARY", "FEATURED", "PRODUCER"]),
        name: z.string().optional(),
      }),
    )
    .optional(),
});

export const UpdateTrackSchema = CreateTrackSchema.partial();

export type UpdateTrackType = z.input<typeof UpdateTrackSchema>;
export type CreateTrackType = z.input<typeof CreateTrackSchema>;

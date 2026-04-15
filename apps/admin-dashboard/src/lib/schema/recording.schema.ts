import { z } from "zod";

export const CreateRecordingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  sourceAudioUrl: z.string().optional(),
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
        role: z.enum(["PRIMARY", "FEATURED", "PRODUCER"]),
        name: z.string().optional(),
      }),
    )
    .optional(),
  audioProcessStatus: z
    .enum(["PENDING_UPLOAD", "UPLOADED", "PROCESSING", "SUCCEEDED", "FAILED"])
    .optional(),
  batchJobId: z.string().optional(),
});

export const UpdateRecordingSchema = CreateRecordingSchema.partial();

export type UpdateRecordingType = z.input<typeof UpdateRecordingSchema>;
export type CreateRecordingType = z.input<typeof CreateRecordingSchema>;

import { z } from 'zod';

export const CreateAlbumSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  albumType: z.enum(['ALBUM', 'SINGLE', 'EP', 'COMPILATION']).default('ALBUM'),
  releaseStatus: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  coverImageUrl: z.string().optional(),
  releaseDate: z.string().min(1, 'Release date is required'),
  upc: z.string().optional(),
  recordLabel: z.string().optional(),
  copyright: z.string().optional(),
  artistIds: z.array(z.object({
    artistId: z.string().min(1),
    role: z.enum(['PRIMARY', 'FEATURED', 'PRODUCER']).default('PRIMARY'),
  })).optional(),
  genreIds: z.array(z.string()).optional(),
});

export const UpdateAlbumSchema = CreateAlbumSchema.partial();

export type CreateAlbumDto = z.infer<typeof CreateAlbumSchema>;
export type UpdateAlbumDto = z.infer<typeof UpdateAlbumSchema>;

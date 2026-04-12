import { z } from 'zod';

export const CreateGenreSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  icon: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
});

export const UpdateGenreSchema = CreateGenreSchema.partial();

export type CreateGenreDto = z.infer<typeof CreateGenreSchema>;
export type UpdateGenreDto = z.infer<typeof UpdateGenreSchema>;

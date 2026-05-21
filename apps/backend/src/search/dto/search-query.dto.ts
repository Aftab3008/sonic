import { z } from 'zod';

export const SearchQuerySchema = z.object({
  q: z.string().min(1).max(200),
  type: z.enum(['all', 'songs', 'albums', 'artists']).default('all'),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export type SearchQueryDto = z.infer<typeof SearchQuerySchema>;

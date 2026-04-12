import { z } from "zod";

export const CreateArtistSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  bio: z.string().optional(),
  imageUrl: z.string().optional(),
  headerImageUrl: z.string().optional(),
  isVerified: z.boolean().optional().default(false),
  socialLinks: z
    .object({
      instagram: z.string().optional(),
      twitter: z.string().optional(),
      website: z.string().optional(),
    })
    .optional(),
});

export const UpdateArtistSchema = CreateArtistSchema.partial();

export type CreateArtistType = z.input<typeof CreateArtistSchema>;
export type UpdateArtistType = z.input<typeof UpdateArtistSchema>;

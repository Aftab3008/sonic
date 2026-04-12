import { z } from "zod";

export const AlbumTypes = z.enum(["ALBUM", "SINGLE", "EP", "COMPILATION"]);
export const AlbumReleaseStatuses = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const ArtistType = z.object({
  artistId: z.string().min(1),
  role: z.enum(["PRIMARY", "FEATURED", "PRODUCER"]).default("PRIMARY"),
  name: z.string().optional(),
});

export const CreateAlbumSchema = z.object({
  title: z.string().min(1, "Title is required"),
  albumType: AlbumTypes.default("ALBUM"),
  releaseStatus: AlbumReleaseStatuses.default("DRAFT"),
  coverImageUrl: z.string().optional(),
  releaseDate: z.string().min(1, "Release date is required"),
  upc: z.string().optional(),
  recordLabel: z.string().optional(),
  copyright: z.string().optional(),
  artistIds: ArtistType.array().optional(),
  genreIds: z.array(z.string()).optional(),
});

export const UpdateAlbumSchema = CreateAlbumSchema.partial();
export type CreateAlbumType = z.input<typeof CreateAlbumSchema>;
export type UpdateAlbumType = z.input<typeof UpdateAlbumSchema>;

export type AlbumType = z.infer<typeof AlbumTypes>;
export type AlbumReleaseStatus = z.infer<typeof AlbumReleaseStatuses>;
export type ArtistIdType = z.infer<typeof ArtistType>;

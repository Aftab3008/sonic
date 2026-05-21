import { Injectable } from '@nestjs/common';
import type { AlbumDocument } from '../interfaces/search-engine.interface';

/**
 * AlbumIndexer — maps a Drizzle album DB row → AlbumDocument.
 * Only PUBLISHED albums are indexed.
 */
@Injectable()
export class AlbumIndexer {
  build(row: {
    id: string;
    publicId: string;
    title: string;
    albumType: string;
    coverImageUrl: string | null;
    releaseDate: string;
    releaseStatus: string;
    artists?: Array<{ artist: { id: string; name: string } }>;
    genres?: Array<{ genre: { name: string } }>;
    tracks?: Array<{ id: string }>;
  }): AlbumDocument | null {
    if (row.releaseStatus !== 'PUBLISHED') {
      return null;
    }

    return {
      id: row.id,
      publicId: row.publicId,
      title: row.title,
      albumType: row.albumType,
      coverImageUrl: row.coverImageUrl ?? null,
      releaseDate: row.releaseDate,
      artists: (row.artists ?? []).map((a) => a.artist.name),
      artistIds: (row.artists ?? []).map((a) => a.artist.id),
      genres: (row.genres ?? []).map((g) => g.genre.name),
      trackCount: row.tracks?.length ?? 0,
      releaseStatus: 'PUBLISHED',
    };
  }
}

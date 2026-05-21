import { Injectable } from '@nestjs/common';
import type { ArtistDocument } from '../interfaces/search-engine.interface';

/**
 * ArtistIndexer — maps a Drizzle artist DB row → ArtistDocument.
 * All artists are indexed (no status filter for artists).
 */
@Injectable()
export class ArtistIndexer {
  build(row: {
    id: string;
    name: string;
    slug: string;
    bio: string | null;
    imageUrl: string | null;
    isVerified: boolean;
    monthlyListeners: number;
  }): ArtistDocument {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      bio: row.bio ?? null,
      imageUrl: row.imageUrl ?? null,
      isVerified: row.isVerified,
      monthlyListeners: row.monthlyListeners ?? 0,
    };
  }
}

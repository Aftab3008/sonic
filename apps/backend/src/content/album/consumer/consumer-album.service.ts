import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as sc from '../../../../db/schema';
import { DB_CONNECTION } from '../../../db/db.provider';
import { eq, desc } from 'drizzle-orm';

/**
 * Consumer Album Service
 *
 * Handles all album operations for public/consumer-facing API.
 * - Only returns published/released content
 * - Sanitizes output to remove internal fields
 * - Optimized for public consumption (e.g., music streaming app users)
 */
@Injectable()
export class ConsumerAlbumService {
  constructor(@Inject(DB_CONNECTION) private db: NodePgDatabase<typeof sc>) {}

  async getAlbums(limit: number = 3) {
    const albums = await this.db.query.album.findMany({
      where: eq(sc.album.releaseStatus, 'PUBLISHED'),
      columns: {
        id: true,
        title: true,
        albumType: true,
        releaseDate: true,
        coverImageUrl: true,
      },
      with: {
        artists: {
          with: { artist: { columns: { id: true, name: true } } },
        },
      },
      orderBy: [desc(sc.album.createdAt)],
      limit,
    });
    return albums;
  }

  async getAlbumById(albumId: string) {
    const album = await this.db.query.album.findFirst({
      where: eq(sc.album.id, albumId),
      columns: {
        id: true,
        title: true,
        albumType: true,
        releaseDate: true,
        coverImageUrl: true,
      },
      with: {
        artists: {
          with: { artist: { columns: { id: true, name: true } } },
        },
        tracks: {
          columns: {
            id: true,
            trackNumber: true,
            overrideTitle: true,
            coverImageUrl: true,
            recordingId: true,
          },
          with: {
            recording: {
              columns: {
                id: true,
                title: true,
                durationMs: true,
                audioUrl: true,
              },
            },
          },
        },
      },
    });
    return album;
  }
}

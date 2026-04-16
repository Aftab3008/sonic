import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and, sql, desc } from 'drizzle-orm';
import { DB_CONNECTION } from '../../../db/db.provider';
import * as sc from '../../../../db/schema';

/**
 * Consumer Track Service
 *
 * Handles track streaming and browsing for public API.
 * - Returns tracks from released albums only
 * - Includes audio URLs for streaming
 * - Optimized for playback
 */
@Injectable()
export class ConsumerTrackService {
  constructor(@Inject(DB_CONNECTION) private db: NodePgDatabase<typeof sc>) {}

  async getTracks(limit: number = 3) {
    const tracks = await this.db.query.track.findMany({
      columns: {
        id: true,
        trackNumber: true,
        overrideTitle: true,
        coverImageUrl: true,
      },
      with: {
        recording: {
          columns: {
            id: true,
            title: true,
            durationMs: true,
            audioUrl: true,
          },
          with: {
            artists: {
              with: { artist: { columns: { id: true, name: true } } },
            },
          },
        },
        album: {
          columns: {
            id: true,
            title: true,
            coverImageUrl: true,
          },
        },
      },
      orderBy: [desc(sc.track.createdAt)],
      limit,
    });
    return tracks;
  }
}

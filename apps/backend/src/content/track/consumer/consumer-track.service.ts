import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { desc, sql } from 'drizzle-orm';
import { DB_CONNECTION } from '../../../db/db.provider';
import * as sc from '../../../../db/schema';

@Injectable()
export class ConsumerTrackService {
  constructor(@Inject(DB_CONNECTION) private db: NodePgDatabase<typeof sc>) {}

  async getTracks(limit: number = 3) {
    return await this.db.query.track.findMany({
      columns: {
        publicId: true,
        trackNumber: true,
        overrideTitle: true,
        coverImageUrl: true,
      },
      extras: {
        id: sql<string>`${sc.track.publicId}`.as('id'),
      },
      with: {
        recording: {
          columns: {
            publicId: true,
            title: true,
            durationMs: true,
            audioUrl: true,
          },
          extras: {
            id: sql<string>`${sc.recording.publicId}`.as('id'),
          },
          with: {
            artists: {
              with: {
                artist: {
                  columns: { id: true, name: true, slug: true },
                },
              },
            },
          },
        },
        album: {
          columns: {
            publicId: true,
            title: true,
            albumType: true,
            coverImageUrl: true,
            releaseDate: true,
          },
          extras: {
            id: sql<string>`${sc.album.publicId}`.as('id'),
          },
        },
      },
      orderBy: [desc(sc.track.createdAt)],
      limit,
    });
  }
}

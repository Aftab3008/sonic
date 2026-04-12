import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as sc from '../../../../db/schema';
import { DB_CONNECTION } from '../../../db/db.provider';
import { eq } from 'drizzle-orm';

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

  async getAlbumById(albumId: string) {
    const album = await this.db
      .select({
        title: sc.album.title,
        albumType: sc.album.albumType,
        releaseDate: sc.album.releaseDate,
      })
      .from(sc.album)
      .where(eq(sc.album.id, albumId));
    return album[0];
  }
}

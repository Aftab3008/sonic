import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and, sql } from 'drizzle-orm';
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
}

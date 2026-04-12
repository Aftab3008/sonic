import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, ilike, sql } from 'drizzle-orm';
import { DB_CONNECTION } from '../../../db/db.provider';
import * as sc from '../../../../db/schema';

/**
 * Consumer Artist Service
 *
 * Handles all artist operations for public/consumer-facing API.
 * - Only returns verified/active artists
 * - Sanitizes output to remove internal fields
 * - Optimized for public consumption
 */
@Injectable()
export class ConsumerArtistService {
  constructor(@Inject(DB_CONNECTION) private db: NodePgDatabase<typeof sc>) {}
}

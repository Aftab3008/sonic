import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, sql } from 'drizzle-orm';
import { DB_CONNECTION } from '../../../db/db.provider';
import * as sc from '../../../../db/schema';

/**
 * Consumer Genre Service
 *
 * Handles genre browsing for public API.
 * Read-only operations with sanitized output.
 */
@Injectable()
export class ConsumerGenreService {
  constructor(@Inject(DB_CONNECTION) private db: NodePgDatabase<typeof sc>) {}
}

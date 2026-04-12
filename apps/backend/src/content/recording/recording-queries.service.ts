import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as sc from '../../../db/schema';
import { DB_CONNECTION } from '../../db/db.provider';

/**
 * Shared Recording Query Service (Option A Pattern)
 *
 * This service contains common database queries that are reused
 * between Admin and Consumer contexts.
 *
 * Currently using Option B (Duplicate Queries) for flexibility.
 */
@Injectable()
export class RecordingQueries {
  constructor(
    @Inject(DB_CONNECTION) private db: NodePgDatabase<typeof sc>,
  ) {}
}

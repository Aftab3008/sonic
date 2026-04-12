import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and, sql } from 'drizzle-orm';
import { DB_CONNECTION } from '../../../db/db.provider';
import * as sc from '../../../../db/schema';

/**
 * Consumer Recording Service
 *
 * Note: Recordings are typically not exposed directly to consumers.
 * They access content through Tracks instead.
 * This service provides limited recording data when needed.
 */
@Injectable()
export class ConsumerRecordingService {
  constructor(@Inject(DB_CONNECTION) private db: NodePgDatabase<typeof sc>) {}
}

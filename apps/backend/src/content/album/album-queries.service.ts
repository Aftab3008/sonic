import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as sc from '../../../db/schema';
import { DB_CONNECTION } from '../../db/db.provider';

/**
 * Shared Album Query Service (Option A Pattern)
 *
 * This service contains common database queries that are reused
 * between Admin and Consumer contexts.
 *
 * Use this when Admin and Consumer services need the EXACT same query logic.
 * For divergent queries, keep them directly in the respective services.
 *
 * Currently using Option B (Duplicate Queries) for flexibility.
 * Uncomment and implement methods here if query duplication becomes a maintenance burden.
 */
@Injectable()
export class AlbumQueries {
  constructor(@Inject(DB_CONNECTION) private db: NodePgDatabase<typeof sc>) {}

  /*
   * Example shared query methods:
   *
   * async findById(id: string, options?: { withRelations?: boolean }) {
   *   return this.db.query.album.findFirst({
   *     where: eq(sc.album.id, id),
   *     with: { ... }
   *   });
   * }
   *
   * async findMany(options: FindManyOptions) {
   *   return this.db.query.album.findMany({ ... });
   * }
   *
   * async exists(id: string) {
   *   const result = await this.db.select({ count: count() }).from(sc.album).where(eq(sc.album.id, id));
   *   return result[0]?.count > 0;
   * }
   */
}

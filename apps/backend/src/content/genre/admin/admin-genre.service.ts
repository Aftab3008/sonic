import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DB_CONNECTION } from '../../../db/db.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as sc from '../../../../db/schema';
import { eq } from 'drizzle-orm';
import { parseCursorQuery } from '../../../common/utils/query-parser';
import { cursorPaginate } from '../../../common/utils/cursor-paginate';
import type { CursorPage } from '../../../common/types/pagination.types';
import type { CreateGenreDto, UpdateGenreDto } from './dto/genre.schemas';
import { count } from 'drizzle-orm';

/**
 * Admin Genre Service
 *
 * Handles all genre operations for admin panel.
 * - Full CRUD operations
 * - Access to all genres
 */
@Injectable()
export class AdminGenreService {
  constructor(@Inject(DB_CONNECTION) private db: NodePgDatabase<typeof sc>) {}

  private readonly sortableColumns = {
    id: sc.genre.id,
    name: sc.genre.name,
    slug: sc.genre.slug,
    createdAt: sc.genre.createdAt,
  } as const;

  private readonly filterableColumns = {
    name: sc.genre.name,
    slug: sc.genre.slug,
  } as const;

  async list(
    query: Record<string, string | undefined>,
  ): Promise<CursorPage<any>> {
    const params = parseCursorQuery(query, this.filterableColumns);

    return cursorPaginate({
      db: this.db,
      queryBuilder: this.db.query.genre,
      table: sc.genre,
      params,
      sortableColumns: this.sortableColumns,
      filterableColumns: this.filterableColumns,
      defaultSortColumn: sc.genre.createdAt,
      idColumn: sc.genre.id,
    });
  }

  async findOne(id: string) {
    const result = await this.db
      .select()
      .from(sc.genre)
      .where(eq(sc.genre.id, id));
    if (!result.length) throw new NotFoundException('Genre not found');
    return result[0];
  }

  async create(dto: CreateGenreDto) {
    const result = await this.db.insert(sc.genre).values(dto).returning();
    return result[0];
  }

  async update(id: string, dto: UpdateGenreDto) {
    const result = await this.db
      .update(sc.genre)
      .set({ ...dto, updatedAt: new Date() })
      .where(eq(sc.genre.id, id))
      .returning();
    if (!result.length) throw new NotFoundException('Genre not found');
    return result[0];
  }

  async remove(id: string) {
    const result = await this.db
      .delete(sc.genre)
      .where(eq(sc.genre.id, id))
      .returning();
    if (!result.length) throw new NotFoundException('Genre not found');
    return result[0];
  }

  async getTotalGenresCount() {
    const result = await this.db.select({ count: count() }).from(sc.genre);
    return result[0]?.count ?? 0;
  }

  async getAllGenres() {
    return this.db
      .select({
        id: sc.genre.id,
        name: sc.genre.name,
        slug: sc.genre.slug,
      })
      .from(sc.genre);
  }
}

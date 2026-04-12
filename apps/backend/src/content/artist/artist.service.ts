import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq, is } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as sc from '../../../db/schema';
import { parseCursorQuery } from '../../common/utils/query-parser';
import { cursorPaginate } from '../../common/utils/cursor-paginate';
import type { CursorPage } from '../../common/types/pagination.types';
import { DB_CONNECTION } from '../../db/db.provider';
import type { CreateArtistDto, UpdateArtistDto } from './artist.schemas';
import { count } from 'drizzle-orm';
import sl from 'zod/v4/locales/sl.js';

@Injectable()
export class ArtistService {
  constructor(@Inject(DB_CONNECTION) private db: NodePgDatabase<typeof sc>) {}

  private readonly sortableColumns = {
    id: sc.artist.id,
    name: sc.artist.name,
    slug: sc.artist.slug,
    monthlyListeners: sc.artist.monthlyListeners,
    createdAt: sc.artist.createdAt,
  } as const;

  private readonly filterableColumns = {
    name: sc.artist.name,
    slug: sc.artist.slug,
  } as const;

  async list(
    query: Record<string, string | undefined>,
  ): Promise<CursorPage<any>> {
    const params = parseCursorQuery(query, this.filterableColumns);

    return cursorPaginate({
      db: this.db,
      queryBuilder: this.db.query.artist,
      table: sc.artist,
      params,
      sortableColumns: this.sortableColumns,
      filterableColumns: this.filterableColumns,
      defaultSortColumn: sc.artist.createdAt,
      idColumn: sc.artist.id,
      findManyExtras: {
        columns: {
          id: true,
          name: true,
          imageUrl: true,
          isVerified: true,
          monthlyListeners: true,
          slug: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    });
  }

  async findOne(id: string) {
    const result = await this.db.query.artist.findFirst({
      where: eq(sc.artist.id, id),
      with: {
        albums: {
          with: { album: { columns: { id: true, title: true, coverImageUrl: true, releaseDate: true, releaseStatus: true } } },
        },
        tracks: {
          with: { track: { columns: { id: true, trackNumber: true, discNumber: true, overrideTitle: true, recordingId: true, albumId: true } } },
        },
      },
    });
    if (!result) {
      throw new NotFoundException('Artist not found');
    }
    return result;
  }

  async create(dto: CreateArtistDto) {
    const result = await this.db.insert(sc.artist).values(dto).returning();
    return result[0];
  }

  async update(id: string, dto: UpdateArtistDto) {
    const result = await this.db
      .update(sc.artist)
      .set({ ...dto, updatedAt: new Date() })
      .where(eq(sc.artist.id, id))
      .returning();
    if (!result.length) {
      throw new NotFoundException('Artist not found');
    }
    return result[0];
  }

  async remove(id: string) {
    const result = await this.db
      .delete(sc.artist)
      .where(eq(sc.artist.id, id))
      .returning();
    if (!result.length) {
      throw new NotFoundException('Artist not found');
    }
    return result[0];
  }

  async getTotalArtistsCount() {
    const result = await this.db.select({ count: count() }).from(sc.artist);
    return result[0]?.count ?? 0;
  }

  async getAllArtists() {
    return this.db
      .select({
        id: sc.artist.id,
        name: sc.artist.name,
        imageUrl: sc.artist.imageUrl,
        slug: sc.artist.slug,
        isVerified: sc.artist.isVerified,
      })
      .from(sc.artist);
  }
}

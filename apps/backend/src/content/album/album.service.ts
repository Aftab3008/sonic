import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DB_CONNECTION } from '../../db/db.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as sc from '../../../db/schema';
import { eq, count } from 'drizzle-orm';
import { parseCursorQuery } from '../../common/utils/query-parser';
import { cursorPaginate } from '../../common/utils/cursor-paginate';
import type { CursorPage } from '../../common/types/pagination.types';
import type { CreateAlbumDto, UpdateAlbumDto } from './album.schemas';

@Injectable()
export class AlbumService {
  constructor(@Inject(DB_CONNECTION) private db: NodePgDatabase<typeof sc>) {}

  private readonly sortableColumns = {
    id: sc.album.id,
    title: sc.album.title,
    albumType: sc.album.albumType,
    releaseStatus: sc.album.releaseStatus,
    releaseDate: sc.album.releaseDate,
    createdAt: sc.album.createdAt,
  } as const;

  private readonly filterableColumns = {
    title: sc.album.title,
    albumType: sc.album.albumType,
    releaseStatus: sc.album.releaseStatus,
  } as const;

  async list(
    query: Record<string, string | undefined>,
  ): Promise<CursorPage<any>> {
    const params = parseCursorQuery(query, this.filterableColumns);

    return cursorPaginate({
      db: this.db,
      queryBuilder: this.db.query.album,
      table: sc.album,
      params,
      sortableColumns: this.sortableColumns,
      filterableColumns: this.filterableColumns,
      defaultSortColumn: sc.album.createdAt,
      idColumn: sc.album.id,
      findManyExtras: {
        with: {
          artists: { with: { artist: true } },
          genres: { with: { genre: true } },
        },
      },
    });
  }

  async findOne(id: string) {
    const result = await this.db.query.album.findFirst({
      where: eq(sc.album.id, id),
      with: {
        artists: { with: { artist: true } },
        tracks: {
          with: { artists: { with: { artist: true } } },
          orderBy: [sc.track.trackNumber],
        },
        genres: { with: { genre: true } },
      },
    });

    if (!result) {
      throw new NotFoundException('Album not found');
    }

    return result;
  }

  async create(dto: CreateAlbumDto) {
    return this.db.transaction(async (tx) => {
      const { artistIds, genreIds, ...albumData } = dto;
      const [album] = await tx.insert(sc.album).values(albumData).returning();

      if (artistIds?.length) {
        await tx.insert(sc.albumArtist).values(
          artistIds.map((a) => ({
            albumId: album.id,
            artistId: a.artistId,
            role: a.role,
          })),
        );
      }

      if (genreIds?.length) {
        await tx.insert(sc.albumGenre).values(
          genreIds.map((genreId) => ({
            albumId: album.id,
            genreId,
          })),
        );
      }

      return this.findOneWithTx(tx, album.id);
    });
  }

  async update(id: string, dto: UpdateAlbumDto) {
    const existing = await this.findOne(id);

    if (!existing) {
      throw new NotFoundException('Album not found');
    }

    return this.db.transaction(async (tx) => {
      const { artistIds, genreIds, ...albumData } = dto;

      if (Object.keys(albumData).length > 0) {
        await tx
          .update(sc.album)
          .set({ ...albumData, updatedAt: new Date() })
          .where(eq(sc.album.id, id));
      }

      if (artistIds !== undefined) {
        await tx.delete(sc.albumArtist).where(eq(sc.albumArtist.albumId, id));
        if (artistIds.length) {
          await tx.insert(sc.albumArtist).values(
            artistIds.map((a) => ({
              albumId: id,
              artistId: a.artistId,
              role: a.role,
            })),
          );
        }
      }

      if (genreIds !== undefined) {
        await tx.delete(sc.albumGenre).where(eq(sc.albumGenre.albumId, id));
        if (genreIds.length) {
          await tx.insert(sc.albumGenre).values(
            genreIds.map((genreId) => ({
              albumId: id,
              genreId,
            })),
          );
        }
      }

      return this.findOneWithTx(tx, id);
    });
  }

  async remove(id: string) {
    const result = await this.db
      .delete(sc.album)
      .where(eq(sc.album.id, id))
      .returning();

    if (!result.length) {
      throw new NotFoundException('Album not found');
    }

    return result[0];
  }

  private async findOneWithTx(tx: NodePgDatabase<typeof sc>, id: string) {
    return tx.query.album.findFirst({
      where: eq(sc.album.id, id),
      with: {
        artists: { with: { artist: true } },
        genres: { with: { genre: true } },
      },
    });
  }

  async getTotalAlbumsCount() {
    const result = await this.db.select({ count: count() }).from(sc.album);
    return result[0]?.count ?? 0;
  }
}

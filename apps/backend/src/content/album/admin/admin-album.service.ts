import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as sc from '../../../../db/schema';
import { eq, count } from 'drizzle-orm';
import { DB_CONNECTION } from '../../../db/db.provider';
import { parseCursorQuery } from '../../../common/utils/query-parser';
import { cursorPaginate } from '../../../common/utils/cursor-paginate';
import type { CursorPage } from '../../../common/types/pagination.types';
import type { CreateAlbumDto, UpdateAlbumDto } from './dto/album.schemas';

/**
 * Admin Album Service
 *
 * Handles all album operations for admin panel.
 * - Full CRUD operations
 * - Access to all albums regardless of release status
 * - Includes internal fields and statistics
 * - Supports complex filtering and pagination for admin UI
 */
@Injectable()
export class AdminAlbumService {
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

  /**
   * List albums with cursor pagination for admin panel
   * Shows all albums including drafts and unreleased
   */
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
        columns: {
          id: true,
          title: true,
          albumType: true,
          releaseStatus: true,
          releaseDate: true,
          coverImageUrl: true,
          createdAt: true,
          updatedAt: true,
        },
        with: {
          artists: { with: { artist: { columns: { id: true, name: true } } } },
          genres: { with: { genre: { columns: { id: true, name: true } } } },
        },
      },
    });
  }

  /**
   * Find single album by ID (admin access)
   * Returns full details including all internal fields
   */
  async findOne(id: string) {
    const result = await this.db.query.album.findFirst({
      where: eq(sc.album.id, id),
      with: {
        artists: { with: { artist: { columns: { id: true, name: true } } } },
        tracks: {
          columns: {
            id: true,
            trackNumber: true,
            discNumber: true,
            overrideTitle: true,
            coverImageUrl: true,
            playCount: true,
            recordingId: true,
            overrideIsExplicit: true,
          },
          with: {
            artists: {
              with: { artist: { columns: { id: true, name: true } } },
            },
            recording: true,
          },
          orderBy: [sc.track.trackNumber],
        },
        genres: { with: { genre: { columns: { id: true, name: true } } } },
      },
    });

    if (!result) {
      throw new NotFoundException('Album not found');
    }

    return result;
  }

  /**
   * Create new album
   */
  async create(dto: CreateAlbumDto) {
    return this.db.transaction(async (tx) => {
      const { artistIds, genreIds, ...albumData } = dto;

      const sanitizedData = {
        ...albumData,
        upc: albumData.upc || null,
        recordLabel: albumData.recordLabel || null,
        copyright: albumData.copyright || null,
        coverImageUrl: albumData.coverImageUrl || null,
      };

      const [album] = await tx
        .insert(sc.album)
        .values(sanitizedData)
        .returning();

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

  /**
   * Update existing album
   */
  async update(id: string, dto: UpdateAlbumDto) {
    const existing = await this.findOne(id);

    if (!existing) {
      throw new NotFoundException('Album not found');
    }

    return this.db.transaction(async (tx) => {
      const { artistIds, genreIds, ...albumData } = dto;

      const sanitizedData = {
        ...albumData,
        ...(albumData.upc !== undefined && { upc: albumData.upc || null }),
        ...(albumData.recordLabel !== undefined && {
          recordLabel: albumData.recordLabel || null,
        }),
        ...(albumData.copyright !== undefined && {
          copyright: albumData.copyright || null,
        }),
        ...(albumData.coverImageUrl !== undefined && {
          coverImageUrl: albumData.coverImageUrl || null,
        }),
      };

      if (Object.keys(sanitizedData).length > 0) {
        await tx
          .update(sc.album)
          .set({ ...sanitizedData, updatedAt: new Date() })
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

  /**
   * Delete album
   */
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

  /**
   * Get total count of albums for admin stats
   */
  async getTotalAlbumsCount() {
    const result = await this.db.select({ count: count() }).from(sc.album);
    return result[0]?.count ?? 0;
  }

  private async findOneWithTx(tx: NodePgDatabase<typeof sc>, id: string) {
    return tx.query.album.findFirst({
      where: eq(sc.album.id, id),
      with: {
        artists: { with: { artist: { columns: { id: true, name: true } } } },
        genres: { with: { genre: { columns: { id: true, name: true } } } },
      },
    });
  }
}

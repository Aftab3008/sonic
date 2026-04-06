import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DB_CONNECTION } from '../../db/db.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as sc from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { parseCursorQuery } from '../../common/utils/query-parser';
import { cursorPaginate } from '../../common/utils/cursor-paginate';
import type { CursorPage } from '../../common/types/pagination.types';
import type { CreateTrackDto, UpdateTrackDto } from './track.schemas';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class TrackService {
  constructor(
    @Inject(DB_CONNECTION) private db: NodePgDatabase<typeof sc>,
    private readonly uploadService: UploadService,
  ) {}

  private readonly sortableColumns = {
    id: sc.track.id,
    title: sc.track.title,
    trackNumber: sc.track.trackNumber,
    durationMs: sc.track.durationMs,
    playCount: sc.track.playCount,
    releaseStatus: sc.track.releaseStatus,
    createdAt: sc.track.createdAt,
  } as const;

  private readonly filterableColumns = {
    title: sc.track.title,
    albumId: sc.track.albumId,
    releaseStatus: sc.track.releaseStatus,
  } as const;

  async list(
    query: Record<string, string | undefined>,
  ): Promise<CursorPage<any>> {
    const params = parseCursorQuery(query, this.filterableColumns);

    return cursorPaginate({
      db: this.db,
      queryBuilder: this.db.query.track,
      table: sc.track,
      params,
      sortableColumns: this.sortableColumns,
      filterableColumns: this.filterableColumns,
      defaultSortColumn: sc.track.createdAt,
      idColumn: sc.track.id,
      findManyExtras: {
        with: {
          album: true,
          artists: { with: { artist: true } },
        },
      },
    });
  }

  async findOne(id: string) {
    const result = await this.db.query.track.findFirst({
      where: eq(sc.track.id, id),
      with: {
        album: {
          with: { artists: { with: { artist: true } } },
        },
        artists: { with: { artist: true } },
      },
    });
    if (!result) throw new NotFoundException('Track not found');
    return result;
  }

  async create(dto: CreateTrackDto) {
    return this.db.transaction(async (tx) => {
      const { artistIds, ...trackData } = dto;
      const [track] = await tx.insert(sc.track).values(trackData).returning();

      if (artistIds?.length) {
        await tx.insert(sc.trackArtist).values(
          artistIds.map((a) => ({
            trackId: track.id,
            artistId: a.artistId,
            role: a.role as any,
          })),
        );
      }

      return this.findOneWithTx(tx, track.id);
    });
  }

  async update(id: string, dto: UpdateTrackDto) {
    const existing = await this.findOne(id); // Throws if not found

    return this.db.transaction(async (tx) => {
      const { artistIds, ...trackData } = dto;

      if (Object.keys(trackData).length > 0) {
        await tx
          .update(sc.track)
          .set({ ...trackData, updatedAt: new Date() })
          .where(eq(sc.track.id, id));
      }

      if (artistIds !== undefined) {
        await tx.delete(sc.trackArtist).where(eq(sc.trackArtist.trackId, id));
        if (artistIds.length) {
          await tx.insert(sc.trackArtist).values(
            artistIds.map((a) => ({
              trackId: id,
              artistId: a.artistId,
              role: a.role as any,
            })),
          );
        }
      }

      return this.findOneWithTx(tx, id);
    });
  }

  async remove(id: string) {
    const result = await this.db
      .delete(sc.track)
      .where(eq(sc.track.id, id))
      .returning();
    if (!result.length) throw new NotFoundException('Track not found');
    return result[0];
  }

  private async findOneWithTx(tx: any, id: string) {
    return tx.query.track.findFirst({
      where: eq(sc.track.id, id),
      with: {
        album: true,
        artists: { with: { artist: true } },
      },
    });
  }

  async generateUploadUrl(id: string, filename: string, contentType: string) {
    const track = await this.findOne(id);
    return this.uploadService.getPresignedAudioUrl(
      filename,
      contentType,
      track.id,
      track.albumId,
    );
  }

  async updateAudioStatus(
    id: string,
    status:
      | 'PENDING_UPLOAD'
      | 'UPLOADED'
      | 'PROCESSING'
      | 'SUCCEEDED'
      | 'FAILED',
  ) {
    const result = await this.db
      .update(sc.track)
      .set({ audioProcessStatus: status, updatedAt: new Date() })
      .where(eq(sc.track.id, id))
      .returning();

    if (!result.length) throw new NotFoundException('Track not found');
    return result[0];
  }
}

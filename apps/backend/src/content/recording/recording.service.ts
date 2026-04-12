import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DB_CONNECTION } from '../../db/db.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as sc from '../../../db/schema';
import { eq, count } from 'drizzle-orm';
import { parseCursorQuery } from '../../common/utils/query-parser';
import { cursorPaginate } from '../../common/utils/cursor-paginate';
import type { CursorPage } from '../../common/types/pagination.types';
import type {
  CreateRecordingDto,
  UpdateRecordingDto,
} from './recording.schemas';

@Injectable()
export class RecordingService {
  constructor(@Inject(DB_CONNECTION) private db: NodePgDatabase<typeof sc>) {}

  private readonly sortableColumns = {
    id: sc.recording.id,
    title: sc.recording.title,
    durationMs: sc.recording.durationMs,
    createdAt: sc.recording.createdAt,
  } as const;

  private readonly filterableColumns = {
    title: sc.recording.title,
    audioProcessStatus: sc.recording.audioProcessStatus,
  } as const;

  async list(
    query: Record<string, string | undefined>,
  ): Promise<CursorPage<any>> {
    const params = parseCursorQuery(query, this.filterableColumns);

    return cursorPaginate({
      db: this.db,
      queryBuilder: this.db.query.recording,
      table: sc.recording,
      params,
      sortableColumns: this.sortableColumns,
      filterableColumns: this.filterableColumns,
      defaultSortColumn: sc.recording.createdAt,
      idColumn: sc.recording.id,
      findManyExtras: {
        columns: {
          id: true,
          title: true,
          durationMs: true,
          audioProcessStatus: true,
          audioUrl: true,
          isExplicit: true,
          createdAt: true,
          updatedAt: true,
        },
        with: {
          artists: { with: { artist: { columns: { id: true, name: true } } } },
        },
      },
    });
  }

  async findOne(id: string) {
    const result = await this.db.query.recording.findFirst({
      where: eq(sc.recording.id, id),
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
            albumId: true,
          },
          with: {
            album: { columns: { id: true, title: true, coverImageUrl: true } },
          },
          orderBy: [sc.track.createdAt],
        },
      },
    });

    if (!result) {
      throw new NotFoundException('Recording not found');
    }

    return result;
  }

  async create(dto: CreateRecordingDto) {
    return this.db.transaction(async (tx) => {
      const { artistIds, ...recordingData } = dto;

      const [recording] = await tx
        .insert(sc.recording)
        .values(recordingData)
        .returning();

      // Set recording artists
      if (artistIds?.length) {
        await tx.insert(sc.recordingArtist).values(
          artistIds.map((a) => ({
            recordingId: recording.id,
            artistId: a.artistId,
            role: a.role,
          })),
        );
      }

      return this.findOneWithTx(tx, recording.id);
    });
  }

  async update(id: string, dto: UpdateRecordingDto) {
    const existing = await this.findOne(id);
    if (!existing) {
      throw new NotFoundException('Recording not found');
    }

    return this.db.transaction(async (tx) => {
      const { artistIds, ...recordingData } = dto;

      // Update recording fields
      if (Object.keys(recordingData).length > 0) {
        await tx
          .update(sc.recording)
          .set({ ...recordingData, updatedAt: new Date() })
          .where(eq(sc.recording.id, id));
      }

      // Update artists
      if (artistIds !== undefined) {
        // Delete existing
        await tx
          .delete(sc.recordingArtist)
          .where(eq(sc.recordingArtist.recordingId, id));

        // Insert new
        if (artistIds.length) {
          await tx.insert(sc.recordingArtist).values(
            artistIds.map((a) => ({
              recordingId: id,
              artistId: a.artistId,
              role: a.role,
            })),
          );
        }
      }

      return this.findOneWithTx(tx, id);
    });
  }

  async remove(id: string) {
    const result = await this.db
      .delete(sc.recording)
      .where(eq(sc.recording.id, id))
      .returning();

    if (!result.length) {
      throw new NotFoundException('Recording not found');
    }

    return result[0];
  }

  async getAllRecordings() {
    return this.db
      .select({
        id: sc.recording.id,
        title: sc.recording.title,
        audioProcessStatus: sc.recording.audioProcessStatus,
        durationMs: sc.recording.durationMs,
      })
      .from(sc.recording);
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
      .update(sc.recording)
      .set({ audioProcessStatus: status, updatedAt: new Date() })
      .where(eq(sc.recording.id, id))
      .returning();

    if (!result.length) {
      throw new NotFoundException('Recording not found');
    }
    return result[0];
  }

  async updateAudioUrl(id: string, audioUrl: string, durationMs: number) {
    const result = await this.db
      .update(sc.recording)
      .set({
        audioUrl,
        durationMs,
        audioProcessStatus: 'UPLOADED',
        updatedAt: new Date(),
      })
      .where(eq(sc.recording.id, id))
      .returning();

    if (!result.length) {
      throw new NotFoundException('Recording not found');
    }
    return result[0];
  }

  async getTotalRecordingsCount() {
    const result = await this.db.select({ count: count() }).from(sc.recording);
    return result[0]?.count ?? 0;
  }

  private async findOneWithTx(tx: NodePgDatabase<typeof sc>, id: string) {
    return tx.query.recording.findFirst({
      where: eq(sc.recording.id, id),
      with: {
        artists: { with: { artist: { columns: { id: true, name: true } } } },
      },
    });
  }
}

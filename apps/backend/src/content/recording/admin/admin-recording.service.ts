import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DB_CONNECTION } from '../../../db/db.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as sc from '../../../../db/schema';
import { eq, count } from 'drizzle-orm';
import { parseCursorQuery } from '../../../common/utils/query-parser';
import { cursorPaginate } from '../../../common/utils/cursor-paginate';
import type { CursorPage } from '../../../common/types/pagination.types';
import type {
  ConfirmUploadDto,
  CreateRecordingDto,
  UpdateRecordingDto,
} from './dto/recording.schemas';

/**
 * Admin Recording Service
 *
 * Handles all recording operations for admin panel.
 * - Full CRUD operations
 * - Audio upload and processing management
 */
@Injectable()
export class AdminRecordingService {
  private readonly logger = new Logger(AdminRecordingService.name);
  private readonly region: string;
  private readonly processedBucket: string;
  private readonly cloudfrontAudioDomain: string | undefined;
  private readonly useCloudfront: boolean;

  constructor(
    @Inject(DB_CONNECTION) private db: NodePgDatabase<typeof sc>,
    private readonly configService: ConfigService,
  ) {
    this.region = this.configService.getOrThrow<string>('AWS_REGION');
    this.processedBucket = this.configService.getOrThrow<string>(
      'AWS_AUDIO_PROCESSED_BUCKET',
    );
    this.cloudfrontAudioDomain = this.configService.get<string>(
      'AWS_CLOUDFRONT_AUDIO_DOMAIN',
    );
    this.useCloudfront =
      this.configService.get<string>('USE_CLOUDFRONT') === 'true';
  }

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

      const sanitizedData = {
        ...recordingData,
        isrc: recordingData.isrc || null,
        audioUrl: recordingData.audioUrl || null,
        sourceAudioUrl: recordingData.sourceAudioUrl || null,
        codec: recordingData.codec || null,
        lyrics: recordingData.lyrics || null,
        key: recordingData.key || null,
        batchJobId: recordingData.batchJobId || null,
        audioProcessStatus:
          recordingData.audioProcessStatus || 'PENDING_UPLOAD',
      };

      const [recording] = await tx
        .insert(sc.recording)
        .values(sanitizedData)
        .returning();

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

  /**
   * Confirm that an audio file was successfully uploaded to S3.
   * This is the single source of truth for the PENDING_UPLOAD → UPLOADED transition.
   * Only allows transition from PENDING_UPLOAD or FAILED (re-upload).
   */
  async confirmUpload(id: string, dto: ConfirmUploadDto) {
    const existing = await this.db.query.recording.findFirst({
      where: eq(sc.recording.id, id),
    });

    if (!existing) {
      throw new NotFoundException('Recording not found');
    }

    const allowedStates = ['PENDING_UPLOAD', 'FAILED'];
    if (!allowedStates.includes(existing.audioProcessStatus)) {
      throw new BadRequestException(
        `Cannot confirm upload: recording is in '${existing.audioProcessStatus}' state. ` +
          `Only recordings in PENDING_UPLOAD or FAILED state can receive uploads.`,
      );
    }

    const [updated] = await this.db
      .update(sc.recording)
      .set({
        sourceAudioUrl: dto.sourceAudioUrl,
        durationMs: dto.durationMs ?? existing.durationMs,
        audioProcessStatus: 'UPLOADED',
        updatedAt: new Date(),
      })
      .where(eq(sc.recording.id, id))
      .returning();

    this.logger.log(`Recording ${id} upload confirmed: ${dto.sourceAudioUrl}`);

    return updated;
  }

  async update(id: string, dto: UpdateRecordingDto) {
    const existing = await this.findOne(id);
    if (!existing) {
      throw new NotFoundException('Recording not found');
    }

    return this.db.transaction(async (tx) => {
      const { artistIds, ...recordingData } = dto;

      const sanitizedData: Record<string, unknown> = {};

      if (recordingData.title !== undefined) {
        sanitizedData.title = recordingData.title;
      }
      if (recordingData.durationMs !== undefined) {
        sanitizedData.durationMs = recordingData.durationMs;
      }
      if (recordingData.fileSize !== undefined) {
        sanitizedData.fileSize = recordingData.fileSize;
      }
      if (recordingData.bitrate !== undefined) {
        sanitizedData.bitrate = recordingData.bitrate;
      }
      if (recordingData.sampleRate !== undefined) {
        sanitizedData.sampleRate = recordingData.sampleRate;
      }
      if (recordingData.isrc !== undefined) {
        sanitizedData.isrc = recordingData.isrc || null;
      }
      if (recordingData.isExplicit !== undefined) {
        sanitizedData.isExplicit = recordingData.isExplicit;
      }
      if (recordingData.hasLyrics !== undefined) {
        sanitizedData.hasLyrics = recordingData.hasLyrics;
      }
      if (recordingData.lyrics !== undefined) {
        sanitizedData.lyrics = recordingData.lyrics || null;
      }
      if (recordingData.bpm !== undefined) {
        sanitizedData.bpm = recordingData.bpm;
      }
      if (recordingData.key !== undefined) {
        sanitizedData.key = recordingData.key || null;
      }
      if (recordingData.codec !== undefined) {
        sanitizedData.codec = recordingData.codec || null;
      }
      if (recordingData.audioProcessStatus !== undefined) {
        sanitizedData.audioProcessStatus = recordingData.audioProcessStatus;
      }
      if (recordingData.batchJobId !== undefined) {
        sanitizedData.batchJobId = recordingData.batchJobId || null;
      }

      if (recordingData.audioUrl !== undefined) {
        const isProcessed =
          recordingData.audioProcessStatus === 'SUCCEEDED' ||
          existing.audioProcessStatus === 'SUCCEEDED';

        if (!isProcessed && recordingData.audioUrl) {
          sanitizedData.sourceAudioUrl = recordingData.audioUrl;
          sanitizedData.audioUrl = null;
        } else {
          sanitizedData.audioUrl = recordingData.audioUrl || null;
        }
      }
      if (Object.keys(sanitizedData).length > 0) {
        await tx
          .update(sc.recording)
          .set({ ...sanitizedData, updatedAt: new Date() })
          .where(eq(sc.recording.id, id));
      }

      if (artistIds !== undefined) {
        await tx
          .delete(sc.recordingArtist)
          .where(eq(sc.recordingArtist.recordingId, id));
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

  async updateBatchJobId(id: string, batchJobId: string) {
    const result = await this.db
      .update(sc.recording)
      .set({
        batchJobId,
        updatedAt: new Date(),
        audioProcessStatus: 'UPLOADED',
      })
      .where(eq(sc.recording.id, id))
      .returning();

    if (!result.length) {
      throw new NotFoundException('Recording not found');
    }
    return result[0];
  }

  async updateAudioStatusByBatchJobId(
    batchJobId: string,
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
      .where(eq(sc.recording.batchJobId, batchJobId))
      .returning();

    if (!result.length) {
      this.logger.warn(`No recording found for batchJobId: ${batchJobId}`);
      throw new NotFoundException('Recording not found for this job ID');
    }

    if (status === 'SUCCEEDED') {
      await this.updateAudioUrl(this.db, result[0].id);
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

  private buildProcessedAudioUrl(recordingId: string): string {
    const key = `recordings/${recordingId}/master.m3u8`;

    if (this.useCloudfront && this.cloudfrontAudioDomain) {
      return `https://${this.cloudfrontAudioDomain}/${key}`;
    }
    // Fallback to path-style S3 URL
    return `https://s3.${this.region}.amazonaws.com/${this.processedBucket}/${key}`;
  }

  private async updateAudioUrl(
    tx: NodePgDatabase<typeof sc>,
    recordingId: string,
  ) {
    const result = await tx
      .update(sc.recording)
      .set({
        audioUrl: this.buildProcessedAudioUrl(recordingId),
        updatedAt: new Date(),
      })
      .where(eq(sc.recording.id, recordingId))
      .returning();

    if (!result.length) {
      throw new NotFoundException('Recording not found');
    }
    return result[0];
  }
}

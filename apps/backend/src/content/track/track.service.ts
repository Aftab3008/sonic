import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DB_CONNECTION } from '../../db/db.provider';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as sc from '../../../db/schema';
import { eq, count, and } from 'drizzle-orm';
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
    trackNumber: sc.track.trackNumber,
    createdAt: sc.track.createdAt,
  } as const;

  private readonly filterableColumns = {
    albumId: sc.track.albumId,
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
      defaultSortColumn: sc.track.trackNumber,
      idColumn: sc.track.id,
      findManyExtras: {
        with: {
          recording: {
            with: {
              artists: { with: { artist: true } },
            },
          },
          album: {
            with: {
              artists: { with: { artist: true } },
            },
          },
          artists: { with: { artist: true } },
        },
      },
    });
  }

  async findOne(id: string) {
    const result = await this.db.query.track.findFirst({
      where: eq(sc.track.id, id),
      with: {
        recording: {
          with: {
            artists: { with: { artist: true } },
          },
        },
        album: {
          with: {
            artists: { with: { artist: true } },
          },
        },
        artists: { with: { artist: true } },
      },
    });

    if (!result) throw new NotFoundException('Track not found');
    return result;
  }

  async findByAlbum(albumId: string) {
    return this.db.query.track.findMany({
      where: eq(sc.track.albumId, albumId),
      with: {
        recording: {
          with: {
            artists: { with: { artist: true } },
          },
        },
        artists: { with: { artist: true } },
      },
      orderBy: [sc.track.discNumber, sc.track.trackNumber],
    });
  }

  async create(dto: CreateTrackDto) {
    return this.db.transaction(async (tx) => {
      const { recordingId, artistIds, ...trackData } = dto;

      // Verify recording exists
      const recording = await tx.query.recording.findFirst({
        where: eq(sc.recording.id, recordingId),
        with: {
          artists: { with: { artist: true } },
        },
      });

      if (!recording) {
        throw new NotFoundException('Recording not found');
      }

      // Create track
      const [track] = await tx.insert(sc.track).values({
        ...trackData,
        recordingId,
      }).returning();

      // Determine track artists
      let finalArtistIds = artistIds;

      // If no artists provided, inherit from recording
      if (!finalArtistIds || finalArtistIds.length === 0) {
        finalArtistIds = recording.artists?.map((ra) => ({
          artistId: ra.artistId,
          role: ra.role,
        })) || [];
      }

      // Set track artists
      if (finalArtistIds?.length) {
        await tx.insert(sc.trackArtist).values(
          finalArtistIds.map((a) => ({
            trackId: track.id,
            artistId: a.artistId,
            role: a.role,
          })),
        );
      }

      return this.findOneWithTx(tx, track.id);
    });
  }

  async update(id: string, dto: UpdateTrackDto) {
    const existing = await this.findOne(id);
    if (!existing) {
      throw new NotFoundException('Track not found');
    }

    return this.db.transaction(async (tx) => {
      const { recordingId, artistIds, ...trackData } = dto;

      // Update track fields
      if (Object.keys(trackData).length > 0 || recordingId) {
        await tx
          .update(sc.track)
          .set({
            ...trackData,
            ...(recordingId && { recordingId }),
            updatedAt: new Date(),
          })
          .where(eq(sc.track.id, id));
      }

      // Update artists if provided
      if (artistIds !== undefined) {
        // Remove existing
        await tx.delete(sc.trackArtist).where(eq(sc.trackArtist.trackId, id));

        // Insert new
        if (artistIds.length) {
          await tx.insert(sc.trackArtist).values(
            artistIds.map((a) => ({
              trackId: id,
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
      .delete(sc.track)
      .where(eq(sc.track.id, id))
      .returning();

    if (!result.length) throw new NotFoundException('Track not found');
    return result[0];
  }

  async removeFromAlbum(trackId: string, albumId: string) {
    // Delete track only if it belongs to this album
    const result = await this.db
      .delete(sc.track)
      .where(
        and(
          eq(sc.track.id, trackId),
          eq(sc.track.albumId, albumId),
        ),
      )
      .returning();

    if (!result.length) {
      throw new NotFoundException('Track not found in this album');
    }

    return result[0];
  }

  async updatePlayCount(id: string, increment: number = 1) {
    const track = await this.findOne(id);
    const newPlayCount = (track.playCount || 0) + increment;

    await this.db
      .update(sc.track)
      .set({ playCount: newPlayCount, updatedAt: new Date() })
      .where(eq(sc.track.id, id));

    return newPlayCount;
  }

  async getTotalTracksCount() {
    const result = await this.db.select({ count: count() }).from(sc.track);
    return result[0]?.count ?? 0;
  }

  /**
   * Get effective metadata for a track (with overrides applied)
   */
  getEffectiveMetadata(track: any) {
    const recording = track.recording;

    return {
      // Title: use override or fall back to recording
      title: track.overrideTitle || recording?.title || 'Unknown',

      // Duration from recording
      durationMs: recording?.durationMs,

      // Audio from recording
      audioUrl: recording?.audioUrl,
      audioProcessStatus: recording?.audioProcessStatus,

      // Explicit: use override or fall back to recording
      isExplicit:
        track.overrideIsExplicit !== undefined
          ? track.overrideIsExplicit
          : recording?.isExplicit || false,

      // Image: track-specific or album
      coverImageUrl: track.coverImageUrl || track.album?.coverImageUrl,

      // Artists: track-specific or recording
      artists: track.artists?.length ? track.artists : recording?.artists,

      // Lyrics from recording
      lyrics: recording?.lyrics,
      hasLyrics: recording?.hasLyrics || false,

      // Technical metadata
      bpm: recording?.bpm,
      isrc: recording?.isrc,
    };
  }

  private async findOneWithTx(tx: NodePgDatabase<typeof sc>, id: string) {
    return tx.query.track.findFirst({
      where: eq(sc.track.id, id),
      with: {
        recording: {
          with: {
            artists: { with: { artist: true } },
          },
        },
        album: {
          with: {
            artists: { with: { artist: true } },
          },
        },
        artists: { with: { artist: true } },
      },
    });
  }
}

import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as sc from '../../../db/schema';
import { DB_CONNECTION } from '../../db/db.provider';
import { SEARCH_ENGINE } from '../interfaces/search-engine.interface';
import type { SearchEngine } from '../interfaces/search-engine.interface';
import { SongIndexer } from '../indexers/song.indexer';
import { AlbumIndexer } from '../indexers/album.indexer';
import { ArtistIndexer } from '../indexers/artist.indexer';
import {
  SONGS_INDEX,
  ALBUMS_INDEX,
  ARTISTS_INDEX,
} from '../adapters/meilisearch.adapter';

/**
 * SearchReindexService
 *
 * Provides a full reindex operation that is:
 * - Called at startup (to recover from any missed events)
 * - Scheduled nightly at 3 AM as a safety net
 * - Triggerable via POST /api/admin/search/reindex
 *
 * PUBLISHED-only: queries only albums with releaseStatus = 'PUBLISHED'.
 */
@Injectable()
export class SearchReindexService {
  private readonly logger = new Logger(SearchReindexService.name);
  private readonly BATCH_SIZE = 500;

  constructor(
    @Inject(DB_CONNECTION) private readonly db: NodePgDatabase<typeof sc>,
    @Inject(SEARCH_ENGINE) private readonly engine: SearchEngine,
    private readonly songIndexer: SongIndexer,
    private readonly albumIndexer: AlbumIndexer,
    private readonly artistIndexer: ArtistIndexer,
  ) {}

  /**
   * Nightly full reindex at 3 AM — safety net for missed events.
   */
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async scheduledReindex() {
    this.logger.log('Nightly reindex starting…');
    await this.reindexAll();
  }

  /**
   * Full reindex — fetches all PUBLISHED content from Postgres and
   * pushes to Meilisearch in batches. Idempotent (upsert).
   */
  async reindexAll(): Promise<{
    albums: number;
    songs: number;
    artists: number;
  }> {
    const [albumCount, songCount, artistCount] = await Promise.all([
      this.reindexAlbums(),
      this.reindexSongs(),
      this.reindexArtists(),
    ]);

    this.logger.log(
      `Reindex complete — albums: ${albumCount}, songs: ${songCount}, artists: ${artistCount}`,
    );

    return { albums: albumCount, songs: songCount, artists: artistCount };
  }

  private async reindexAlbums(): Promise<number> {
    const rows = await this.db.query.album.findMany({
      where: eq(sc.album.releaseStatus, 'PUBLISHED'),
      columns: {
        id: true,
        publicId: true,
        title: true,
        albumType: true,
        coverImageUrl: true,
        releaseDate: true,
        releaseStatus: true,
      },
      with: {
        artists: { with: { artist: { columns: { id: true, name: true } } } },
        genres: { with: { genre: { columns: { name: true } } } },
        tracks: { columns: { id: true } },
      },
    });

    const docs = rows
      .map((r) => this.albumIndexer.build(r))
      .filter((d): d is NonNullable<typeof d> => d !== null);

    await this.batchUpsert(ALBUMS_INDEX, docs);
    return docs.length;
  }

  private async reindexSongs(): Promise<number> {
    const rows = await this.db.query.track.findMany({
      columns: {
        id: true,
        overrideTitle: true,
        coverImageUrl: true,
        playCount: true,
      },
      with: {
        album: {
          columns: {
            id: true,
            publicId: true,
            title: true,
            albumType: true,
            coverImageUrl: true,
            releaseDate: true,
            releaseStatus: true,
          },
          with: {
            artists: {
              with: { artist: { columns: { id: true, name: true } } },
            },
            genres: { with: { genre: { columns: { name: true } } } },
          },
        },
        recording: {
          columns: {
            title: true,
            durationMs: true,
            audioUrl: true,
            isExplicit: true,
            hasLyrics: true,
            bpm: true,
          },
        },
        artists: { with: { artist: { columns: { id: true, name: true } } } },
      },
    });

    const docs = rows
      .map((r) => this.songIndexer.build(r as any))
      .filter((d): d is NonNullable<typeof d> => d !== null);

    await this.batchUpsert(SONGS_INDEX, docs);
    return docs.length;
  }

  private async reindexArtists(): Promise<number> {
    const rows = await this.db.query.artist.findMany({
      columns: {
        id: true,
        name: true,
        slug: true,
        bio: true,
        imageUrl: true,
        isVerified: true,
        monthlyListeners: true,
      },
    });

    const docs = rows.map((r) => this.artistIndexer.build(r));
    await this.batchUpsert(ARTISTS_INDEX, docs);
    return docs.length;
  }

  private async batchUpsert(index: string, docs: object[]) {
    for (let i = 0; i < docs.length; i += this.BATCH_SIZE) {
      const batch = docs.slice(i, i + this.BATCH_SIZE);
      await this.engine.upsertDocuments(index, batch);
    }
  }
}

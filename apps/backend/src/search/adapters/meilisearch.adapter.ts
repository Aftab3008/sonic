import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Meilisearch } from 'meilisearch';
import type {
  SearchEngine,
  SearchOptions,
  SearchResult,
  SongDocument,
  AlbumDocument,
  ArtistDocument,
} from '../interfaces/search-engine.interface';

export const SONGS_INDEX = 'songs';
export const ALBUMS_INDEX = 'albums';
export const ARTISTS_INDEX = 'artists';

/**
 * MeilisearchAdapter — concrete implementation of SearchEngine.
 *
 * To swap to Elasticsearch or Typesense later:
 *   1. Create a new adapter implementing SearchEngine
 *   2. Change `useClass: MeilisearchAdapter` in search.module.ts
 *   Zero changes needed elsewhere.
 */
@Injectable()
export class MeilisearchAdapter implements SearchEngine, OnModuleInit {
  private readonly logger = new Logger(MeilisearchAdapter.name);
  private readonly client: Meilisearch;

  constructor(private readonly config: ConfigService) {
    this.client = new Meilisearch({
      host: this.config.get<string>(
        'MEILISEARCH_HOST',
        'http://localhost:7700',
      ),
      apiKey: this.config.get<string>('MEILISEARCH_MASTER_KEY'),
    });
  }

  async onModuleInit() {
    await this.ensureIndexes();
  }

  /**
   * Creates indexes and configures settings — fully idempotent.
   * Safe to call on every startup.
   */
  async ensureIndexes(): Promise<void> {
    try {
      await Promise.all([
        this.client.createIndex(SONGS_INDEX, { primaryKey: 'id' }),
        this.client.createIndex(ALBUMS_INDEX, { primaryKey: 'id' }),
        this.client.createIndex(ARTISTS_INDEX, { primaryKey: 'id' }),
      ]);

      await this.client.index(SONGS_INDEX).updateSettings({
        searchableAttributes: ['title', 'albumTitle', 'artists', 'genres'],
        filterableAttributes: [
          'releaseStatus',
          'albumType',
          'isExplicit',
          'artistIds',
          'genres',
        ],
        sortableAttributes: ['playCount', 'releaseDate'],
        rankingRules: [
          'words',
          'typo',
          'proximity',
          'attribute',
          'sort',
          'exactness',
        ],
      });

      await this.client.index(ALBUMS_INDEX).updateSettings({
        searchableAttributes: ['title', 'artists', 'genres'],
        filterableAttributes: ['releaseStatus', 'albumType', 'artistIds'],
        sortableAttributes: ['releaseDate'],
      });

      await this.client.index(ARTISTS_INDEX).updateSettings({
        searchableAttributes: ['name', 'bio'],
        filterableAttributes: ['isVerified'],
        sortableAttributes: ['monthlyListeners'],
      });

      this.logger.log('Meilisearch indexes configured successfully');
    } catch (err) {
      this.logger.warn(
        `Meilisearch ensureIndexes warning: ${(err as Error)?.message}`,
      );
    }
  }

  async upsertDocuments(index: string, docs: object[]): Promise<void> {
    if (!docs.length) return;
    try {
      await this.client.index(index).addDocuments(docs);
    } catch (err) {
      this.logger.warn(
        `Meilisearch upsert failed [${index}]: ${(err as Error)?.message}`,
      );
    }
  }

  async deleteDocument(index: string, id: string): Promise<void> {
    try {
      await this.client.index(index).deleteDocument(id);
    } catch (err) {
      this.logger.warn(
        `Meilisearch delete failed [${index}/${id}]: ${(err as Error)?.message}`,
      );
    }
  }

  async deleteDocuments(index: string, ids: string[]): Promise<void> {
    if (!ids.length) return;
    try {
      await this.client.index(index).deleteDocuments(ids);
    } catch (err) {
      this.logger.warn(
        `Meilisearch bulk delete failed [${index}]: ${(err as Error)?.message}`,
      );
    }
  }

  async search(
    query: string,
    options: SearchOptions = {},
  ): Promise<SearchResult> {
    const { type = 'all', limit = 20, offset = 0 } = options;
    const start = Date.now();

    const indexesToSearch: string[] = [];
    if (type === 'all' || type === 'songs') indexesToSearch.push(SONGS_INDEX);
    if (type === 'all' || type === 'albums') indexesToSearch.push(ALBUMS_INDEX);
    if (type === 'all' || type === 'artists')
      indexesToSearch.push(ARTISTS_INDEX);

    const queries = indexesToSearch.map((indexUid) => ({
      indexUid,
      q: query,
      limit,
      offset,
      filter:
        indexUid !== ARTISTS_INDEX ? 'releaseStatus = PUBLISHED' : undefined,
    }));

    try {
      const { results } = await this.client.multiSearch({ queries });

      const getHits = (indexUid: string) =>
        results.find((r) => r.indexUid === indexUid)?.hits ?? [];

      return {
        songs: getHits(SONGS_INDEX) as SongDocument[],
        albums: getHits(ALBUMS_INDEX) as AlbumDocument[],
        artists: getHits(ARTISTS_INDEX) as ArtistDocument[],
        processingTimeMs: Date.now() - start,
        query,
      };
    } catch (err) {
      this.logger.error(
        `Meilisearch search failed: ${(err as Error)?.message}`,
      );
      return { songs: [], albums: [], artists: [], processingTimeMs: 0, query };
    }
  }

  async getStats(): Promise<Record<string, unknown>> {
    try {
      const [songs, albums, artists] = await Promise.all([
        this.client.index(SONGS_INDEX).getStats(),
        this.client.index(ALBUMS_INDEX).getStats(),
        this.client.index(ARTISTS_INDEX).getStats(),
      ]);
      return { songs, albums, artists };
    } catch (err) {
      this.logger.warn(
        `Meilisearch getStats failed: ${(err as Error)?.message}`,
      );
      return {};
    }
  }
}

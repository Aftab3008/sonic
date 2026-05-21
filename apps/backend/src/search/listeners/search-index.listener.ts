import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
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
import type {
  TrackCreatedEvent,
  TrackUpdatedEvent,
  TrackDeletedEvent,
  AlbumCreatedEvent,
  AlbumUpdatedEvent,
  AlbumDeletedEvent,
  AlbumPublishedEvent,
  AlbumUnpublishedEvent,
  ArtistCreatedEvent,
  ArtistUpdatedEvent,
  ArtistDeletedEvent,
} from '../events/search.events';

/**
 * SearchIndexListener
 *
 * Subscribes to domain events emitted by admin services.
 * Translates them into Meilisearch index operations.
 *
 * Admin services know NOTHING about this class — zero coupling.
 * Failed Meilisearch calls log a warning and never break the API response.
 */
@Injectable()
export class SearchIndexListener {
  private readonly logger = new Logger(SearchIndexListener.name);

  constructor(
    @Inject(DB_CONNECTION) private readonly db: NodePgDatabase<typeof sc>,
    @Inject(SEARCH_ENGINE) private readonly engine: SearchEngine,
    private readonly songIndexer: SongIndexer,
    private readonly albumIndexer: AlbumIndexer,
    private readonly artistIndexer: ArtistIndexer,
  ) {}

  @OnEvent('track.created')
  async onTrackCreated(event: TrackCreatedEvent) {
    await this.syncTrack(event.trackId);
  }

  @OnEvent('track.updated')
  async onTrackUpdated(event: TrackUpdatedEvent) {
    await this.syncTrack(event.trackId);
  }

  @OnEvent('track.deleted')
  async onTrackDeleted(event: TrackDeletedEvent) {
    await this.engine.deleteDocument(SONGS_INDEX, event.trackId);
    this.logger.debug(`Deleted song from index: ${event.trackId}`);
  }

  @OnEvent('album.created')
  async onAlbumCreated(event: AlbumCreatedEvent) {
    if (event.releaseStatus === 'PUBLISHED') {
      await this.syncAlbumAndTracks(event.albumId);
    }
  }

  @OnEvent('album.updated')
  async onAlbumUpdated(event: AlbumUpdatedEvent) {
    if (event.releaseStatus === 'PUBLISHED') {
      await this.syncAlbumAndTracks(event.albumId);
    }
  }

  @OnEvent('album.deleted')
  async onAlbumDeleted(event: AlbumDeletedEvent) {
    await this.removeAlbumAndTrackDocs(event.albumId, []);
    this.logger.debug(
      `Deleted album and its tracks from index: ${event.albumId}`,
    );
  }

  @OnEvent('album.published')
  async onAlbumPublished(event: AlbumPublishedEvent) {
    this.logger.log(
      `Album published — indexing album + tracks: ${event.albumId}`,
    );
    await this.syncAlbumAndTracks(event.albumId);
  }

  @OnEvent('album.unpublished')
  async onAlbumUnpublished(event: AlbumUnpublishedEvent) {
    this.logger.log(
      `Album unpublished — removing from index: ${event.albumId}`,
    );

    const tracks = await this.db.query.track.findMany({
      where: eq(sc.track.albumId, event.albumId),
      columns: { id: true },
    });

    const trackIds = tracks.map((t) => t.id);
    await this.removeAlbumAndTrackDocs(event.albumId, trackIds);
  }

  @OnEvent('artist.created')
  async onArtistCreated(event: ArtistCreatedEvent) {
    await this.syncArtist(event.artistId);
  }

  @OnEvent('artist.updated')
  async onArtistUpdated(event: ArtistUpdatedEvent) {
    await this.syncArtist(event.artistId);
  }

  @OnEvent('artist.deleted')
  async onArtistDeleted(event: ArtistDeletedEvent) {
    await this.engine.deleteDocument(ARTISTS_INDEX, event.artistId);
    this.logger.debug(`Deleted artist from index: ${event.artistId}`);
  }

  private async syncTrack(trackId: string) {
    try {
      const row = await this.db.query.track.findFirst({
        where: eq(sc.track.id, trackId),
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

      if (!row) return;

      const doc = this.songIndexer.build(row);
      if (doc) {
        await this.engine.upsertDocuments(SONGS_INDEX, [doc]);
        this.logger.debug(`Indexed song: ${trackId}`);
      }
    } catch (err) {
      this.logger.warn(
        `syncTrack failed for ${trackId}: ${(err as Error)?.message}`,
      );
    }
  }

  private async syncAlbumAndTracks(albumId: string) {
    try {
      const albumRow = await this.db.query.album.findFirst({
        where: eq(sc.album.id, albumId),
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

      if (!albumRow) return;

      const albumDoc = this.albumIndexer.build(albumRow);
      if (albumDoc) {
        await this.engine.upsertDocuments(ALBUMS_INDEX, [albumDoc]);
      }

      const tracks = await this.db.query.track.findMany({
        where: eq(sc.track.albumId, albumId),
        columns: {
          id: true,
          overrideTitle: true,
          coverImageUrl: true,
          playCount: true,
        },
        with: {
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

      const songDocs = tracks
        .map((t) => this.songIndexer.build({ ...t, album: albumRow } as any))
        .filter((d): d is NonNullable<typeof d> => d !== null);

      if (songDocs.length) {
        await this.engine.upsertDocuments(SONGS_INDEX, songDocs);
        this.logger.debug(
          `Indexed album ${albumId} + ${songDocs.length} tracks`,
        );
      }
    } catch (err) {
      this.logger.warn(
        `syncAlbumAndTracks failed for ${albumId}: ${(err as Error)?.message}`,
      );
    }
  }

  private async removeAlbumAndTrackDocs(albumId: string, trackIds: string[]) {
    await Promise.all([
      this.engine.deleteDocument(ALBUMS_INDEX, albumId),
      trackIds.length
        ? this.engine.deleteDocuments(SONGS_INDEX, trackIds)
        : Promise.resolve(),
    ]);
  }

  private async syncArtist(artistId: string) {
    try {
      const row = await this.db.query.artist.findFirst({
        where: eq(sc.artist.id, artistId),
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

      if (!row) return;

      const doc = this.artistIndexer.build(row);
      await this.engine.upsertDocuments(ARTISTS_INDEX, [doc]);
      this.logger.debug(`Indexed artist: ${artistId}`);
    } catch (err) {
      this.logger.warn(
        `syncArtist failed for ${artistId}: ${(err as Error)?.message}`,
      );
    }
  }
}

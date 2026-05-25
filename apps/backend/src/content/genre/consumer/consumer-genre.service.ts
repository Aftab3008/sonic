import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, sql, inArray, desc } from 'drizzle-orm';
import { DB_CONNECTION } from '../../../db/db.provider';
import * as sc from '../../../../db/schema';

/**
 * Consumer Genre Service
 *
 * Handles genre browsing for public API.
 * Read-only operations with sanitized output.
 */
@Injectable()
export class ConsumerGenreService {
  constructor(@Inject(DB_CONNECTION) private db: NodePgDatabase<typeof sc>) {}

  async getGenres() {
    const genres = await this.db
      .select({
        name: sc.genre.name,
        slug: sc.genre.slug,
        primaryColor: sc.genre.primaryColor,
        secondaryColor: sc.genre.secondaryColor,
        icon: sc.genre.icon,
      })
      .from(sc.genre);
    return { genres };
  }

  async getGenreDetails(slug: string) {
    const genreRecord = await this.db.query.genre.findFirst({
      where: eq(sc.genre.slug, slug),
    });

    if (!genreRecord) {
      throw new NotFoundException(`Genre with slug "${slug}" not found`);
    }

    const albumRelations = await this.db.query.albumGenre.findMany({
      where: eq(sc.albumGenre.genreId, genreRecord.id),
      with: {
        album: {
          with: {
            artists: {
              with: {
                artist: { columns: { id: true, name: true, slug: true } },
              },
            },
            tracks: {
              columns: { id: true },
            },
          },
        },
      },
    });

    const albums = albumRelations
      .map((r) => r.album)
      .filter((a) => a !== null && a.releaseStatus === 'PUBLISHED');

    const clientAlbums = albums.map((a) => ({
      id: a.publicId,
      publicId: a.publicId,
      title: a.title,
      albumType: a.albumType,
      coverImageUrl: a.coverImageUrl,
      releaseDate: a.releaseDate,
      artists: a.artists,
      tracks: a.tracks,
    }));

    let tracks: any[] = [];
    if (albums.length > 0) {
      const albumIds = albums.map((a) => a.id);
      tracks = await this.db.query.track.findMany({
        where: inArray(sc.track.albumId, albumIds),
        columns: {
          publicId: true,
          trackNumber: true,
          overrideTitle: true,
          coverImageUrl: true,
        },
        extras: {
          id: sql<string>`${sc.track.publicId}`.as('id'),
        },
        with: {
          recording: {
            columns: {
              publicId: true,
              title: true,
              durationMs: true,
              audioUrl: true,
            },
            extras: {
              id: sql<string>`${sc.recording.publicId}`.as('id'),
            },
            with: {
              artists: {
                with: {
                  artist: {
                    columns: { id: true, name: true, slug: true },
                  },
                },
              },
            },
          },
          album: {
            columns: {
              publicId: true,
              title: true,
              albumType: true,
              coverImageUrl: true,
              releaseDate: true,
            },
            extras: {
              id: sql<string>`${sc.album.publicId}`.as('id'),
            },
          },
        },
        orderBy: [desc(sc.track.playCount), desc(sc.track.createdAt)],
        limit: 10,
      });
    }

    return {
      genre: {
        name: genreRecord.name,
        slug: genreRecord.slug,
        primaryColor: genreRecord.primaryColor,
        secondaryColor: genreRecord.secondaryColor,
        icon: genreRecord.icon,
      },
      albums: clientAlbums,
      tracks,
    };
  }
}

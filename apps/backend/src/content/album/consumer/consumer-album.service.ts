import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as sc from '../../../../db/schema';
import { DB_CONNECTION } from '../../../db/db.provider';
import { eq, desc, inArray, asc, and } from 'drizzle-orm';
import { AlbumType } from '../../../../db/models/core/enums.model';

@Injectable()
export class ConsumerAlbumService {
  constructor(@Inject(DB_CONNECTION) private db: NodePgDatabase<typeof sc>) {}

  async getAlbumSummaries(limit: number = 8, types?: AlbumType[]) {
    const albums = await this.db.query.album.findMany({
      where: types && types.length > 0
        ? and(
            eq(sc.album.releaseStatus, 'PUBLISHED'),
            inArray(sc.album.albumType, types),
          )
        : eq(sc.album.releaseStatus, 'PUBLISHED'),
      columns: {
        id: true,
        publicId: true,
        title: true,
        albumType: true,
        coverImageUrl: true,
        releaseDate: true,
      },
      with: {
        artists: {
          with: { artist: { columns: { id: true, name: true, slug: true } } },
        },
        tracks: {
          columns: { id: true },
        },
      },
      orderBy: [desc(sc.album.createdAt)],
      limit,
    });

    return albums.map((a) => ({
      id: a.id,
      publicId: a.publicId,
      title: a.title,
      albumType: a.albumType,
      coverImageUrl: a.coverImageUrl,
      releaseDate: a.releaseDate,
      trackCount: a.tracks.length,
      artists: a.artists,
    }));
  }


  async getAlbumDetail(albumId: string) {
    const album = await this.db.query.album.findFirst({
      where: eq(sc.album.id, albumId),
      columns: {
        id: true,
        publicId: true,
        title: true,
        albumType: true,
        coverImageUrl: true,
        releaseDate: true,
        recordLabel: true,
        copyright: true,
      },
      with: {
        artists: {
          with: { artist: { columns: { id: true, name: true, slug: true } } },
        },
        tracks: {
          columns: {
            id: true,
            trackNumber: true,
            discNumber: true,
            overrideTitle: true,
            coverImageUrl: true,
            playCount: true,
          },
          with: {
            recording: {
              columns: {
                id: true,
                title: true,
                durationMs: true,
                audioUrl: true,
                isExplicit: true,
                hasLyrics: true,
              },
              with: {
                artists: {
                  with: { artist: { columns: { id: true, name: true, slug: true } } },
                },
              },
            },
          },
          orderBy: [asc(sc.track.discNumber), asc(sc.track.trackNumber)],
        },
      },
    });
    return album ?? null;
  }
}

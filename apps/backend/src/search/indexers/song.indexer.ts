import { Injectable } from '@nestjs/common';
import type { SongDocument } from '../interfaces/search-engine.interface';

/**
 * SongIndexer — maps a Drizzle track+recording+album DB row → SongDocument.
 *
 * Only processes tracks from PUBLISHED albums.
 * The title resolution order: overrideTitle → recording.title
 */
@Injectable()
export class SongIndexer {
  build(row: {
    id: string;
    publicId: string;
    overrideTitle: string | null;
    coverImageUrl: string | null;
    playCount: number;
    album: {
      id: string;
      publicId: string;
      title: string;
      albumType: string;
      coverImageUrl: string | null;
      releaseDate: string;
      releaseStatus: string;
      artists?: Array<{ artist: { id: string; name: string } }>;
      genres?: Array<{ genre: { name: string } }>;
    };
    recording: {
      title: string;
      durationMs: number | null;
      audioUrl: string | null;
      isExplicit: boolean;
      hasLyrics: boolean;
      bpm: number | null;
    };
    artists?: Array<{ artist: { id: string; name: string } }>;
  }): SongDocument | null {
    if (row.album.releaseStatus !== 'PUBLISHED') {
      return null;
    }

    return {
      id: row.id,
      publicId: row.publicId,
      title: row.overrideTitle?.trim() || row.recording.title,
      albumId: row.album.id,
      albumPublicId: row.album.publicId,
      albumTitle: row.album.title,
      albumType: row.album.albumType,
      coverImageUrl: row.coverImageUrl ?? row.album.coverImageUrl ?? null,
      audioUrl: row.recording.audioUrl ?? null,
      durationMs: row.recording.durationMs ?? null,
      isExplicit: row.recording.isExplicit,
      hasLyrics: row.recording.hasLyrics,
      bpm: row.recording.bpm ?? null,
      artists: (row.artists ?? row.album.artists ?? []).map(
        (a) => a.artist.name,
      ),
      artistIds: (row.artists ?? row.album.artists ?? []).map(
        (a) => a.artist.id,
      ),
      genres: (row.album.genres ?? []).map((g) => g.genre.name),
      releaseDate: row.album.releaseDate,
      playCount: row.playCount ?? 0,
      releaseStatus: 'PUBLISHED',
    };
  }
}

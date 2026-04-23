/**
 * @file local-track.adapter.ts
 * @description Adapts a local MediaLibrary asset + its extracted metadata
 * into the app's canonical `Track` type — with no `any` casts.
 *
 * The local audio source only has a subset of data that a full API-backed
 * track has, so optional fields are populated where available and omitted
 * elsewhere.  The schema is intentionally designed to accept `undefined`
 * for optional nested objects, so this mapping is fully type-safe.
 */
import type { Asset } from "expo-media-library";
import type { Track } from "@/lib/schema/player.schema";
import type { LocalTrackMetadata } from "@/lib/player/local-metadata";

/**
 * Maps a device audio asset and its parsed metadata to a `Track` object
 * that can be fed directly into `usePlayerStore.playTrack()`.
 */
export const assetToTrack = (
  asset: Asset,
  metadata: LocalTrackMetadata | null,
) => {
  console.log("metadata", metadata);
  console.log("asset", asset);
  const data: Track = {
    id: asset.id,
    trackNumber: 1,
    overrideTitle: null,
    coverImageUrl: metadata?.artworkDataUri ?? null,

    recording: {
      id: asset.id,
      title: metadata?.title ?? asset.filename,
      audioUrl: asset.uri,
      isExplicit: false,
      hasLyrics: false,
      lyrics: null,
      durationMs: asset.duration * 1000,
      // `artists` expects the full ArtistSchema — we only have a name string.
      // Providing undefined is type-safe and the player falls back to "Unknown Artist".
      artists: undefined,
    },

    // `album` expects the full AlbumSchema (id, albumType required).
    // We don't have those from local metadata, so we omit it entirely.
    album: undefined,
  };
  console.log("data", data);
  return data;
};

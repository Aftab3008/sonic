/**
 * @file local-metadata.ts
 * @description Service for extracting and caching metadata from local audio files.
 *
 * Uses @missingcore/react-native-metadata-retriever (Android native MediaMetadataRetriever API)
 * with an MMKV-backed cache to ensure O(1) repeat lookups.
 */
import {
  getArtwork,
  getMetadata,
  MetadataPresets,
  type MediaMetadataExcerpt,
} from "@missingcore/react-native-metadata-retriever";
import { createMMKV } from "react-native-mmkv";

const FIELDS = MetadataPresets.standard;

const storage = createMMKV({ id: "sonic-local-metadata-cache" });

type RawMetadata = MediaMetadataExcerpt<typeof FIELDS>;

export interface LocalTrackMetadata {
  readonly title: string | null;
  readonly artist: string | null;
  readonly albumTitle: string | null;
  readonly artworkDataUri: string | null;
}

const toDataUri = (base64: string | null): string | null =>
  base64 ? `data:image/jpeg;base64,${base64}` : null;

const normalise = (
  raw: RawMetadata,
  artwork: string | null,
): LocalTrackMetadata => ({
  title: raw.title,
  artist: raw.artist,
  albumTitle: raw.albumTitle,
  artworkDataUri: artwork,
});

/**
 * Returns cached metadata if available, otherwise parses the file,
 * caches the result, and returns it.
 */
export const getLocalTrackMetadata = async (
  assetId: string,
  uri: string,
): Promise<LocalTrackMetadata | null> => {
  const cached = storage.getString(assetId);
  if (cached) {
    return JSON.parse(cached) as LocalTrackMetadata;
  }
  try {
    const [raw, artworkBase64] = await Promise.all([
      getMetadata(uri, FIELDS),
      getArtwork(uri),
    ]);
    const result = normalise(raw, toDataUri(artworkBase64));
    storage.set(assetId, JSON.stringify(result));
    return result;
  } catch (error) {
    console.error(`[LocalMetadata] Failed to parse ${assetId}:`, error);
    return null;
  }
};

/** Wipe the entire metadata cache (e.g. for debugging or settings reset). */
export const clearLocalMetadataCache = (): void => {
  storage.clearAll();
};

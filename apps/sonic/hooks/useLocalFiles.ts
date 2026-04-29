/**
 * @file useLocalFiles.ts
 * @description React hook that fetches all audio assets from the device
 * media library and provides search/filter functionality.
 *
 * Separating data-fetching concerns from the screen component keeps the
 * screen thin (pure orchestration) and makes this logic independently testable.
 */
import * as MediaLibrary from "expo-media-library";
import { useEffect, useMemo, useState } from "react";
import {
  getBulkMetadata,
  getLocalTrackMetadata,
  type LocalTrackMetadata,
} from "@/lib/player/local-metadata";

export interface UseLocalFilesResult {
  tracks: MediaLibrary.Asset[];
  filteredTracks: MediaLibrary.Asset[];
  metadataMap: Record<string, LocalTrackMetadata>;
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useLocalFiles = (): UseLocalFilesResult => {
  const [tracks, setTracks] = useState<MediaLibrary.Asset[]>([]);
  const [metadataMap, setMetadataMap] = useState<
    Record<string, LocalTrackMetadata>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const { assets } = await MediaLibrary.getAssetsAsync({
          mediaType: "audio",
          sortBy: "creationTime",
          first: 500,
        });

        if (!cancelled) {
          setTracks(assets);
          const initialMetadata = getBulkMetadata(assets);
          setMetadataMap(initialMetadata);
        }
      } catch (error) {
        console.error("[useLocalFiles] Failed to load audio assets:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (tracks.length === 0) return;

    let cancelled = false;

    const fetchRemaining = async () => {
      const currentIds = new Set(Object.keys(metadataMap));
      const missingTracks = tracks.filter((t) => !currentIds.has(t.id));

      if (missingTracks.length === 0) return;

      const chunkSize = 20;
      let accumulatedMetadata: Record<string, LocalTrackMetadata> = {};

      for (let i = 0; i < missingTracks.length; i += chunkSize) {
        if (cancelled) break;

        const chunk = missingTracks.slice(i, i + chunkSize);
        const results = await Promise.all(
          chunk.map(async (t) => ({
            id: t.id,
            meta: await getLocalTrackMetadata(t.id, t.uri),
          })),
        );

        results.forEach((r) => {
          if (r.meta) accumulatedMetadata[r.id] = r.meta;
        });

        if (Object.keys(accumulatedMetadata).length > 0 && !cancelled) {
          setMetadataMap((prev) => ({ ...prev, ...accumulatedMetadata }));
          accumulatedMetadata = {};
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    };

    fetchRemaining();
    return () => {
      cancelled = true;
    };
  }, [tracks]);

  const filteredTracks = useMemo(
    () =>
      tracks.filter((t) =>
        t.filename.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [tracks, searchQuery],
  );

  return {
    tracks,
    filteredTracks,
    metadataMap,
    isLoading,
    searchQuery,
    setSearchQuery,
  };
};

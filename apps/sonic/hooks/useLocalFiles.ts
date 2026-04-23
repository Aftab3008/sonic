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

export interface UseLocalFilesResult {
  tracks: MediaLibrary.Asset[];
  filteredTracks: MediaLibrary.Asset[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useLocalFiles = (): UseLocalFilesResult => {
  const [tracks, setTracks] = useState<MediaLibrary.Asset[]>([]);
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
        if (!cancelled) setTracks(assets);
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

  const filteredTracks = useMemo(
    () =>
      tracks.filter((t) =>
        t.filename.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [tracks, searchQuery],
  );

  return { tracks, filteredTracks, isLoading, searchQuery, setSearchQuery };
};

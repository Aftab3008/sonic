import { useEffect, useRef } from "react";
import TrackPlayer, {
  useProgress,
  useActiveTrack,
} from "react-native-track-player";
import { File, Directory, Paths } from "expo-file-system";

const CACHE_DIR = new Directory(Paths.cache, "sonic_prefetch");
const PREFETCH_THRESHOLD = 0.8;

export const usePrefetcher = () => {
  const { position, duration } = useProgress();
  const activeTrack = useActiveTrack();
  const prefetchedTracks = useRef<Set<string>>(new Set());

  useEffect(() => {
    const ensureCacheDir = () => {
      try {
        if (!CACHE_DIR.exists) {
          CACHE_DIR.create({ intermediates: true });
          console.log("[Prefetcher] Cache directory created:", CACHE_DIR.uri);
        }
      } catch (error) {
        console.error("[Prefetcher] Error creating cache directory:", error);
      }
    };
    ensureCacheDir();
  }, []);

  useEffect(() => {
    if (!activeTrack || duration === 0) return;

    const progress = position / duration;

    if (progress > PREFETCH_THRESHOLD) {
      prefetchNextTrack();
    }
  }, [position, duration, activeTrack]);

  const prefetchNextTrack = async () => {
    try {
      const queue = await TrackPlayer.getQueue();
      const currentIndex = await TrackPlayer.getActiveTrackIndex();

      if (currentIndex === undefined || currentIndex === queue.length - 1) {
        return;
      }

      const nextTrack = queue[currentIndex + 1];

      if (
        !nextTrack ||
        !nextTrack.url ||
        prefetchedTracks.current.has(nextTrack.id)
      ) {
        return;
      }

      console.log(`[Prefetcher] Starting prefetch for: ${nextTrack.title}`);

      const manifestUrl = nextTrack.url;
      const destinationFile = new File(CACHE_DIR, `${nextTrack.id}.m3u8`);

      const manifestResult = await File.downloadFileAsync(
        manifestUrl,
        destinationFile,
      );

      if (manifestResult.exists) {
        // In a real Spotify-level implementation, we would parse the .m3u8
        // and download the first 2-3 segments (.ts files).
        // For this MVP, we fetch the manifest to ensure the DNS and initial connection are "warm".
        prefetchedTracks.current.add(nextTrack.id);
        console.log(
          `[Prefetcher] Successfully prefetched manifest for ${nextTrack.id}`,
        );
      }
    } catch (error) {
      console.error("[Prefetcher] Error during prefetch:", error);
    }
  };

  return null;
};

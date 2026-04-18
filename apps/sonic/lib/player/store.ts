import TrackPlayer, { AddTrack, TrackType } from "react-native-track-player";
import { create } from "zustand";
import { Track } from "../schema/player.schema";

interface PlayerState {
  queue: Track[];
  currentTrackId: string | null;

  setQueue: (tracks: Track[]) => Promise<void>;
  playTrack: (track: Track) => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  clearQueue: () => Promise<void>;
}

/**
 * Robust HLS detection that handles query parameters (signed URLs)
 */
const isHlsUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  const cleanUrl = url.split("?")[0];
  return cleanUrl.endsWith(".m3u8");
};

const formatTrack = (t: Track): AddTrack => {
  const isHLS = isHlsUrl(t.recording?.audioUrl);

  return {
    id: t.id,
    url: t.recording?.audioUrl || "",
    title: t.overrideTitle || t.recording?.title || "Unknown Track",
    artist:
      t.recording?.artists?.map((a) => a.artist.name).join(", ") ||
      "Unknown Artist",
    artwork: t.coverImageUrl || t.album?.coverImageUrl || "",
    duration: t.recording?.durationMs
      ? t.recording.durationMs / 1000
      : undefined,
    type: isHLS ? TrackType.HLS : undefined,
    contentType: isHLS ? "application/x-mpegURL" : undefined,
    headers: {
      "User-Agent": "Sonic-Mobile-App",
    },
  };
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  queue: [],
  currentTrackId: null,

  setQueue: async (tracks: Track[]) => {
    console.log(`[PlayerStore] Setting queue with ${tracks.length} tracks`);
    set({ queue: tracks });

    const formattedTracks = tracks.map(formatTrack);

    try {
      await TrackPlayer.reset();
      await TrackPlayer.add(formattedTracks);
      console.log("[PlayerStore] Queue initialized successfully");
    } catch (error) {
      console.error("[PlayerStore] Failed to set queue:", error);
    }
  },

  playTrack: async (track: Track) => {
    console.log(
      `[PlayerStore] attempt to play track: ${track.recording?.title} (${track.id})`,
    );

    const { queue } = get();
    const trackIndex = queue.findIndex((t) => t.id === track.id);

    try {
      if (trackIndex === -1) {
        console.log("[PlayerStore] Track not in queue, adding it...");
        await TrackPlayer.add(formatTrack(track));
        set({ queue: [...queue, track] });
        await TrackPlayer.skip(queue.length);
      } else {
        console.log(`[PlayerStore] skipping to track at index ${trackIndex}`);
        await TrackPlayer.skip(trackIndex);
      }

      set({ currentTrackId: track.id });
      await TrackPlayer.play();
      console.log("[PlayerStore] Playback started");
    } catch (error) {
      console.error("[PlayerStore] Playback failure:", error);
    }
  },

  next: async () => {
    try {
      await TrackPlayer.skipToNext();
    } catch (error) {
      console.error("[PlayerStore] Failed to skip to next:", error);
    }
  },

  previous: async () => {
    try {
      await TrackPlayer.skipToPrevious();
    } catch (error) {
      console.error("[PlayerStore] Failed to skip to previous:", error);
    }
  },

  clearQueue: async () => {
    try {
      await TrackPlayer.reset();
      set({ queue: [], currentTrackId: null });
      console.log("[PlayerStore] Queue cleared");
    } catch (error) {
      console.error("[PlayerStore] Failed to clear queue:", error);
    }
  },
}));

/**
 * @file store.ts
 * @description Zustand store for audio playback state.
 *
 * The `formatTrack` function is a pure mapping function that converts
 * the app's canonical `Track` type into the `AddTrack` shape required
 * by react-native-track-player.
 *
 * Key decisions:
 *   - `artwork` is *never* an empty string. Android's TrackPlayer throws a
 *     Java RuntimeException if the artwork URL is empty, so we always
 *     fall back to the resolved URI of the app logo asset.
 *   - The fallback is computed once at module init (not per call) to avoid
 *     repeated synchronous work inside the hot path.
 *   - HLS detection strips query parameters to handle signed CloudFront URLs.
 */
import { Image } from "react-native";
import TrackPlayer, { AddTrack, TrackType } from "react-native-track-player";
import { create } from "zustand";
import { ASSETS } from "../../constants/assets";
import { Track } from "../schema/player.schema";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Computed once at module load — avoids a synchronous asset lookup
 * inside every `formatTrack` call.
 */
const FALLBACK_ARTWORK_URI: string = Image.resolveAssetSource(
  ASSETS.appLogo,
).uri;

/**
 * Robust HLS detection that handles query parameters (signed URLs).
 */
const isHlsUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  return url.split("?")[0]!.endsWith(".m3u8");
};

/**
 * Maps the app's canonical `Track` type to the `AddTrack` shape
 * expected by react-native-track-player.
 *
 * All fields are fully typed — no `any` casts required because the
 * Track schema expresses optionality through `| null | undefined`,
 * which is handled explicitly here.
 */
const formatTrack = (t: Track): AddTrack => {
  const audioUrl = t.recording.audioUrl ?? "";
  const isHLS = isHlsUrl(audioUrl);

  // Use logical OR (||) instead of nullish coalescing (??) because 
  // an empty string "" is NOT nullish, but it will crash the Android player.
  const artwork: string =
    t.coverImageUrl || t.album?.coverImageUrl || FALLBACK_ARTWORK_URI;

  return {
    id: t.id,
    url: audioUrl,
    title: t.overrideTitle ?? t.recording.title ?? "Unknown Track",
    artist:
      t.recording.artists?.map((a) => a.artist.name).join(", ") ??
      "Unknown Artist",
    artwork,
    duration:
      t.recording.durationMs != null
        ? t.recording.durationMs / 1000
        : undefined,
    type: isHLS ? TrackType.HLS : undefined,
    contentType: isHLS ? "application/x-mpegURL" : undefined,
    headers: {
      "User-Agent": "Sonic-Mobile-App",
    },
  };
};

interface PlayerState {
  queue: Track[];
  currentTrackId: string | null;

  setQueue: (tracks: Track[]) => Promise<void>;
  playTrack: (track: Track) => Promise<void>;
  next: () => Promise<void>;
  previous: () => Promise<void>;
  clearQueue: () => Promise<void>;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  queue: [],
  currentTrackId: null,

  setQueue: async (tracks: Track[]) => {
    console.log(`[PlayerStore] Setting queue with ${tracks.length} tracks`);
    set({ queue: tracks });

    try {
      await TrackPlayer.reset();
      await TrackPlayer.add(tracks.map(formatTrack));
      console.log("[PlayerStore] Queue initialised successfully");
    } catch (error) {
      console.error("[PlayerStore] Failed to set queue:", error);
    }
  },

  playTrack: async (track: Track) => {
    console.log(
      `[PlayerStore] Attempting to play: ${track.recording.title} (${track.id})`,
    );

    const { queue } = get();
    const trackIndex = queue.findIndex((t) => t.id === track.id);

    try {
      if (trackIndex === -1) {
        console.log("[PlayerStore] Track not in queue — adding");
        await TrackPlayer.add(formatTrack(track));
        set({ queue: [...queue, track] });
        await TrackPlayer.skip(queue.length);
      } else {
        console.log(`[PlayerStore] Skipping to index ${trackIndex}`);
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

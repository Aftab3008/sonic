import { useQuery } from "@tanstack/react-query";
import { trackKeys } from "../lib/react-query/query-keys";
import { kyInstance } from "../providers/apiClient";

export interface TrackArtistInfo {
  artist: {
    id: string;
    name: string;
  };
}

export interface TrackConsumerInfo {
  id: string;
  trackNumber: number;
  overrideTitle: string | null;
  coverImageUrl: string | null;
  recording: {
    id: string;
    title: string;
    durationMs: number;
    audioUrl: string | null;
    artists: TrackArtistInfo[];
  } | null;
  album: {
    id: string;
    title: string;
    coverImageUrl: string | null;
  } | null;
}

export const useGetTracks = (limit: number = 3) => {
  return useQuery({
    queryKey: trackKeys.list(`limit-${limit}`),
    enabled: !!limit,
    queryFn: async () => {
      try {
        console.log("Fetching tracks...");
        const res = await kyInstance
          .get(`v1/tracks?limit=${limit}`)
          .json<{ data: TrackConsumerInfo[] }>();
        console.log("Tracks Response SUCCESS:", res.data.length, "items");
        return res.data;
      } catch (error: any) {
        const status = error.response?.status;
        console.error(
          `[Tracks API Error] ${status || "Network Error"}:`,
          error?.message,
        );
        if (status === 401 || status === 403) {
          console.warn("Authentication failed. Please check your session.");
        }
      }
    },
  });
};

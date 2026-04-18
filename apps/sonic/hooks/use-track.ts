import { useQuery } from "@tanstack/react-query";
import { trackKeys } from "../lib/react-query/query-keys";
import { kyInstance } from "../providers/apiClient";
import { Track } from "../lib/schema/player.schema";
import { HTTPError } from "ky";

export const useGetTracks = (limit: number = 3) => {
  return useQuery({
    queryKey: trackKeys.list(`limit-${limit}`),
    enabled: !!limit,
    queryFn: async (): Promise<Track[]> => {
      try {
        console.log(`[useGetTracks] Fetching ${limit} tracks...`);
        const res = await kyInstance
          .get(`v1/tracks?limit=${limit}`)
          .json<{ data: Track[] }>();
        
        console.log(`[useGetTracks] SUCCESS: Received ${res.data.length} tracks`);
        return res.data;
      } catch (error) {
        if (error instanceof HTTPError) {
          const status = error.response.status;
          console.error(
            `[useGetTracks] API Error ${status}:`,
            error.message,
          );
          if (status === 401 || status === 403) {
            console.warn("[useGetTracks] Authentication required.");
          }
        } else {
          console.error("[useGetTracks] Unexpected error:", error);
        }
        return []; // Return empty array on error
      }
    },
  });
};


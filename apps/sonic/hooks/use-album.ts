import { useQuery } from "@tanstack/react-query";
import { albumKeys } from "../lib/react-query/query-keys";
import { kyInstance } from "../providers/apiClient";
import { Album } from "../lib/schema/player.schema";
import { HTTPError } from "ky";

export const useGetAlbums = (limit: number = 3) => {
  return useQuery({
    queryKey: albumKeys.list(`limit-${limit}`),
    enabled: !!limit,
    queryFn: async (): Promise<Album[]> => {
      try {
        console.log(`[useGetAlbums] Fetching ${limit} albums...`);
        const res = await kyInstance
          .get(`v1/albums?limit=${limit}`)
          .json<{ data: Album[] }>();
        
        console.log(`[useGetAlbums] SUCCESS: Received ${res.data.length} albums`);
        return res.data;
      } catch (error) {
        if (error instanceof HTTPError) {
          const status = error.response.status;
          console.error(
            `[useGetAlbums] API Error ${status}:`,
            error.message,
          );
          if (status === 401 || status === 403) {
            console.warn("[useGetAlbums] Authentication required.");
          }
        } else {
          console.error("[useGetAlbums] Unexpected error:", error);
        }
        return [];
      }
    },
  });
};


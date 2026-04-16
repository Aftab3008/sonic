import { useQuery } from "@tanstack/react-query";
import { albumKeys } from "../lib/react-query/query-keys";
import { kyInstance } from "../providers/apiClient";

export interface AlbumArtistInfo {
  artist: {
    id: string;
    name: string;
  };
}

export interface AlbumConsumerInfo {
  id: string;
  title: string;
  albumType: string;
  releaseDate: string | null;
  coverImageUrl: string | null;
  artists: AlbumArtistInfo[];
}

export const useGetAlbums = (limit: number = 3) => {
  return useQuery({
    queryKey: albumKeys.list(`limit-${limit}`),
    enabled: !!limit,
    queryFn: async () => {
      try {
        console.log("Fetching albums...");
        const res = await kyInstance
          .get(`v1/albums?limit=${limit}`)
          .json<{ data: AlbumConsumerInfo[] }>();
        console.log("Albums Response SUCCESS:", res.data.length, "items");
        return res.data;
      } catch (error: any) {
        const status = error.response?.status;
        console.error(
          `[Albums API Error] ${status || "Network Error"}:`,
          error.message,
        );
        if (status === 401 || status === 403) {
          console.warn("Authentication failed. Please check your session.");
        }
      }
    },
  });
};

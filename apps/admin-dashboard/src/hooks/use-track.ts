import { trackKeys } from "@/lib/react-query/query-keys";
import { kyInstance } from "@/providers/dataProvider";
import { Track, StandardResponse } from "@/types/admin.types";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

export const useGetTrack = (trackId: string | null) => {
  return useQuery({
    queryKey: trackKeys.details(trackId || ""),
    queryFn: async () => {
      if (!trackId) return null;
      const res = await kyInstance
        .get(`tracks/${trackId}`)
        .json<StandardResponse<Track>>();
      return res.data;
    },
    enabled: !!trackId,
  });
};

export const useGetTrackDetails = ({ trackId }: { trackId: string }) => {
  return useSuspenseQuery({
    queryKey: trackKeys.details(trackId),
    queryFn: async () => {
      const res = await kyInstance
        .get(`tracks/${trackId}`)
        .json<StandardResponse<Track>>();
      return res.data;
    },
  });
};

export const useGetTracks = (params?: { search?: string; pageSize?: number }) => {
  return useQuery({
    queryKey: trackKeys.list(params?.search || ""),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.set("search", params.search);
      if (params?.pageSize)
        searchParams.set("pageSize", params.pageSize.toString());

      const res = await kyInstance
        .get(`tracks?${searchParams}`)
        .json<
          StandardResponse<{
            data: Track[];
            hasNextPage: boolean;
            nextCursor?: string;
          }>
        >();
      return res.data;
    },
  });
};

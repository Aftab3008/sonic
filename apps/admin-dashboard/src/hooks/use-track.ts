import { trackKeys } from "@/lib/react-query/query-keys";
import { CreateTrackType } from "@/lib/schema/track.schema";
import { kyInstance } from "@/providers/dataProvider";
import { Track, StandardResponse } from "@/types/admin.types";
import { useInvalidate } from "@refinedev/core";
import {
  useQuery,
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

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
        .json<StandardResponse<Partial<Track>>>();
      return res.data;
    },
  });
};

export const useGetTracks = (params?: {
  search?: string;
  pageSize?: number;
}) => {
  return useQuery({
    queryKey: trackKeys.list(params?.search || ""),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.set("search", params.search);
      if (params?.pageSize)
        searchParams.set("pageSize", params.pageSize.toString());

      const res = await kyInstance.get(`tracks?${searchParams}`).json<
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

export const useCreateTrack = () => {
  const queryClient = useQueryClient();
  const invalidate = useInvalidate();

  return useMutation({
    mutationFn: async (data: CreateTrackType) => {
      const res = await kyInstance
        .post("tracks", { json: data })
        .json<StandardResponse<Track>>();
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trackKeys.lists() });
      invalidate({
        resource: "tracks",
        invalidates: ["list", "many"],
      });
    },
  });
};

export const useUpdateTrack = () => {
  const queryClient = useQueryClient();
  const invalidate = useInvalidate();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateTrackType>;
    }) => {
      const res = await kyInstance
        .patch(`tracks/${id}`, { json: data })
        .json<StandardResponse<Track>>();
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: trackKeys.details(data.id) });
      queryClient.invalidateQueries({ queryKey: trackKeys.lists() });
      invalidate({
        resource: "tracks",
        invalidates: ["list", "many", "detail"],
        id: data.id,
      });
    },
  });
};

export const useDeleteTrack = () => {
  const queryClient = useQueryClient();
  const invalidate = useInvalidate();

  return useMutation({
    mutationFn: async (id: string) => {
      await kyInstance.delete(`tracks/${id}`).json();
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: trackKeys.lists() });
      invalidate({
        resource: "tracks",
        invalidates: ["list", "many", "detail"],
        id,
      });
    },
  });
};

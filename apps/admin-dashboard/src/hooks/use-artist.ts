import { artistKeys } from "@/lib/react-query/query-keys";
import { CreateArtistType } from "@/lib/schema/artist.schema";
import { kyInstance } from "@/providers/dataProvider";
import { Artist, StandardResponse } from "@/types/admin.types";
import { useInvalidate } from "@refinedev/core";
import {
  useQuery,
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export const useGetArtistDetails = ({ artistId }: { artistId: string }) => {
  return useSuspenseQuery({
    queryKey: artistKeys.details(artistId),
    queryFn: async () => {
      const res = await kyInstance
        .get(`artists/${artistId}`)
        .json<StandardResponse<Artist>>();
      return res.data;
    },
  });
};

export const useGetArtists = () => {
  return useQuery({
    queryKey: artistKeys.all,
    queryFn: async () => {
      const res = await kyInstance
        .get(`artists/all`)
        .json<StandardResponse<Partial<Artist[]>>>();
      return res.data;
    },
  });
};

export const useCreateArtist = () => {
  const queryClient = useQueryClient();
  const invalidate = useInvalidate();

  return useMutation({
    mutationFn: async (data: CreateArtistType) => {
      const res = await kyInstance
        .post("artists", { json: data })
        .json<StandardResponse<Artist>>();
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: artistKeys.lists() });
      queryClient.invalidateQueries({ queryKey: artistKeys.all });
      invalidate({
        resource: "artists",
        invalidates: ["list", "many"],
      });
    },
  });
};

export const useUpdateArtist = () => {
  const queryClient = useQueryClient();
  const invalidate = useInvalidate();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateArtistType>;
    }) => {
      const res = await kyInstance
        .patch(`artists/${id}`, { json: data })
        .json<StandardResponse<Artist>>();
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: artistKeys.details(data.id) });
      queryClient.invalidateQueries({ queryKey: artistKeys.lists() });
      queryClient.invalidateQueries({ queryKey: artistKeys.all });
      invalidate({
        resource: "artists",
        invalidates: ["list", "many", "detail"],
        id: data.id,
      });
    },
  });
};

export const useDeleteArtist = () => {
  const queryClient = useQueryClient();
  const invalidate = useInvalidate();

  return useMutation({
    mutationFn: async (id: string) => {
      await kyInstance.delete(`artists/${id}`).json();
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: artistKeys.lists() });
      queryClient.invalidateQueries({ queryKey: artistKeys.all });
      invalidate({
        resource: "artists",
        invalidates: ["list", "many", "detail"],
        id,
      });
    },
  });
};

import { genreKeys } from "@/lib/react-query/query-keys";
import { CreateGenreType } from "@/lib/schema/genre.schema";
import { kyInstance } from "@/providers/dataProvider";
import { Genre, StandardResponse } from "@/types/admin.types";
import { useInvalidate } from "@refinedev/core";
import { useQuery, useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useGetGenreDetails = ({ genreId }: { genreId: string }) => {
  return useSuspenseQuery({
    queryKey: genreKeys.details(genreId),
    queryFn: async () => {
      const res = await kyInstance
        .get(`genres/${genreId}`)
        .json<StandardResponse<Genre>>();
      return res.data;
    },
  });
};

export const useGetGenres = () => {
  return useQuery({
    queryKey: genreKeys.all,
    queryFn: async () => {
      const res = await kyInstance
        .get(`genres/all`)
        .json<StandardResponse<Genre[]>>();
      return res.data;
    },
  });
};

export const useCreateGenre = () => {
  const queryClient = useQueryClient();
  const invalidate = useInvalidate();

  return useMutation({
    mutationFn: async (data: CreateGenreType) => {
      const res = await kyInstance
        .post("genres", { json: data })
        .json<StandardResponse<Genre>>();
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: genreKeys.all });
      invalidate({
        resource: "genres",
        invalidates: ["list", "many"],
      });
    },
  });
};

export const useUpdateGenre = () => {
  const queryClient = useQueryClient();
  const invalidate = useInvalidate();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateGenreType>;
    }) => {
      const res = await kyInstance
        .patch(`genres/${id}`, { json: data })
        .json<StandardResponse<Genre>>();
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: genreKeys.all });
      invalidate({
        resource: "genres",
        invalidates: ["list", "many", "detail"],
        id: data.id,
      });
    },
  });
};

export const useDeleteGenre = () => {
  const queryClient = useQueryClient();
  const invalidate = useInvalidate();

  return useMutation({
    mutationFn: async (id: string) => {
      await kyInstance.delete(`genres/${id}`).json();
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: genreKeys.all });
      invalidate({
        resource: "genres",
        invalidates: ["list", "many", "detail"],
        id,
      });
    },
  });
};

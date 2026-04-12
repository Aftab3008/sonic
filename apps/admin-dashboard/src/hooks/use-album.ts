import { albumKeys } from "@/lib/react-query/query-keys";
import { CreateAlbumType } from "@/lib/schema/album.schema";
import { kyInstance } from "@/providers/dataProvider";
import { Album, AlbumArtist, StandardResponse } from "@/types/admin.types";
import { useInvalidate } from "@refinedev/core";
import { useQuery, useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";


export const useGetAlbum = (albumId: string | null) => {
  return useQuery({
    queryKey: albumKeys.details(albumId || ""),
    queryFn: async () => {
      if (!albumId) return null;
      const res = await kyInstance
        .get(`albums/${albumId}`)
        .json<StandardResponse<Album>>();
      return res.data;
    },
    enabled: !!albumId,
  });
};

export const useGetAlbumDetails = ({ albumId }: { albumId: string }) => {
  return useSuspenseQuery({
    queryKey: albumKeys.details(albumId),
    queryFn: async () => {
      const res = await kyInstance
        .get(`albums/${albumId}`)
        .json<StandardResponse<Album>>();
      return res.data;
    },
  });
};

export const useGetAlbumArtists = (
  albumId: string | null,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: albumKeys.artists(albumId || ""),
    queryFn: async () => {
      if (!albumId) return [];
      const res = await kyInstance
        .get(`albums/${albumId}`)
        .json<StandardResponse<Album>>();
      return res.data.artists || [];
    },
    enabled: options?.enabled !== false && !!albumId,
  });
};


export const useGetAlbums = (params?: {
  search?: string;
  pageSize?: number;
}) => {
  return useQuery({
    queryKey: albumKeys.list(params?.search || ""),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.set("search", params.search);
      if (params?.pageSize) searchParams.set("pageSize", params.pageSize.toString());

      const res = await kyInstance
        .get(`albums?${searchParams}`)
        .json<StandardResponse<{ data: Album[]; hasNextPage: boolean; nextCursor?: string }>>();
      return res.data;
    },
  });
};

export const useCreateAlbum = () => {
  const queryClient = useQueryClient();
  const invalidate = useInvalidate();

  return useMutation({
    mutationFn: async (data: CreateAlbumType) => {
      const res = await kyInstance
        .post("albums", { json: data })
        .json<StandardResponse<Album>>();
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: albumKeys.lists() });
      invalidate({
        resource: "albums",
        invalidates: ["list", "many"],
      });
    },
  });
};

export const useUpdateAlbum = () => {
  const queryClient = useQueryClient();
  const invalidate = useInvalidate();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateAlbumType>;
    }) => {
      const res = await kyInstance
        .patch(`albums/${id}`, { json: data })
        .json<StandardResponse<Album>>();
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: albumKeys.details(data.id) });
      queryClient.invalidateQueries({ queryKey: albumKeys.lists() });
      queryClient.invalidateQueries({ queryKey: albumKeys.artists(data.id) });
      invalidate({
        resource: "albums",
        invalidates: ["list", "many", "detail"],
        id: data.id,
      });
    },
  });
};

export const useDeleteAlbum = () => {
  const queryClient = useQueryClient();
  const invalidate = useInvalidate();

  return useMutation({
    mutationFn: async (id: string) => {
      await kyInstance.delete(`albums/${id}`).json();
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: albumKeys.lists() });
      invalidate({
        resource: "albums",
        invalidates: ["list", "many", "detail"],
        id,
      });
    },
  });
};

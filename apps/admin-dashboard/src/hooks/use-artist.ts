import { artistKeys } from "@/lib/react-query/query-keys";
import { kyInstance } from "@/providers/dataProvider";
import { Artist, StandardResponse } from "@/types/admin.types";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

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

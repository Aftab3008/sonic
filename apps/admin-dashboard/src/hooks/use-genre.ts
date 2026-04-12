import { genreKeys } from "@/lib/react-query/query-keys";
import { kyInstance } from "@/providers/dataProvider";
import { Genre, StandardResponse } from "@/types/admin.types";
import { useQuery } from "@tanstack/react-query";

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

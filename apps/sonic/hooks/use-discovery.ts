import { useQuery } from "@tanstack/react-query";
import { kyInstance } from "../providers/apiClient";
import { HomeDiscoveryResponse } from "../lib/schema/player.schema";
import { HTTPError } from "ky";

export const useGetHomeDiscovery = () => {
  return useQuery({
    queryKey: ["discovery", "home"],
    queryFn: async (): Promise<HomeDiscoveryResponse> => {
      try {
        console.log("[useGetHomeDiscovery] Fetching home discovery data...");
        const res = await kyInstance
          .get("v1/discovery/home")
          .json<{ data: HomeDiscoveryResponse }>();

        console.log("[useGetHomeDiscovery] SUCCESS");
        return res.data;
      } catch (error) {
        if (error instanceof HTTPError) {
          console.error(
            `[useGetHomeDiscovery] API Error ${error.response.status}:`,
            error.message,
          );
        } else {
          console.error("[useGetHomeDiscovery] Unexpected error:", error);
        }

        return {
          featured: null,
          recent: [],
          madeForYou: [],
        };
      }
    },
  });
};

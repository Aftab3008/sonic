import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { kyInstance } from "../providers/apiClient";
import { HomeDiscoveryResponse } from "../lib/schema/player.schema";
import { HTTPError } from "ky";

const fetchHomeDiscovery = async (): Promise<HomeDiscoveryResponse> => {
  try {
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
};

export const useGetHomeDiscovery = () => {
  return useQuery({
    queryKey: ["discovery", "home"],
    queryFn: fetchHomeDiscovery,
  });
};

export const useSuspenseHomeDiscovery = () => {
  return useSuspenseQuery({
    queryKey: ["discovery", "home"],
    queryFn: fetchHomeDiscovery,
  });
};

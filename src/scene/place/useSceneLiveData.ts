import { useQuery } from "@tanstack/react-query";
import {
  fetchLivePlaces,
  fetchLiveTraffic,
  fetchLiveWeather,
} from "@/src/shared/api";
import { APP_CONFIG } from "@/src/shared/config";
import type { SceneBootstrap } from "@/src/shared/contracts";

type UseSceneLiveDataInput = {
  slug: string;
  bootstrap: SceneBootstrap | null;
  normalizedHour: number;
  currentPedestrianLevel: "low" | "medium" | "high";
};

export function useSceneLiveData(input: UseSceneLiveDataInput) {
  const { slug, bootstrap, normalizedHour, currentPedestrianLevel } = input;

  return useQuery({
    queryKey: [
      "scene-live-data",
      slug,
      bootstrap?.geometryId,
      normalizedHour,
      currentPedestrianLevel,
    ],
    queryFn: async () => {
      if (!bootstrap) {
        throw new Error("Bootstrap is not available");
      }

      const [traffic, weather, places] = await Promise.all([
        fetchLiveTraffic(bootstrap.liveEndpoints.traffic, normalizedHour),
        fetchLiveWeather(bootstrap.liveEndpoints.weather, normalizedHour),
        fetchLivePlaces(bootstrap.liveEndpoints.places, currentPedestrianLevel),
      ]);

      return {
        traffic,
        weather,
        places,
      };
    },
    enabled: !!bootstrap,
    staleTime: APP_CONFIG.liveData.fetchMinIntervalMs,
    refetchInterval: APP_CONFIG.liveData.fetchMinIntervalMs,
  });
}

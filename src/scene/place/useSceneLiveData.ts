import { useEffect } from "react";
import {
  fetchLivePlaces,
  fetchLiveTraffic,
  fetchLiveWeather,
} from "../../shared/api";
import { createLogger, toErrorContext } from "../../shared/logger";
import type { SceneBootstrap } from "../../shared/contracts";

const logger = createLogger("scene:use-live-data");

type UseSceneLiveDataInput = {
  slug: string;
  bootstrap: SceneBootstrap | null;
  normalizedHour: number;
  currentWeather: "clear" | "cloudy" | "rain" | "snow";
  currentPedestrianLevel: "low" | "medium" | "high";
  currentVehicleLevel: "low" | "medium" | "high";
  setWeather: (value: "clear" | "cloudy" | "rain" | "snow") => void;
  setPedestrianLevel: (value: "low" | "medium" | "high") => void;
  setVehicleLevel: (value: "low" | "medium" | "high") => void;
};

export function useSceneLiveData(input: UseSceneLiveDataInput) {
  const {
    slug,
    bootstrap,
    normalizedHour,
    currentWeather,
    currentPedestrianLevel,
    currentVehicleLevel,
    setWeather,
    setPedestrianLevel,
    setVehicleLevel,
  } = input;

  useEffect(() => {
    if (!bootstrap) {
      return;
    }

    let mounted = true;

    void Promise.all([
      fetchLiveTraffic(bootstrap.liveEndpoints.traffic, normalizedHour),
      fetchLiveWeather(bootstrap.liveEndpoints.weather, normalizedHour),
      fetchLivePlaces(bootstrap.liveEndpoints.places, currentPedestrianLevel),
    ])
      .then(([trafficSnapshot, weatherSnapshot, placeSnapshot]) => {
        if (!mounted) {
          return;
        }

        if (weatherSnapshot.condition !== currentWeather) {
          setWeather(weatherSnapshot.condition);
        }
        if (placeSnapshot.pedestrianDensity !== currentPedestrianLevel) {
          setPedestrianLevel(placeSnapshot.pedestrianDensity);
        }
        if (placeSnapshot.vehicleDensity !== currentVehicleLevel) {
          setVehicleLevel(placeSnapshot.vehicleDensity);
        }

        logger.debug("Updated live scene snapshot", {
          slug,
          trafficDensity: trafficSnapshot.density,
          weather: weatherSnapshot.condition,
          pedestrianDensity: placeSnapshot.pedestrianDensity,
          vehicleDensity: placeSnapshot.vehicleDensity,
        });
      })
      .catch((error) => {
        if (!mounted) {
          return;
        }

        logger.warn("Failed to fetch live scene snapshot", {
          slug,
          ...toErrorContext(error),
        });
      });

    return () => {
      mounted = false;
    };
  }, [
    bootstrap,
    currentPedestrianLevel,
    currentVehicleLevel,
    currentWeather,
    normalizedHour,
    setPedestrianLevel,
    setVehicleLevel,
    setWeather,
    slug,
  ]);
}

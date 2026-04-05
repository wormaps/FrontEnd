import { useEffect } from "react";
import {
  fetchSceneLiveSnapshotBundle,
} from "../../shared/api";
import { createLogger, toErrorContext } from "../../shared/logger";
import type { SceneBootstrap } from "../../shared/contracts";
import { applyLiveStateBridge } from "./liveStateBridge";

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

    void fetchSceneLiveSnapshotBundle({
      bootstrap,
      hour: normalizedHour,
      density: currentPedestrianLevel,
    })
      .then(({ traffic, weather, place }) => {
        if (!mounted) {
          return;
        }

        applyLiveStateBridge({
          weatherSnapshot: weather,
          placeSnapshot: place,
          currentWeather,
          currentPedestrianLevel,
          currentVehicleLevel,
          setWeather,
          setPedestrianLevel,
          setVehicleLevel,
        });

        logger.debug("Updated live scene snapshot", {
          slug,
          trafficDensity: traffic.density,
          weather: weather.condition,
          pedestrianDensity: place.pedestrianDensity,
          vehicleDensity: place.vehicleDensity,
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

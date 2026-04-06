import { useEffect, useRef } from "react";
import {
  fetchLivePlaces,
  fetchLiveTraffic,
  fetchLiveWeather,
} from "../../shared/api";
import { createLogger, toErrorContext } from "../../shared/logger";
import type { SceneBootstrap } from "../../shared/contracts";

const logger = createLogger("scene:use-live-data");
const LIVE_FETCH_MIN_INTERVAL_MS = 1200;

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

  const latestWeatherRef = useRef(currentWeather);
  const latestPedestrianLevelRef = useRef(currentPedestrianLevel);
  const latestVehicleLevelRef = useRef(currentVehicleLevel);
  const lastFetchRef = useRef<{ key: string; requestedAt: number } | null>(null);

  latestWeatherRef.current = currentWeather;
  latestPedestrianLevelRef.current = currentPedestrianLevel;
  latestVehicleLevelRef.current = currentVehicleLevel;

  useEffect(() => {
    if (!bootstrap) {
      return;
    }

    const requestKey = [
      bootstrap.geometryId,
      normalizedHour,
      currentWeather,
      currentPedestrianLevel,
      currentVehicleLevel,
    ].join("|");
    const now = Date.now();
    const lastFetch = lastFetchRef.current;

    if (
      lastFetch &&
      lastFetch.key === requestKey &&
      now - lastFetch.requestedAt < LIVE_FETCH_MIN_INTERVAL_MS
    ) {
      return;
    }

    lastFetchRef.current = {
      key: requestKey,
      requestedAt: now,
    };

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

        if (weatherSnapshot.condition !== latestWeatherRef.current) {
          setWeather(weatherSnapshot.condition);
        }
        if (placeSnapshot.pedestrianDensity !== latestPedestrianLevelRef.current) {
          setPedestrianLevel(placeSnapshot.pedestrianDensity);
        }
        if (placeSnapshot.vehicleDensity !== latestVehicleLevelRef.current) {
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
    currentWeather,
    currentPedestrianLevel,
    currentVehicleLevel,
    normalizedHour,
    setPedestrianLevel,
    setVehicleLevel,
    setWeather,
    slug,
  ]);
}

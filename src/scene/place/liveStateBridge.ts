import type { LivePlaceSnapshot, LiveWeatherSnapshot } from "../../shared/contracts";

export type SceneLiveBridgeInput = {
  weatherSnapshot: LiveWeatherSnapshot;
  placeSnapshot: LivePlaceSnapshot;
  currentWeather: "clear" | "cloudy" | "rain" | "snow";
  currentPedestrianLevel: "low" | "medium" | "high";
  currentVehicleLevel: "low" | "medium" | "high";
  setWeather: (value: "clear" | "cloudy" | "rain" | "snow") => void;
  setPedestrianLevel: (value: "low" | "medium" | "high") => void;
  setVehicleLevel: (value: "low" | "medium" | "high") => void;
};

export function applyLiveStateBridge(input: SceneLiveBridgeInput): void {
  const {
    weatherSnapshot,
    placeSnapshot,
    currentWeather,
    currentPedestrianLevel,
    currentVehicleLevel,
    setWeather,
    setPedestrianLevel,
    setVehicleLevel,
  } = input;

  if (weatherSnapshot.condition !== currentWeather) {
    setWeather(weatherSnapshot.condition);
  }

  if (placeSnapshot.pedestrianDensity !== currentPedestrianLevel) {
    setPedestrianLevel(placeSnapshot.pedestrianDensity);
  }

  if (placeSnapshot.vehicleDensity !== currentVehicleLevel) {
    setVehicleLevel(placeSnapshot.vehicleDensity);
  }
}

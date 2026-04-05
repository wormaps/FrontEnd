import { normalizeHour } from "./time";

export type WeatherCondition = "clear" | "cloudy" | "rain" | "snow";

export type WeatherSnapshotPolicy = {
  condition: WeatherCondition;
  temperatureCelsius: number;
};

export function toWeatherConditionByHour(hour: number): WeatherCondition {
  const normalizedHour = normalizeHour(hour);

  if (normalizedHour >= 6 && normalizedHour < 17) {
    return "clear";
  }

  if (normalizedHour >= 17 && normalizedHour < 21) {
    return "cloudy";
  }

  return "rain";
}

export function toTemperatureByCondition(condition: WeatherCondition): number {
  if (condition === "rain") {
    return 10;
  }

  if (condition === "snow") {
    return -2;
  }

  return 18;
}

export function buildWeatherPolicy(hour: number): WeatherSnapshotPolicy {
  const condition = toWeatherConditionByHour(hour);

  return {
    condition,
    temperatureCelsius: toTemperatureByCondition(condition),
  };
}

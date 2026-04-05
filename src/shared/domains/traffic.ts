import { normalizeHour } from "./time";

export type LiveLevel = "low" | "medium" | "high";

export type TrafficSnapshotPolicy = {
  density: LiveLevel;
  speedKph: number;
};

function isRushHour(hour: number): boolean {
  const normalizedHour = normalizeHour(hour);
  const morningRush = normalizedHour >= 8 && normalizedHour <= 10;
  const eveningRush = normalizedHour >= 17 && normalizedHour <= 20;

  return morningRush || eveningRush;
}

export function toTrafficPolicy(hour: number): TrafficSnapshotPolicy {
  if (isRushHour(hour)) {
    return {
      density: "high",
      speedKph: 18,
    };
  }

  return {
    density: "medium",
    speedKph: 32,
  };
}

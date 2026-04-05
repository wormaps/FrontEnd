export type LiveLevel = "low" | "medium" | "high";

const DEFAULT_DENSITY: LiveLevel = "medium";

export function normalizeLiveLevel(level: string | null | undefined): LiveLevel {
  if (level === "low" || level === "high") {
    return level;
  }

  return DEFAULT_DENSITY;
}

export function getPedestrianCountByLevel(level: LiveLevel): number {
  if (level === "low") {
    return 10;
  }

  if (level === "high") {
    return 20;
  }

  return 15;
}

export function getVehicleCountByLevel(level: LiveLevel): number {
  if (level === "low") {
    return 4;
  }

  if (level === "high") {
    return 8;
  }

  return 6;
}

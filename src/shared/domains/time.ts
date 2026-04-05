export type TimeOfDay = "day" | "dusk" | "night";

const HOURS_IN_DAY = 24;
const DEFAULT_HOUR = 12;

export function normalizeHour(hour: number, fallback = DEFAULT_HOUR): number {
  if (!Number.isFinite(hour)) {
    return fallback;
  }

  const mod = hour % HOURS_IN_DAY;
  return mod < 0 ? mod + HOURS_IN_DAY : mod;
}

export function toTimeOfDay(hour: number): TimeOfDay {
  const normalizedHour = normalizeHour(hour);

  if (normalizedHour >= 6 && normalizedHour < 17) {
    return "day";
  }

  if (normalizedHour >= 17 && normalizedHour < 20) {
    return "dusk";
  }

  return "night";
}

export function isNightTime(hour: number): boolean {
  return toTimeOfDay(hour) === "night";
}

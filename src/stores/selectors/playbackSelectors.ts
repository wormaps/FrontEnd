import { isNightTime, toTimeOfDay } from "@/src/shared/domains";

// We extract just the state shape we need to evaluate derived values
type PlaybackStateShape = {
  currentTime: number;
};

export const selectIsNight = (state: PlaybackStateShape) => isNightTime(state.currentTime);

export const selectTimeOfDay = (state: PlaybackStateShape) => toTimeOfDay(state.currentTime);

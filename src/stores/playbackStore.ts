import { create } from "zustand";
import { normalizeHour } from "../shared/domains";

export type WeatherMode = "clear" | "cloudy" | "rain" | "snow";
export type TimeOfDay = "day" | "dusk" | "night";

export type PedestrianLevel = "low" | "medium" | "high";
export type VehicleLevel = "low" | "medium" | "high";

type PlaybackStore = {
  currentTime: number;
  setCurrentTime: (time: number) => void;

  isPlaying: boolean;
  speed: number;
  setIsPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;
  togglePlayback: () => void;
  advanceTime: (deltaHours: number) => void;

  weather: WeatherMode;
  setWeather: (weather: WeatherMode) => void;

  pedestrianLevel: PedestrianLevel;
  vehicleLevel: VehicleLevel;
  setPedestrianLevel: (level: PedestrianLevel) => void;
  setVehicleLevel: (level: VehicleLevel) => void;
};

export const usePlaybackStore = create<PlaybackStore>((set) => ({
  currentTime: 12,
  setCurrentTime: (time) => set({ currentTime: normalizeHour(time) }),

  isPlaying: false,
  speed: 1,
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setSpeed: (speed) => set({ speed }),
  togglePlayback: () => set((state) => ({ isPlaying: !state.isPlaying })),
  advanceTime: (deltaHours) =>
    set((state) => ({ currentTime: normalizeHour(state.currentTime + deltaHours) })),

  weather: "clear",
  setWeather: (weather) => set({ weather }),

  pedestrianLevel: "medium",
  vehicleLevel: "medium",
  setPedestrianLevel: (level) => set({ pedestrianLevel: level }),
  setVehicleLevel: (level) => set({ vehicleLevel: level }),
}));

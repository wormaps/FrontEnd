import { create } from "zustand";

export type WeatherMode = "clear" | "cloudy" | "rain" | "snow";
export type TimeOfDay = "day" | "dusk" | "night";

export type PedestrianLevel = "low" | "medium" | "high";
export type VehicleLevel = "low" | "medium" | "high";

type PlaybackStore = {
  // Time
  currentTime: number; // 0–24 (hour)
  setCurrentTime: (time: number) => void;

  // Playback
  isPlaying: boolean;
  speed: number; // 1 = real-time, 2 = 2x, 4 = 4x, etc.
  setIsPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;
  togglePlayback: () => void;

  // Weather
  weather: WeatherMode;
  setWeather: (weather: WeatherMode) => void;

  // Time of day
  timeOfDay: TimeOfDay;
  setTimeOfDay: (tod: TimeOfDay) => void;

  // Simulation levels
  pedestrianLevel: PedestrianLevel;
  vehicleLevel: VehicleLevel;
  setPedestrianLevel: (level: PedestrianLevel) => void;
  setVehicleLevel: (level: VehicleLevel) => void;

  // Computed helpers
  isNight: () => boolean;
};

export const usePlaybackStore = create<PlaybackStore>((set, get) => ({
  currentTime: 12,
  setCurrentTime: (time) => set({ currentTime: time }),

  isPlaying: false,
  speed: 1,
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setSpeed: (speed) => set({ speed: speed }),
  togglePlayback: () => set((state) => ({ isPlaying: !state.isPlaying })),

  weather: "clear",
  setWeather: (weather) => set({ weather }),

  timeOfDay: "day",
  setTimeOfDay: (tod) => set({ timeOfDay: tod }),

  pedestrianLevel: "medium",
  vehicleLevel: "medium",
  setPedestrianLevel: (level) => set({ pedestrianLevel: level }),
  setVehicleLevel: (level) => set({ vehicleLevel: level }),

  isNight: () => {
    const { timeOfDay } = get();
    return timeOfDay === "night";
  },
}));

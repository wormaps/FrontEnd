import { create } from "zustand";

export type ViewMode = "top" | "walk";
export type InputPreset = "precision" | "balanced" | "fast";

export type PlaceStatus = "idle" | "loading" | "ready" | "error";

export type Place = {
  id: string;
  slug: string;
  name: string;
  lat: number;
  lng: number;
  city: string;
  country: string;
};

type PlaceStore = {
  currentPlace: Place | null;
  setCurrentPlace: (place: Place | null) => void;

  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  inputPreset: InputPreset;
  setInputPreset: (preset: InputPreset) => void;

  status: PlaceStatus;
  setStatus: (status: PlaceStatus) => void;

  progress: number;
  setProgress: (progress: number) => void;
};

export const usePlaceStore = create<PlaceStore>((set) => ({
  currentPlace: null,
  setCurrentPlace: (place) => set({ currentPlace: place }),

  viewMode: "top",
  setViewMode: (mode) => set({ viewMode: mode }),

  inputPreset: "balanced",
  setInputPreset: (preset) => set({ inputPreset: preset }),

  status: "idle",
  setStatus: (status) => set({ status }),

  progress: 0,
  setProgress: (progress) => set({ progress }),
}));

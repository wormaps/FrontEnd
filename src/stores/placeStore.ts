import { create } from "zustand";

export type ViewMode = "top" | "walk";

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
  // Selected place
  currentPlace: Place | null;
  setCurrentPlace: (place: Place | null) => void;

  // View mode (top / walk)
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Scene ready state
  status: PlaceStatus;
  setStatus: (status: PlaceStatus) => void;

  // Loading progress (0–100)
  progress: number;
  setProgress: (progress: number) => void;
};

export const usePlaceStore = create<PlaceStore>((set) => ({
  currentPlace: null,
  setCurrentPlace: (place) => set({ currentPlace: place }),

  viewMode: "top",
  setViewMode: (mode) => set({ viewMode: mode }),

  status: "idle",
  setStatus: (status) => set({ status }),

  progress: 0,
  setProgress: (progress) => set({ progress }),
}));

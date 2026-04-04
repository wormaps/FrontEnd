import { create } from "zustand";

export type AppMode = "globe" | "loading" | "place";

type AppStore = {
  // Top-level mode
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;

  // Global loading (shared across scenes)
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;

  // Selected place id (from globe)
  selectedPlaceId: string | null;
  setSelectedPlaceId: (id: string | null) => void;
};

export const useAppStore = create<AppStore>((set) => ({
  currentMode: "globe",
  setMode: (mode) => set({ currentMode: mode }),

  globalLoading: false,
  setGlobalLoading: (loading) => set({ globalLoading: loading }),

  selectedPlaceId: null,
  setSelectedPlaceId: (id) => set({ selectedPlaceId: id }),
}));

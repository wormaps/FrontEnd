import type { StateCreator } from "zustand";

export type ViewMode = "top" | "walk";
export type InputPreset = "precision" | "balanced" | "fast";

export type CameraSlice = {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  inputPreset: InputPreset;
  setInputPreset: (preset: InputPreset) => void;
};

export const createCameraSlice: StateCreator<CameraSlice, [], [], CameraSlice> = (set) => ({
  viewMode: "top",
  setViewMode: (mode) => set({ viewMode: mode }),

  inputPreset: "balanced",
  setInputPreset: (preset) => set({ inputPreset: preset }),
});

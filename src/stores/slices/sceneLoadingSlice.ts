import type { StateCreator } from "zustand";

export type PlaceStatus = "idle" | "loading" | "ready" | "error";

export type SceneLoadingSlice = {
  status: PlaceStatus;
  setStatus: (status: PlaceStatus) => void;

  progress: number;
  setProgress: (progress: number) => void;
};

export const createSceneLoadingSlice: StateCreator<SceneLoadingSlice, [], [], SceneLoadingSlice> = (set) => ({
  status: "idle",
  setStatus: (status) => set({ status }),

  progress: 0,
  setProgress: (progress) => set({ progress }),
});

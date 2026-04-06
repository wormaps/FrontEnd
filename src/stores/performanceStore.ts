import { create } from "zustand";

export type PerformanceSnapshot = {
  fps: number;
  frameTimeMs: number;
  sampledAt: number;
};

type PerformanceStore = {
  snapshot: PerformanceSnapshot;
  setSnapshot: (snapshot: PerformanceSnapshot) => void;
};

const INITIAL_SNAPSHOT: PerformanceSnapshot = {
  fps: 60,
  frameTimeMs: 16.67,
  sampledAt: 0,
};

export const usePerformanceStore = create<PerformanceStore>((set) => ({
  snapshot: INITIAL_SNAPSHOT,
  setSnapshot: (snapshot) => set({ snapshot }),
}));

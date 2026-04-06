import type { StateCreator } from "zustand";

export type Place = {
  id: string;
  slug: string;
  name: string;
  lat: number;
  lng: number;
  city: string;
  country: string;
};

export type PlaceSlice = {
  currentPlace: Place | null;
  setCurrentPlace: (place: Place | null) => void;
};

export const createPlaceSlice: StateCreator<PlaceSlice, [], [], PlaceSlice> = (set) => ({
  currentPlace: null,
  setCurrentPlace: (place) => set({ currentPlace: place }),
});

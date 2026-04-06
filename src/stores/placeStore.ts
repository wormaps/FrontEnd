import { create } from "zustand";
import { createPlaceSlice, type PlaceSlice, type Place } from "./slices/placeSlice";
import { createSceneLoadingSlice, type SceneLoadingSlice, type PlaceStatus } from "./slices/sceneLoadingSlice";
import { createCameraSlice, type CameraSlice, type ViewMode, type InputPreset } from "./slices/cameraSlice";

export type { Place, PlaceStatus, ViewMode, InputPreset };

export type PlaceStore = PlaceSlice & SceneLoadingSlice & CameraSlice;

export const usePlaceStore = create<PlaceStore>()((...a) => ({
  ...createPlaceSlice(...a),
  ...createSceneLoadingSlice(...a),
  ...createCameraSlice(...a),
}));

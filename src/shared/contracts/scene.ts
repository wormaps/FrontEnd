export type SceneBootstrap = {
  placeId: string;
  slug: string;
  sceneVersion: number;
  geometryId: string;
  assetUrl: string;
  sceneEndpoints: {
    mapping: string;
    package: string;
  };
  liveEndpoints: {
    traffic: string;
    weather: string;
    places: string;
  };
  cacheTtlSeconds: {
    traffic: number;
    weather: number;
    places: number;
  };
};

export type LiveStateLevel = "low" | "medium" | "high";

export type LiveTrafficState = {
  density: LiveStateLevel;
  speedKph: number;
};

export type LiveWeatherState = {
  condition: "clear" | "cloudy" | "rain" | "snow";
  temperatureCelsius: number;
};

export type LivePlaceState = {
  pedestrianDensity: LiveStateLevel;
  vehicleDensity: LiveStateLevel;
};

export type SceneLiveState = {
  traffic: LiveTrafficState;
  weather: LiveWeatherState;
  place: LivePlaceState;
  capturedAtIso: string;
};

type SceneLiveSnapshotBase = {
  geometryId: string;
  key: string;
  capturedAtIso: string;
};

export type LiveTrafficSnapshot = SceneLiveSnapshotBase & LiveTrafficState;

export type LiveWeatherSnapshot = SceneLiveSnapshotBase & LiveWeatherState;

export type LivePlaceSnapshot = SceneLiveSnapshotBase & LivePlaceState;

export type SceneLifecycle =
  | { stage: "bootstrapping"; slug: string }
  | { stage: "ready"; slug: string; geometryId: string }
  | { stage: "live"; slug: string; geometryId: string; capturedAtIso: string }
  | { stage: "error"; slug: string; message: string };

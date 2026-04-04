export type SceneBootstrap = {
  placeId: string;
  slug: string;
  sceneVersion: number;
  geometryId: string;
  assetUrl: string;
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

import type { PlacePackage } from "../../data/placePackages";
import type {
  GeometryLiveMapping,
  LiveStateLevel,
  LivePlaceSnapshot,
  LiveTrafficSnapshot,
  LiveWeatherSnapshot,
  SceneBootstrap,
} from "../contracts";
import {
  validateGeometryLiveMapping,
  validateLivePlaceSnapshot,
  validateLiveTrafficSnapshot,
  validateLiveWeatherSnapshot,
  validateSceneBootstrap,
} from "../contracts";

const inflightRequestMap = new Map<string, Promise<unknown>>();

async function fetchJson<T>(input: string): Promise<T> {
  const cached = inflightRequestMap.get(input) as Promise<T> | undefined;
  if (cached) {
    return await cached;
  }

  const pending = (async () => {
    const response = await fetch(input, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Request failed (${response.status}) for ${input}`);
    }

    return (await response.json()) as T;
  })();

  inflightRequestMap.set(input, pending);

  try {
    return await pending;
  } finally {
    inflightRequestMap.delete(input);
  }
}

export async function fetchSceneBootstrap(slug: string): Promise<SceneBootstrap> {
  const json = await fetchJson<SceneBootstrap>(`/api/scene/${slug}/bootstrap`);
  return validateSceneBootstrap(json);
}

export async function fetchSceneMapping(endpoint: string): Promise<GeometryLiveMapping> {
  const json = await fetchJson<GeometryLiveMapping>(endpoint);
  return validateGeometryLiveMapping(json);
}

export async function fetchScenePackage(endpoint: string): Promise<PlacePackage> {
  return await fetchJson<PlacePackage>(endpoint);
}

export async function fetchLiveTraffic(endpoint: string, hour: number): Promise<LiveTrafficSnapshot> {
  const params = new URLSearchParams({
    hour: String(hour),
  });
  const separator = endpoint.includes("?") ? "&" : "?";
  const json = await fetchJson<LiveTrafficSnapshot>(`${endpoint}${separator}${params.toString()}`);
  return validateLiveTrafficSnapshot(json);
}

export async function fetchLiveWeather(
  endpoint: string,
  hour: number,
): Promise<LiveWeatherSnapshot> {
  const params = new URLSearchParams({
    hour: String(hour),
  });
  const separator = endpoint.includes("?") ? "&" : "?";
  const json = await fetchJson<LiveWeatherSnapshot>(`${endpoint}${separator}${params.toString()}`);
  return validateLiveWeatherSnapshot(json);
}

export async function fetchLivePlaces(
  endpoint: string,
  density: LivePlaceSnapshot["pedestrianDensity"],
): Promise<LivePlaceSnapshot> {
  const params = new URLSearchParams({
    density,
  });
  const separator = endpoint.includes("?") ? "&" : "?";
  const json = await fetchJson<LivePlaceSnapshot>(`${endpoint}${separator}${params.toString()}`);
  return validateLivePlaceSnapshot(json);
}

export async function fetchSceneBootstrapBundle(slug: string) {
  const bootstrap = await fetchSceneBootstrap(slug);
  const [mapping, pkg] = await Promise.all([
    fetchSceneMapping(bootstrap.sceneEndpoints.mapping),
    fetchScenePackage(bootstrap.sceneEndpoints.package),
  ]);

  return {
    bootstrap,
    mapping,
    pkg,
  };
}

type FetchSceneLiveSnapshotBundleInput = {
  bootstrap: SceneBootstrap;
  hour: number;
  density: LiveStateLevel;
};

type SceneLiveSnapshotBundle = {
  traffic: LiveTrafficSnapshot;
  weather: LiveWeatherSnapshot;
  place: LivePlaceSnapshot;
};

export async function fetchSceneLiveSnapshotBundle(
  input: FetchSceneLiveSnapshotBundleInput,
): Promise<SceneLiveSnapshotBundle> {
  const { bootstrap, hour, density } = input;

  const [traffic, weather, place] = await Promise.all([
    fetchLiveTraffic(bootstrap.liveEndpoints.traffic, hour),
    fetchLiveWeather(bootstrap.liveEndpoints.weather, hour),
    fetchLivePlaces(bootstrap.liveEndpoints.places, density),
  ]);

  return {
    traffic,
    weather,
    place,
  };
}

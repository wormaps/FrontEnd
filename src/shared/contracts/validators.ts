import type { GeometryLiveMapping } from "./geometry";
import type {
  LivePlaceSnapshot,
  LiveTrafficSnapshot,
  LiveWeatherSnapshot,
  SceneBootstrap,
} from "./scene";

function ensure(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export function validateSceneBootstrap(input: SceneBootstrap): SceneBootstrap {
  ensure(input.placeId.length > 0, "scene bootstrap placeId is required");
  ensure(input.slug.length > 0, "scene bootstrap slug is required");
  ensure(input.sceneVersion >= 1, "scene bootstrap sceneVersion must be >= 1");
  ensure(input.geometryId.length > 0, "scene bootstrap geometryId is required");
  ensure(input.assetUrl.length > 0, "scene bootstrap assetUrl is required");
  ensure(typeof input.assetAvailable === "boolean", "scene bootstrap assetAvailable must be boolean");
  if (input.assetAvailable) {
    ensure(input.assetUrl.endsWith(".glb"), "scene bootstrap assetUrl must be a .glb when asset is available");
  }

  ensure(input.sceneEndpoints.mapping.length > 0, "scene bootstrap mapping endpoint is required");
  ensure(input.sceneEndpoints.package.length > 0, "scene bootstrap package endpoint is required");

  ensure(input.liveEndpoints.traffic.length > 0, "scene bootstrap traffic endpoint is required");
  ensure(input.liveEndpoints.weather.length > 0, "scene bootstrap weather endpoint is required");
  ensure(input.liveEndpoints.places.length > 0, "scene bootstrap places endpoint is required");

  ensure(input.cacheTtlSeconds.traffic > 0, "scene bootstrap traffic TTL must be > 0");
  ensure(input.cacheTtlSeconds.weather > 0, "scene bootstrap weather TTL must be > 0");
  ensure(input.cacheTtlSeconds.places > 0, "scene bootstrap places TTL must be > 0");

  return input;
}

export function validateGeometryLiveMapping(input: GeometryLiveMapping): GeometryLiveMapping {
  ensure(input.geometryId.length > 0, "geometry mapping geometryId is required");

  for (const binding of input.bindings) {
    ensure(binding.nodeId.length > 0, "geometry mapping binding nodeId is required");
  }

  return input;
}

function isLiveStateLevel(input: string): input is "low" | "medium" | "high" {
  return input === "low" || input === "medium" || input === "high";
}

function isWeatherCondition(input: string): input is "clear" | "cloudy" | "rain" | "snow" {
  return input === "clear" || input === "cloudy" || input === "rain" || input === "snow";
}

export function validateLiveTrafficSnapshot(input: LiveTrafficSnapshot): LiveTrafficSnapshot {
  ensure(input.geometryId.length > 0, "traffic snapshot geometryId is required");
  ensure(input.key.length > 0, "traffic snapshot key is required");
  ensure(isLiveStateLevel(input.density), "traffic snapshot density is invalid");
  ensure(Number.isFinite(input.speedKph), "traffic snapshot speedKph must be finite");
  ensure(input.capturedAtIso.length > 0, "traffic snapshot capturedAtIso is required");

  return input;
}

export function validateLiveWeatherSnapshot(input: LiveWeatherSnapshot): LiveWeatherSnapshot {
  ensure(input.geometryId.length > 0, "weather snapshot geometryId is required");
  ensure(input.key.length > 0, "weather snapshot key is required");
  ensure(isWeatherCondition(input.condition), "weather snapshot condition is invalid");
  ensure(Number.isFinite(input.temperatureCelsius), "weather snapshot temperatureCelsius must be finite");
  ensure(input.capturedAtIso.length > 0, "weather snapshot capturedAtIso is required");

  return input;
}

export function validateLivePlaceSnapshot(input: LivePlaceSnapshot): LivePlaceSnapshot {
  ensure(input.geometryId.length > 0, "place snapshot geometryId is required");
  ensure(input.key.length > 0, "place snapshot key is required");
  ensure(isLiveStateLevel(input.pedestrianDensity), "place snapshot pedestrianDensity is invalid");
  ensure(isLiveStateLevel(input.vehicleDensity), "place snapshot vehicleDensity is invalid");
  ensure(input.capturedAtIso.length > 0, "place snapshot capturedAtIso is required");

  return input;
}

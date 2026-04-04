import { PLACE_PACKAGES } from "../../data/placePackages";
import type { Place } from "../../types/place";
import type { GeometryLiveMapping, SceneBootstrap } from "../contracts";

function toLiveStateEndpoint(baseSlug: string, kind: "traffic" | "weather" | "places") {
  return `/api/live/${baseSlug}/${kind}`;
}

export function createStaticSceneBootstrap(place: Place): SceneBootstrap {
  const pkg = PLACE_PACKAGES[place.slug];
  const sceneVersion = 1;

  if (!pkg) {
    return {
      placeId: place.id,
      slug: place.slug,
      sceneVersion,
      geometryId: `${place.slug}:missing`,
      assetUrl: "",
      liveEndpoints: {
        traffic: toLiveStateEndpoint(place.slug, "traffic"),
        weather: toLiveStateEndpoint(place.slug, "weather"),
        places: toLiveStateEndpoint(place.slug, "places"),
      },
      cacheTtlSeconds: {
        traffic: 30,
        weather: 300,
        places: 120,
      },
    };
  }

  return {
    placeId: place.id,
    slug: place.slug,
    sceneVersion,
    geometryId: `${pkg.slug}:v${sceneVersion}`,
    assetUrl: `/assets/places/${pkg.slug}/scene-v${sceneVersion}.glb`,
    liveEndpoints: {
      traffic: toLiveStateEndpoint(pkg.slug, "traffic"),
      weather: toLiveStateEndpoint(pkg.slug, "weather"),
      places: toLiveStateEndpoint(pkg.slug, "places"),
    },
    cacheTtlSeconds: {
      traffic: 30,
      weather: 300,
      places: 120,
    },
  };
}

export function createStaticGeometryMapping(slug: string): GeometryLiveMapping {
  const pkg = PLACE_PACKAGES[slug];
  const geometryId = `${slug}:v1`;

  if (!pkg) {
    return {
      geometryId,
      bindings: [],
    };
  }

  const buildingBindings = pkg.buildings.map((building) => ({
    nodeId: `building:${building.id}`,
    domain: "building" as const,
    tags: ["static", "emissive-night"],
  }));

  const roadBindings = pkg.roads.map((road) => ({
    nodeId: `road:${road.id}`,
    domain: "road" as const,
    tags: ["traffic-sensitive"],
  }));

  return {
    geometryId,
    bindings: [...buildingBindings, ...roadBindings],
  };
}

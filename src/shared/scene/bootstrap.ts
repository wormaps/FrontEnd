import { PLACE_PACKAGES } from "../../data/placePackages";
import type { Place } from "../../types/place";
import {
  type GeometryLiveMapping,
  type SceneBootstrap,
  validateGeometryLiveMapping,
  validateSceneBootstrap,
} from "../contracts";

function toLiveStateEndpoint(baseSlug: string, kind: "traffic" | "weather" | "places") {
  return `/api/live/${baseSlug}/${kind}`;
}

function toAssetUrl(slug: string, sceneVersion: number) {
  return `/assets/places/${slug}/scene-v${sceneVersion}.glb`;
}

type CreateStaticSceneBootstrapOptions = {
  assetAvailable?: boolean;
};

export function createStaticSceneBootstrap(
  place: Place,
  options: CreateStaticSceneBootstrapOptions = {},
): SceneBootstrap {
  const pkg = PLACE_PACKAGES[place.slug];
  const sceneVersion = 1;

  if (!pkg) {
    throw new Error(`Place package not found for slug: ${place.slug}`);
  }

  const assetUrl = toAssetUrl(pkg.slug, sceneVersion);
  const assetAvailable = options.assetAvailable ?? false;

  return validateSceneBootstrap({
    placeId: place.id,
    slug: place.slug,
    sceneVersion,
    geometryId: `${pkg.slug}:v${sceneVersion}`,
    assetUrl,
    assetAvailable,
    sceneEndpoints: {
      mapping: `/api/scene/${pkg.slug}/mapping`,
      package: `/api/scene/${pkg.slug}/package`,
    },
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
  });
}

export function createStaticGeometryMapping(slug: string): GeometryLiveMapping {
  const pkg = PLACE_PACKAGES[slug];
  const geometryId = `${slug}:v1`;

  if (!pkg) {
    throw new Error(`Place package not found for slug: ${slug}`);
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

  return validateGeometryLiveMapping({
    geometryId,
    bindings: [...buildingBindings, ...roadBindings],
  });
}

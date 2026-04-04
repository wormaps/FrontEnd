export const CACHE_KEY_PREFIX = "scene";

export function toSceneManifestCacheKey(slug: string) {
  return `${CACHE_KEY_PREFIX}:${slug}:manifest`;
}

export function toSceneMappingCacheKey(slug: string) {
  return `${CACHE_KEY_PREFIX}:${slug}:mapping`;
}

export function toLiveStateCacheKey(
  geometryId: string,
  kind: "traffic" | "weather" | "places",
) {
  return `${CACHE_KEY_PREFIX}:${geometryId}:live:${kind}`;
}

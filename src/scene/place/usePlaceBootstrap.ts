import { useQuery } from "@tanstack/react-query";
import { fetchSceneBootstrapBundle } from "@/src/shared/api";
import { MVP_PLACES } from "@/src/data/places";
import type { PlacePackage } from "@/src/data/placePackages";
import type { GeometryLiveMapping, SceneBootstrap } from "@/src/shared/contracts";

export type PlaceEntity = {
  id: string;
  slug: string;
  name: string;
  lat: number;
  lng: number;
  city: string;
  country: string;
};

export type PlaceBootstrapData = {
  pkg: PlacePackage;
  bootstrap: SceneBootstrap;
  mapping: GeometryLiveMapping;
  placeMeta: PlaceEntity;
};

/** slug → 표시 이름 변환 (fallback: slug를 제목형으로) */
function toPlaceLabel(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** MVP_PLACES에서 slug에 맞는 장소 메타데이터를 조회합니다. */
function findPlaceMeta(slug: string) {
  return MVP_PLACES.find((p) => p.slug === slug) ?? null;
}

export function usePlaceBootstrap(slug: string) {
  return useQuery<PlaceBootstrapData>({
    queryKey: ["place-bootstrap", slug],
    queryFn: async () => {
      const data = await fetchSceneBootstrapBundle(slug);
      const knownPlace = findPlaceMeta(slug);
      
      const placeMeta: PlaceEntity = {
        id: data.bootstrap.placeId,
        slug: data.bootstrap.slug,
        name: knownPlace?.name ?? toPlaceLabel(data.bootstrap.slug),
        lat: knownPlace?.lat ?? 0,
        lng: knownPlace?.lng ?? 0,
        city: knownPlace?.city ?? "",
        country: knownPlace?.country ?? "",
      };

      return {
        pkg: data.pkg,
        bootstrap: data.bootstrap,
        mapping: data.mapping,
        placeMeta,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

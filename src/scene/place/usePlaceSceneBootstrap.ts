import { useEffect, useState } from "react";
import type { PlacePackage } from "../../data/placePackages";
import { useAppStore } from "../../stores/appStore";
import { usePlaceStore } from "../../stores/placeStore";
import { usePlaybackStore } from "../../stores/playbackStore";
import { fetchSceneBootstrapBundle } from "../../shared/api";
import { APP_CONFIG } from "../../shared/config";
import type { GeometryLiveMapping, SceneBootstrap } from "../../shared/contracts";
import { createLogger, toErrorContext } from "../../shared/logger";
import { useSceneLiveData } from "./useSceneLiveData";

const logger = createLogger("scene:place-bootstrap");

function toPlaceLabel(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

type UsePlaceSceneBootstrapInput = {
  slug: string;
  normalizedHour: number;
};

type UsePlaceSceneBootstrapOutput = {
  scenePkg: PlacePackage | null;
  sceneBootstrap: SceneBootstrap | null;
  sceneMapping: GeometryLiveMapping | null;
};

export function usePlaceSceneBootstrap(
  input: UsePlaceSceneBootstrapInput,
): UsePlaceSceneBootstrapOutput {
  const { slug, normalizedHour } = input;

  const setStatus = usePlaceStore((s) => s.setStatus);
  const setProgress = usePlaceStore((s) => s.setProgress);
  const setCurrentPlace = usePlaceStore((s) => s.setCurrentPlace);
  const setMode = useAppStore((s) => s.setMode);
  const setWeather = usePlaybackStore((s) => s.setWeather);
  const setPedestrianLevel = usePlaybackStore((s) => s.setPedestrianLevel);
  const setVehicleLevel = usePlaybackStore((s) => s.setVehicleLevel);
  const currentWeather = usePlaybackStore((s) => s.weather);
  const currentPedestrianLevel = usePlaybackStore((s) => s.pedestrianLevel);
  const currentVehicleLevel = usePlaybackStore((s) => s.vehicleLevel);

  const [scenePkgBySlug, setScenePkgBySlug] = useState<Record<string, PlacePackage | null>>({});
  const [sceneBootstrapBySlug, setSceneBootstrapBySlug] = useState<Record<string, SceneBootstrap | null>>({});
  const [sceneMappingBySlug, setSceneMappingBySlug] = useState<Record<string, GeometryLiveMapping | null>>({});

  const scenePkg = scenePkgBySlug[slug] ?? null;
  const sceneBootstrap = sceneBootstrapBySlug[slug] ?? null;
  const sceneMapping = sceneMappingBySlug[slug] ?? null;

  useEffect(() => {
    let mounted = true;
    let readyTimer: ReturnType<typeof setTimeout> | null = null;

    setStatus("loading");
    setProgress(APP_CONFIG.place.loading.initialProgress);

    void fetchSceneBootstrapBundle(slug)
      .then(({ bootstrap, mapping, pkg: fetchedPkg }) => {
        if (!mounted) {
          return;
        }

        setScenePkgBySlug((previous) => ({
          ...previous,
          [slug]: fetchedPkg,
        }));
        setSceneBootstrapBySlug((previous) => ({
          ...previous,
          [slug]: bootstrap,
        }));
        setSceneMappingBySlug((previous) => ({
          ...previous,
          [slug]: mapping,
        }));

        logger.info("Bootstrapping place scene", {
          slug,
          geometryId: bootstrap.geometryId,
          bindingCount: mapping.bindings.length,
          assetUrl: bootstrap.assetUrl,
        });

        setCurrentPlace({
          id: bootstrap.placeId,
          slug: bootstrap.slug,
          name: toPlaceLabel(bootstrap.slug),
          lat: 0,
          lng: 0,
          city: "",
          country: "",
        });
        setMode("place");

        readyTimer = setTimeout(() => {
          if (!mounted) {
            return;
          }
          setProgress(APP_CONFIG.place.loading.completedProgress);
          setStatus("ready");
          logger.info("Place scene ready", {
            slug,
          });
        }, APP_CONFIG.place.loading.readyDelayMs);
      })
      .catch((error) => {
        if (!mounted) {
          return;
        }
        setStatus("error");
        logger.error("Failed to bootstrap place scene", {
          slug,
          ...toErrorContext(error),
        });
      });

    return () => {
      mounted = false;
      if (readyTimer) {
        clearTimeout(readyTimer);
      }
    };
  }, [setCurrentPlace, setMode, setProgress, setStatus, slug]);

  useSceneLiveData({
    slug,
    bootstrap: sceneBootstrap,
    normalizedHour,
    currentWeather,
    currentPedestrianLevel,
    currentVehicleLevel,
    setWeather,
    setPedestrianLevel,
    setVehicleLevel,
  });

  return {
    scenePkg,
    sceneBootstrap,
    sceneMapping,
  };
}

import { useEffect, useState } from "react";
import type { PlacePackage } from "../../data/placePackages";
import { APP_CONFIG } from "../../shared/config";
import { fetchSceneBootstrapBundle } from "../../shared/api";
import type { GeometryLiveMapping, SceneBootstrap } from "../../shared/contracts";
import { createLogger, toErrorContext } from "../../shared/logger";

type UsePlaceBootstrapInput = {
  slug: string;
  setStatus: (status: "idle" | "loading" | "ready" | "error") => void;
  setProgress: (progress: number) => void;
  setCurrentPlace: (place: {
    id: string;
    slug: string;
    name: string;
    lat: number;
    lng: number;
    city: string;
    country: string;
  } | null) => void;
  setMode: (mode: "globe" | "loading" | "place") => void;
};

type UsePlaceBootstrapResult = {
  scenePkg: PlacePackage | null;
  sceneBootstrap: SceneBootstrap | null;
  sceneMapping: GeometryLiveMapping | null;
};

const logger = createLogger("scene:place-bootstrap");

function toPlaceLabel(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function usePlaceBootstrap(input: UsePlaceBootstrapInput): UsePlaceBootstrapResult {
  const { slug, setStatus, setProgress, setCurrentPlace, setMode } = input;

  const [scenePkgBySlug, setScenePkgBySlug] = useState<Record<string, PlacePackage | null>>({});
  const [sceneBootstrapBySlug, setSceneBootstrapBySlug] = useState<Record<string, SceneBootstrap | null>>({});
  const [sceneMappingBySlug, setSceneMappingBySlug] = useState<Record<string, GeometryLiveMapping | null>>({});

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

  return {
    scenePkg: scenePkgBySlug[slug] ?? null,
    sceneBootstrap: sceneBootstrapBySlug[slug] ?? null,
    sceneMapping: sceneMappingBySlug[slug] ?? null,
  };
}

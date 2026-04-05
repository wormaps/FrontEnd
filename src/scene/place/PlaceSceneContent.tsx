"use client";

import { useEffect, useMemo, useState } from "react";
import { usePlaceStore } from "../../stores/placeStore";
import { useAppStore } from "../../stores/appStore";
import type { PlacePackage } from "../../data/placePackages";
import { usePlaybackStore } from "../../stores/playbackStore";
import { APP_CONFIG } from "../../shared/config";
import { normalizeHour } from "../../shared/domains";
import { createLogger, toErrorContext } from "../../shared/logger";
import {
  fetchSceneBootstrapBundle,
} from "../../shared/api";
import type { GeometryLiveMapping, SceneBootstrap } from "../../shared/contracts";
import StaticEnvironment from "./StaticEnvironment";
import CameraController from "./CameraController";
import PlaybackSystem from "./PlaybackSystem";
import RainEffect from "./RainEffect";
import PedestrianSystem from "./PedestrianSystem";
import VehicleSystem from "./VehicleSystem";
import { useSceneLiveData } from "./useSceneLiveData";

type PlaceSceneContentProps = {
  slug: string;
};

const logger = createLogger("scene:place-content");

function toPlaceLabel(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function PlaceSceneContent({ slug }: PlaceSceneContentProps) {
  const setStatus = usePlaceStore((s) => s.setStatus);
  const setProgress = usePlaceStore((s) => s.setProgress);
  const setCurrentPlace = usePlaceStore((s) => s.setCurrentPlace);
  const setMode = useAppStore((s) => s.setMode);
  const setWeather = usePlaybackStore((s) => s.setWeather);
  const setPedestrianLevel = usePlaybackStore((s) => s.setPedestrianLevel);
  const setVehicleLevel = usePlaybackStore((s) => s.setVehicleLevel);
  const currentTime = usePlaybackStore((s) => s.currentTime);
  const currentWeather = usePlaybackStore((s) => s.weather);
  const currentPedestrianLevel = usePlaybackStore((s) => s.pedestrianLevel);
  const currentVehicleLevel = usePlaybackStore((s) => s.vehicleLevel);
  const isNight = usePlaybackStore((s) => s.isNight());
  const weather = usePlaybackStore((s) => s.weather);

  const [scenePkgBySlug, setScenePkgBySlug] = useState<Record<string, PlacePackage | null>>({});
  const [sceneBootstrapBySlug, setSceneBootstrapBySlug] = useState<Record<string, SceneBootstrap | null>>({});
  const [sceneMappingBySlug, setSceneMappingBySlug] = useState<Record<string, GeometryLiveMapping | null>>({});

  const scenePkg = scenePkgBySlug[slug] ?? null;
  const sceneBootstrap = sceneBootstrapBySlug[slug] ?? null;
  const sceneMapping = sceneMappingBySlug[slug] ?? null;

  const normalizedHour = useMemo(() => {
    return normalizeHour(Math.floor(currentTime));
  }, [currentTime]);

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

  if (!scenePkg) {
    return null;
  }

  const ambientIntensity = isNight
    ? APP_CONFIG.scene.light.night.ambientIntensity
    : APP_CONFIG.scene.light.day.ambientIntensity;
  const ambientColor = isNight ? APP_CONFIG.scene.light.night.ambientColor : scenePkg.ambientColor;
  const directionalIntensity = isNight
    ? APP_CONFIG.scene.light.night.directionalIntensity
    : APP_CONFIG.scene.light.day.directionalIntensity;
  const directionalColor = isNight
    ? APP_CONFIG.scene.light.night.directionalColor
    : APP_CONFIG.scene.light.day.directionalColor;

  return (
    <>
      <ambientLight intensity={ambientIntensity} color={ambientColor} />
      <directionalLight
        position={APP_CONFIG.scene.light.directionalPosition}
        intensity={directionalIntensity}
        color={directionalColor}
        castShadow
        shadow-mapSize={APP_CONFIG.scene.light.directionalShadowMapSize}
      />

      <PlaybackSystem />

      <StaticEnvironment
        pkg={scenePkg}
        assetUrl={sceneBootstrap?.assetUrl ?? ""}
        assetAvailable={sceneBootstrap?.assetAvailable ?? false}
        mapping={sceneMapping}
      />

      <PedestrianSystem />
      <VehicleSystem pkg={scenePkg} />

      {weather === "rain" ? <RainEffect /> : null}

      <CameraController pkg={scenePkg} />
    </>
  );
}

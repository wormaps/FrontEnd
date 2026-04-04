"use client";

import { useEffect } from "react";
import { usePlaceStore } from "../../stores/placeStore";
import { useAppStore } from "../../stores/appStore";
import { PLACE_PACKAGES } from "../../data/placePackages";
import { usePlaybackStore } from "../../stores/playbackStore";
import { APP_CONFIG } from "../../shared/config";
import { createLogger } from "../../shared/logger";
import { createStaticGeometryMapping, createStaticSceneBootstrap } from "../../shared/scene";
import StaticEnvironment from "./StaticEnvironment";
import CameraController from "./CameraController";
import PlaybackSystem from "./PlaybackSystem";
import RainEffect from "./RainEffect";
import PedestrianSystem from "./PedestrianSystem";
import VehicleSystem from "./VehicleSystem";

type PlaceSceneContentProps = {
  slug: string;
};

const logger = createLogger("scene:place-content");

export default function PlaceSceneContent({ slug }: PlaceSceneContentProps) {
  const pkg = PLACE_PACKAGES[slug];
  const setStatus = usePlaceStore((s) => s.setStatus);
  const setProgress = usePlaceStore((s) => s.setProgress);
  const setCurrentPlace = usePlaceStore((s) => s.setCurrentPlace);
  const setMode = useAppStore((s) => s.setMode);
  const isNight = usePlaybackStore((s) => s.isNight());
  const weather = usePlaybackStore((s) => s.weather);

  const bootstrap = createStaticSceneBootstrap({
    id: slug,
    slug,
    name: slug,
    lat: 0,
    lng: 0,
    city: "",
    country: "",
  });
  const mapping = createStaticGeometryMapping(slug);

  useEffect(() => {
    if (!pkg) {
      setStatus("error");
      logger.warn("Place package not found for slug", {
        slug,
      });
      return;
    }

    logger.info("Bootstrapping place scene", {
      slug,
      geometryId: bootstrap.geometryId,
      bindingCount: mapping.bindings.length,
      assetUrl: bootstrap.assetUrl,
    });

    setStatus("loading");
    setProgress(APP_CONFIG.place.loading.initialProgress);
    setCurrentPlace({
      id: pkg.slug,
      slug: pkg.slug,
      name: pkg.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      lat: 0,
      lng: 0,
      city: "",
      country: "",
    });
    setMode("place");

    const timer = setTimeout(() => {
      setProgress(APP_CONFIG.place.loading.completedProgress);
      setStatus("ready");
      logger.info("Place scene ready", {
        slug,
      });
    }, APP_CONFIG.place.loading.readyDelayMs);

    return () => clearTimeout(timer);
  }, [
    bootstrap.assetUrl,
    bootstrap.geometryId,
    mapping.bindings.length,
    pkg,
    setStatus,
    setProgress,
    setCurrentPlace,
    setMode,
    slug,
  ]);

  if (!pkg) {
    return null;
  }

  const ambientIntensity = isNight
    ? APP_CONFIG.scene.light.night.ambientIntensity
    : APP_CONFIG.scene.light.day.ambientIntensity;
  const ambientColor = isNight ? APP_CONFIG.scene.light.night.ambientColor : pkg.ambientColor;
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

      <StaticEnvironment pkg={pkg} />

      <PedestrianSystem />
      <VehicleSystem pkg={pkg} />

      {weather === "rain" ? <RainEffect /> : null}

      <CameraController pkg={pkg} />
    </>
  );
}

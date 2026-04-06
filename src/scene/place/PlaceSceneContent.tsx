"use client";

import { useMemo } from "react";
import { usePlaceStore } from "../../stores/placeStore";
import { useAppStore } from "../../stores/appStore";
import { usePlaybackStore } from "../../stores/playbackStore";
import { APP_CONFIG } from "../../shared/config";
import StaticEnvironment from "./StaticEnvironment";
import CameraController from "./CameraController";
import PlaybackSystem from "./PlaybackSystem";
import RainEffect from "./RainEffect";
import PedestrianSystem from "./PedestrianSystem";
import VehicleSystem from "./VehicleSystem";
import { useSceneLiveData } from "./useSceneLiveData";
import { usePlaceBootstrap } from "./usePlaceBootstrap";

type PlaceSceneContentProps = {
  slug: string;
};

export default function PlaceSceneContent({ slug }: PlaceSceneContentProps) {
  const setStatus = usePlaceStore((s) => s.setStatus);
  const setProgress = usePlaceStore((s) => s.setProgress);
  const setCurrentPlace = usePlaceStore((s) => s.setCurrentPlace);
  const setMode = useAppStore((s) => s.setMode);
  const setWeather = usePlaybackStore((s) => s.setWeather);
  const setPedestrianLevel = usePlaybackStore((s) => s.setPedestrianLevel);
  const setVehicleLevel = usePlaybackStore((s) => s.setVehicleLevel);
  const currentTime = usePlaybackStore((s) => s.currentTime);
  const weather = usePlaybackStore((s) => s.weather);
  const currentPedestrianLevel = usePlaybackStore((s) => s.pedestrianLevel);
  const currentVehicleLevel = usePlaybackStore((s) => s.vehicleLevel);
  const isNight = usePlaybackStore((s) => s.isNight());

  const { scenePkg, sceneBootstrap, sceneMapping } = usePlaceBootstrap({
    slug,
    setStatus,
    setProgress,
    setCurrentPlace,
    setMode,
  });

  const normalizedHour = useMemo(() => {
    const raw = Math.floor(currentTime);
    return ((raw % 24) + 24) % 24;
  }, [currentTime]);

  useSceneLiveData({
    slug,
    bootstrap: sceneBootstrap,
    normalizedHour,
    currentWeather: weather,
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

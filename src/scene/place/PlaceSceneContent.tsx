"use client";

import { useEffect } from "react";
import { usePlaceStore } from "../../stores/placeStore";
import { useAppStore } from "../../stores/appStore";
import { usePlaybackStore } from "../../stores/playbackStore";
import { selectIsNight } from "../../stores/selectors/playbackSelectors";
import { APP_CONFIG } from "../../shared/config";
import { normalizeHour } from "../../shared/domains";
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
  const isNight = usePlaybackStore(selectIsNight);

  const { data, isLoading, isError } = usePlaceBootstrap(slug);

  useEffect(() => {
    if (isLoading) {
      setStatus("loading");
      setProgress(APP_CONFIG.place.loading.initialProgress);
    } else if (isError) {
      setStatus("error");
    } else if (data) {
      setCurrentPlace(data.placeMeta);
      setMode("place");

      const readyTimer = setTimeout(() => {
        setProgress(APP_CONFIG.place.loading.completedProgress);
        setStatus("ready");
      }, APP_CONFIG.place.loading.readyDelayMs);

      return () => clearTimeout(readyTimer);
    }
  }, [data, isLoading, isError, setCurrentPlace, setMode, setProgress, setStatus]);

  const normalizedHour = normalizeHour(Math.floor(currentTime));

  const { data: liveData } = useSceneLiveData({
    slug,
    bootstrap: data?.bootstrap ?? null,
    normalizedHour,
    currentPedestrianLevel,
  });

  useEffect(() => {
    if (liveData) {
      if (liveData.weather.condition !== weather) {
        setWeather(liveData.weather.condition);
      }
      if (liveData.places.pedestrianDensity !== currentPedestrianLevel) {
        setPedestrianLevel(liveData.places.pedestrianDensity);
      }
      if (liveData.places.vehicleDensity !== currentVehicleLevel) {
        setVehicleLevel(liveData.places.vehicleDensity);
      }
    }
  }, [
    liveData,
    weather,
    currentPedestrianLevel,
    currentVehicleLevel,
    setWeather,
    setPedestrianLevel,
    setVehicleLevel,
  ]);

  if (!data) {
    return null;
  }

  const { pkg: scenePkg, bootstrap: sceneBootstrap, mapping: sceneMapping } = data;

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

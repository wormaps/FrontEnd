"use client";

import { useMemo } from "react";
import { usePlaybackStore } from "../../stores/playbackStore";
import { APP_CONFIG } from "../../shared/config";
import { normalizeHour } from "../../shared/domains";
import StaticEnvironment from "./StaticEnvironment";
import CameraController from "./CameraController";
import PlaybackSystem from "./PlaybackSystem";
import RainEffect from "./RainEffect";
import PedestrianSystem from "./PedestrianSystem";
import VehicleSystem from "./VehicleSystem";
import { usePlaceSceneBootstrap } from "./usePlaceSceneBootstrap";
import { useSceneLighting } from "./useSceneLighting";

type PlaceSceneContentProps = {
  slug: string;
};

export default function PlaceSceneContent({ slug }: PlaceSceneContentProps) {
  const currentTime = usePlaybackStore((s) => s.currentTime);
  const isNight = usePlaybackStore((s) => s.isNight());
  const weather = usePlaybackStore((s) => s.weather);

  const normalizedHour = useMemo(() => {
    return normalizeHour(Math.floor(currentTime));
  }, [currentTime]);

  const { scenePkg, sceneBootstrap, sceneMapping } = usePlaceSceneBootstrap({
    slug,
    normalizedHour,
  });

  if (!scenePkg) {
    return null;
  }

  const sceneLighting = useSceneLighting({
    scenePkg,
    isNight,
  });

  return (
    <>
      <ambientLight
        intensity={sceneLighting.ambientIntensity}
        color={sceneLighting.ambientColor}
      />
      <directionalLight
        position={APP_CONFIG.scene.light.directionalPosition}
        intensity={sceneLighting.directionalIntensity}
        color={sceneLighting.directionalColor}
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

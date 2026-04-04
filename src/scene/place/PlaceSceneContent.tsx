"use client";

import { useEffect } from "react";
import { usePlaceStore } from "../../stores/placeStore";
import { PLACE_PACKAGES } from "../../data/placePackages";
import { usePlaybackStore } from "../../stores/playbackStore";
import StaticEnvironment from "./StaticEnvironment";
import CameraController from "./CameraController";
import PlaybackHUD from "../../components/hud/PlaybackHUD";

type PlaceSceneContentProps = {
  slug: string;
};

export default function PlaceSceneContent({ slug }: PlaceSceneContentProps) {
  const pkg = PLACE_PACKAGES[slug];
  const setStatus = usePlaceStore((s) => s.setStatus);
  const setProgress = usePlaceStore((s) => s.setProgress);
  const isNight = usePlaybackStore((s) => s.isNight());

  useEffect(() => {
    if (!pkg) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    setProgress(10);

    const timer = setTimeout(() => {
      setProgress(100);
      setStatus("ready");
    }, 600);

    return () => clearTimeout(timer);
  }, [pkg, setStatus, setProgress]);

  if (!pkg) {
    return null;
  }

  const ambientIntensity = isNight ? 0.3 : 1.0;
  const ambientColor = pkg.ambientColor;
  const directionalIntensity = isNight ? 0.1 : 1.2;

  return (
    <>
      <ambientLight intensity={ambientIntensity} color={ambientColor} />
      <directionalLight
        position={[50, 80, 30]}
        intensity={directionalIntensity}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      <StaticEnvironment pkg={pkg} />

      <CameraController pkg={pkg} />

      <PlaybackHUD />
    </>
  );
}

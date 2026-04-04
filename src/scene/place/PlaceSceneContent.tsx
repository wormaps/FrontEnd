"use client";

import { useEffect } from "react";
import { usePlaceStore } from "../../stores/placeStore";
import { useAppStore } from "../../stores/appStore";
import { PLACE_PACKAGES } from "../../data/placePackages";
import { usePlaybackStore } from "../../stores/playbackStore";
import StaticEnvironment from "./StaticEnvironment";
import CameraController from "./CameraController";
import PlaybackSystem from "./PlaybackSystem";
import RainEffect from "./RainEffect";

type PlaceSceneContentProps = {
  slug: string;
};

export default function PlaceSceneContent({ slug }: PlaceSceneContentProps) {
  const pkg = PLACE_PACKAGES[slug];
  const setStatus = usePlaceStore((s) => s.setStatus);
  const setProgress = usePlaceStore((s) => s.setProgress);
  const setCurrentPlace = usePlaceStore((s) => s.setCurrentPlace);
  const setMode = useAppStore((s) => s.setMode);
  const isNight = usePlaybackStore((s) => s.isNight());
  const weather = usePlaybackStore((s) => s.weather);

  useEffect(() => {
    if (!pkg) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    setProgress(10);
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
      setProgress(100);
      setStatus("ready");
    }, 600);

    return () => clearTimeout(timer);
  }, [pkg, setStatus, setProgress, setCurrentPlace, setMode]);

  if (!pkg) {
    return null;
  }

  const ambientIntensity = isNight ? 0.28 : 1.0;
  const ambientColor = isNight ? "#9ba4ff" : pkg.ambientColor;
  const directionalIntensity = isNight ? 0.12 : 1.25;
  const directionalColor = isNight ? "#9db5ff" : "#ffffff";

  return (
    <>
      <ambientLight intensity={ambientIntensity} color={ambientColor} />
      <directionalLight
        position={[50, 80, 30]}
        intensity={directionalIntensity}
        color={directionalColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      <PlaybackSystem />

      <StaticEnvironment pkg={pkg} />

      {weather === "rain" ? <RainEffect /> : null}

      <CameraController pkg={pkg} />
    </>
  );
}

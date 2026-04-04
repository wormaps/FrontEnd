"use client";

import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import { Suspense } from "react";
import { usePlaceStore } from "../../stores/placeStore";
import PlaceSceneContent from "./PlaceSceneContent";
import PlaybackHUD from "../../components/hud/PlaybackHUD";
import { usePlaybackStore } from "../../stores/playbackStore";

type PlaceSceneProps = {
  slug: string;
};

export default function PlaceScene({ slug }: PlaceSceneProps) {
  const setStatus = usePlaceStore((s) => s.setStatus);
  const isNight = usePlaybackStore((s) => s.isNight());

  const backgroundClass = useMemo(() => {
    return isNight ? "bg-[#03040a]" : "bg-[#7fc5ff]";
  }, [isNight]);

  return (
    <div className={`relative h-screen w-full overflow-hidden transition-colors duration-700 ${backgroundClass}`}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 80], fov: 60 }}
        onCreated={({ gl }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          setStatus("ready");
        }}
      >
        <Suspense fallback={null}>
          <PlaceSceneContent slug={slug} />
        </Suspense>
      </Canvas>
      <PlaybackHUD />
    </div>
  );
}

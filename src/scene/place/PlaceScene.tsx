"use client";

import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import { Suspense } from "react";
import { usePlaceStore } from "../../stores/placeStore";
import PlaceSceneContent from "./PlaceSceneContent";
import PlaybackHUD from "../../components/hud/PlaybackHUD";
import SceneInfoHUD from "../../components/hud/SceneInfoHUD";
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
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-transparent via-transparent to-black/25" />
      <Canvas
        dpr={[1, 2]}
        frameloop="always"
        gl={{ antialias: true, powerPreference: "high-performance" }}
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
      <SceneInfoHUD />
      <PlaybackHUD />
    </div>
  );
}

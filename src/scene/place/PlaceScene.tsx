"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { usePlaceStore } from "../../stores/placeStore";
import PlaceSceneContent from "./PlaceSceneContent";

type PlaceSceneProps = {
  slug: string;
};

export default function PlaceScene({ slug }: PlaceSceneProps) {
  const setStatus = usePlaceStore((s) => s.setStatus);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
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
    </div>
  );
}

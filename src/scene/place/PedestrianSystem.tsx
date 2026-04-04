"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePlaybackStore } from "../../stores/playbackStore";

const MAX_PEDESTRIANS = 20;
const AREA = 44;

type Walker = {
  x: number;
  z: number;
  dir: number;
  speed: number;
  hue: number;
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function countByLevel(level: "low" | "medium" | "high") {
  if (level === "low") return 10;
  if (level === "high") return 20;
  return 15;
}

export default function PedestrianSystem() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const tempObj = useMemo(() => new THREE.Object3D(), []);

  const isPlaying = usePlaybackStore((s) => s.isPlaying);
  const speedScale = usePlaybackStore((s) => s.speed);
  const level = usePlaybackStore((s) => s.pedestrianLevel);

  const walkersRef = useRef<Walker[]>(
    Array.from({ length: MAX_PEDESTRIANS }, () => ({
      x: rand(-AREA, AREA),
      z: rand(-AREA, AREA),
      dir: rand(0, Math.PI * 2),
      speed: rand(1.2, 2.1),
      hue: rand(0.15, 0.95),
    })),
  );

  useFrame((_state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const activeCount = countByLevel(level);
    const walkers = walkersRef.current;

    for (let i = 0; i < MAX_PEDESTRIANS; i += 1) {
      const w = walkers[i];

      if (i < activeCount && isPlaying) {
        const dt = delta * speedScale;

        w.dir += rand(-0.8, 0.8) * dt * 0.5;
        w.x += Math.cos(w.dir) * w.speed * dt;
        w.z += Math.sin(w.dir) * w.speed * dt;

        if (w.x > AREA || w.x < -AREA) {
          w.dir = Math.PI - w.dir;
          w.x = THREE.MathUtils.clamp(w.x, -AREA, AREA);
        }

        if (w.z > AREA || w.z < -AREA) {
          w.dir = -w.dir;
          w.z = THREE.MathUtils.clamp(w.z, -AREA, AREA);
        }
      }

      if (i < activeCount) {
        tempObj.position.set(w.x, 0.9, w.z);
        tempObj.rotation.set(0, w.dir, 0);
        tempObj.scale.setScalar(1);
      } else {
        tempObj.position.set(9999, 9999, 9999);
        tempObj.rotation.set(0, 0, 0);
        tempObj.scale.setScalar(0.0001);
      }

      tempObj.updateMatrix();
      mesh.setMatrixAt(i, tempObj.matrix);
    }

    mesh.count = activeCount;
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, MAX_PEDESTRIANS]} castShadow>
      <capsuleGeometry args={[0.23, 0.7, 4, 8]} />
      <meshStandardMaterial color="#a8d9ff" roughness={0.7} metalness={0.05} />
    </instancedMesh>
  );
}

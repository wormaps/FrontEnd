"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePlaybackStore } from "../../stores/playbackStore";
import type { PlacePackage } from "../../data/placePackages";

const MAX_VEHICLES = 8;

type Vehicle = {
  t: number;
  laneOffset: number;
  speed: number;
  roadIndex: number;
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function countByLevel(level: "low" | "medium" | "high") {
  if (level === "low") return 4;
  if (level === "high") return 8;
  return 6;
}

type VehicleSystemProps = {
  pkg: PlacePackage;
};

export default function VehicleSystem({ pkg }: VehicleSystemProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const tempObj = useMemo(() => new THREE.Object3D(), []);

  const isPlaying = usePlaybackStore((s) => s.isPlaying);
  const speedScale = usePlaybackStore((s) => s.speed);
  const level = usePlaybackStore((s) => s.vehicleLevel);

  const vehiclesRef = useRef<Vehicle[]>(
    Array.from({ length: MAX_VEHICLES }, (_, i) => ({
      t: rand(0, 1),
      laneOffset: rand(-0.8, 0.8),
      speed: rand(0.04, 0.09),
      roadIndex: i % Math.max(1, pkg.roads.length),
    })),
  );

  useFrame((_state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const activeCount = countByLevel(level);
    const vehicles = vehiclesRef.current;

    for (let i = 0; i < MAX_VEHICLES; i += 1) {
      const v = vehicles[i];

      if (i >= activeCount) {
        tempObj.position.set(9999, 9999, 9999);
        tempObj.rotation.set(0, 0, 0);
        tempObj.scale.setScalar(0.0001);
        tempObj.updateMatrix();
        mesh.setMatrixAt(i, tempObj.matrix);
        continue;
      }

      const road = pkg.roads[v.roadIndex % pkg.roads.length];
      const sx = road.start[0];
      const sz = road.start[1];
      const ex = road.end[0];
      const ez = road.end[1];

      if (isPlaying) {
        v.t = (v.t + v.speed * delta * speedScale) % 1;
      }

      const x = THREE.MathUtils.lerp(sx, ex, v.t);
      const z = THREE.MathUtils.lerp(sz, ez, v.t);

      const dx = ex - sx;
      const dz = ez - sz;
      const angle = Math.atan2(dz, dx);

      const ox = Math.cos(angle + Math.PI / 2) * v.laneOffset;
      const oz = Math.sin(angle + Math.PI / 2) * v.laneOffset;

      tempObj.position.set(x + ox, 0.42, z + oz);
      tempObj.rotation.set(0, -angle + Math.PI / 2, 0);
      tempObj.scale.setScalar(1);
      tempObj.updateMatrix();
      mesh.setMatrixAt(i, tempObj.matrix);
    }

    mesh.count = activeCount;
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, MAX_VEHICLES]} castShadow receiveShadow>
      <boxGeometry args={[1.9, 0.8, 3.8]} />
      <meshStandardMaterial color="#ffcb67" metalness={0.2} roughness={0.55} />
    </instancedMesh>
  );
}

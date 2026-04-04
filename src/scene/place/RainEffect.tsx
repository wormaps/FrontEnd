"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const DROP_COUNT = 700;
const SPAWN_RADIUS = 70;
const MIN_Y = 2;
const MAX_Y = 70;
const FALL_SPEED = 22;

type DropState = {
  x: number;
  y: number;
  z: number;
  speed: number;
};

function randomInRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export default function RainEffect() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const tempObj = useMemo(() => new THREE.Object3D(), []);

  const initialDrops = useMemo<DropState[]>(() => {
    const arr: DropState[] = [];
    for (let i = 0; i < DROP_COUNT; i += 1) {
      arr.push({
        x: randomInRange(-SPAWN_RADIUS, SPAWN_RADIUS),
        y: randomInRange(MIN_Y, MAX_Y),
        z: randomInRange(-SPAWN_RADIUS, SPAWN_RADIUS),
        speed: randomInRange(FALL_SPEED * 0.7, FALL_SPEED * 1.3),
      });
    }
    return arr;
  }, []);

  const dropsRef = useRef<DropState[]>(initialDrops);

  useFrame((_state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) {
      return;
    }

    const drops = dropsRef.current;

    for (let i = 0; i < DROP_COUNT; i += 1) {
      const drop = drops[i];
      drop.y -= drop.speed * delta;

      if (drop.y < MIN_Y) {
        drop.y = MAX_Y;
        drop.x = randomInRange(-SPAWN_RADIUS, SPAWN_RADIUS);
        drop.z = randomInRange(-SPAWN_RADIUS, SPAWN_RADIUS);
      }

      tempObj.position.set(drop.x, drop.y, drop.z);
      tempObj.rotation.set(0, 0, 0.1);
      tempObj.updateMatrix();
      mesh.setMatrixAt(i, tempObj.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, DROP_COUNT]}>
      <boxGeometry args={[0.045, 0.9, 0.045]} />
      <meshStandardMaterial
        color="#9dd8ff"
        emissive="#9dd8ff"
        emissiveIntensity={0.22}
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

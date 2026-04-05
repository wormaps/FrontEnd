"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { usePlaybackStore } from "../../stores/playbackStore";
import type { PlacePackage, BuildingConfig, RoadConfig } from "../../data/placePackages";

type StaticEnvironmentFallbackProps = {
  pkg: PlacePackage;
};

function Ground({ pkg }: { pkg: PlacePackage }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
      <planeGeometry args={[200, 200]} />
      <meshStandardMaterial color={pkg.groundColor} />
    </mesh>
  );
}

function Building({ config }: { config: BuildingConfig }) {
  const isNight = usePlaybackStore((s) => s.isNight());
  const baseColor = config.color;

  return (
    <mesh
      position={config.position}
      castShadow
      receiveShadow
    >
      <boxGeometry args={config.size} />
      <meshStandardMaterial
        color={baseColor}
        emissive={isNight ? "#1a1a3a" : "#000000"}
        emissiveIntensity={isNight ? 0.08 : 0}
      />
    </mesh>
  );
}

function Road({ config }: { config: RoadConfig }) {
  const start = new THREE.Vector3(config.start[0], 0.01, config.start[1]);
  const end = new THREE.Vector3(config.end[0], 0.01, config.end[1]);
  const length = start.distanceTo(end);
  const midpoint = start.clone().add(end).multiplyScalar(0.5);
  const angle = Math.atan2(end.z - start.z, end.x - start.x);

  return (
    <mesh position={midpoint} rotation={[0, -angle + Math.PI / 2, 0]} receiveShadow>
      <planeGeometry args={[config.width, length]} />
      <meshStandardMaterial color={config.color} roughness={0.9} />
    </mesh>
  );
}

function NeonSigns({ pkg }: { pkg: PlacePackage }) {
  const isNight = usePlaybackStore((s) => s.isNight());
  if (!isNight) return null;

  return (
    <>
      {pkg.buildings.slice(0, 4).map((b, i) => (
        <mesh
          key={`neon-${b.id}`}
          position={[b.position[0] + b.size[0] / 2, b.position[2] + 1, b.position[1] + b.size[1] / 2]}
        >
          <boxGeometry args={[0.1, 1.5, b.size[1] * 0.6]} />
          <meshStandardMaterial
            color={["#ff6ec7", "#00f5ff", "#ff4e00", "#7b2dff"][i]}
            emissive={["#ff6ec7", "#00f5ff", "#ff4e00", "#7b2dff"][i]}
            emissiveIntensity={1.5}
          />
        </mesh>
      ))}
    </>
  );
}

export default function StaticEnvironmentFallback({ pkg }: StaticEnvironmentFallbackProps) {
  const buildingNodes = useMemo(
    () =>
      pkg.buildings.map((b) => (
        <Building key={b.id} config={b} />
      )),
    [pkg.buildings],
  );

  const roadNodes = useMemo(
    () =>
      pkg.roads.map((r) => (
        <Road key={r.id} config={r} />
      )),
    [pkg.roads],
  );

  return (
    <group>
      <Ground pkg={pkg} />
      {buildingNodes}
      {roadNodes}
      <NeonSigns pkg={pkg} />
    </group>
  );
}

"use client";

import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { usePlaybackStore } from "../../stores/playbackStore";
import type { GeometryLiveMapping } from "../../shared/contracts";

type SceneAssetModelProps = {
  assetUrl: string;
  mapping: GeometryLiveMapping | null;
};

function applyNightOverlay(scene: THREE.Object3D, isNight: boolean, mapping: GeometryLiveMapping | null) {
  const emissiveStrength = isNight ? 0.12 : 0;
  const highlightedNodes = new Set(mapping?.bindings.map((binding) => binding.nodeId));

  scene.traverse((node) => {
    if (!(node instanceof THREE.Mesh)) {
      return;
    }

    const candidate = node;

    const hasMapping = highlightedNodes.has(candidate.name);
    const materials = Array.isArray(candidate.material) ? candidate.material : [candidate.material];

    for (const material of materials) {
      if (!(material instanceof THREE.MeshStandardMaterial)) {
        continue;
      }

      if (isNight) {
        material.emissive.set(hasMapping ? "#23234a" : "#121223");
      } else {
        material.emissive.set("#000000");
      }

      material.emissiveIntensity = isNight
        ? hasMapping
          ? emissiveStrength * 1.6
          : emissiveStrength
        : 0;
    }
  });
}

type LoadedSceneAssetModelProps = {
  assetUrl: string;
  mapping: GeometryLiveMapping | null;
};

function LoadedSceneAssetModel({ assetUrl, mapping }: LoadedSceneAssetModelProps) {
  const isNight = usePlaybackStore((state) => state.isNight());
  const gltf = useGLTF(assetUrl);

  const scene = useMemo(() => {
    const clonedScene = gltf.scene.clone(true);
    applyNightOverlay(clonedScene, isNight, mapping);
    return clonedScene;
  }, [gltf.scene, isNight, mapping]);

  useEffect(() => {
    return () => {
      useGLTF.clear(assetUrl);
      scene.traverse((node) => {
        if (!(node instanceof THREE.Mesh)) {
          return;
        }

        node.geometry?.dispose();
        const materials = Array.isArray(node.material) ? node.material : [node.material];

        for (const material of materials) {
          if (material instanceof THREE.Material) {
            if (material instanceof THREE.MeshStandardMaterial) {
              material.map?.dispose();
              material.normalMap?.dispose();
              material.roughnessMap?.dispose();
              material.metalnessMap?.dispose();
              material.emissiveMap?.dispose();
              material.aoMap?.dispose();
            }
            material.dispose();
          }
        }
      });
    };
  }, [assetUrl, scene]);

  return <primitive object={scene} dispose={null} />;
}

export default function SceneAssetModel({ assetUrl, mapping }: SceneAssetModelProps) {
  if (assetUrl.length === 0) {
    return null;
  }

  return <LoadedSceneAssetModel assetUrl={assetUrl} mapping={mapping} />;
}

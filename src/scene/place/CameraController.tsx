"use client";

import { useRef, useEffect, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePlaceStore } from "../../stores/placeStore";
import type { PlacePackage } from "../../data/placePackages";

type CameraControllerProps = {
  pkg: PlacePackage;
};

type PlaceStoreState = {
  viewMode: "top" | "walk";
  setViewMode: (m: "top" | "walk") => void;
};

const WASD_SPEED = 0.25;
const WALK_HEIGHT = 1.7;
const TOP_HEIGHT = 80;
const TOP_X = 0;
const TOP_Y = 0;
const TOP_Z = TOP_HEIGHT;

export default function CameraController({ pkg }: CameraControllerProps) {
  const { camera } = useThree();
  const viewMode = usePlaceStore((s) => (s as PlaceStoreState).viewMode);
  const setViewMode = usePlaceStore((s) => (s as PlaceStoreState).setViewMode);
  const keys = useRef<Set<string>>(new Set());
  const isWalking = useRef(false);
  const targetPosition = useRef(new THREE.Vector3(TOP_X, TOP_Y, TOP_Z));

  const switchToTop = useCallback(() => {
    targetPosition.current.set(TOP_X, TOP_Y, TOP_Z);
    camera.position.set(TOP_X, TOP_Y, TOP_Z);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  const switchToWalk = useCallback(() => {
    const [wx, wy, wz] = pkg.walkStartPosition;
    targetPosition.current.set(wx, wy, wz);
    camera.position.set(wx, wy, wz);
    camera.lookAt(0, 1, 0);
  }, [camera, pkg.walkStartPosition]);

  useEffect(() => {
    if (viewMode === "top") {
      switchToTop();
      isWalking.current = false;
    } else {
      switchToWalk();
      isWalking.current = true;
    }
  }, [viewMode, switchToTop, switchToWalk]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keys.current.add(e.key.toLowerCase());
      if (e.key === "v" || e.key === "V") {
        setViewMode(viewMode === "top" ? "walk" : "top");
      }
      if (e.key === "Escape" && viewMode === "walk") {
        setViewMode("top");
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys.current.delete(e.key.toLowerCase());
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [viewMode, setViewMode]);

  useFrame(() => {
    if (!isWalking.current) return;

    const k = keys.current;
    const speed = WASD_SPEED;
    const direction = new THREE.Vector3();

    if (k.has("w")) direction.z -= speed;
    if (k.has("s")) direction.z += speed;
    if (k.has("a")) direction.x -= speed;
    if (k.has("d")) direction.x += speed;

    if (direction.lengthSq() > 0) {
      direction.normalize().multiplyScalar(speed);
      camera.translateX(-direction.x);
      camera.translateZ(direction.z);
      camera.position.set(
        camera.position.x,
        THREE.MathUtils.lerp(camera.position.y, WALK_HEIGHT, 0.15),
        camera.position.z,
      );
    }
  });

  return null;
}

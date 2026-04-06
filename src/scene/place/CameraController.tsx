"use client";

import { useRef, useEffect, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePlaceStore } from "../../stores/placeStore";
import type { InputPreset } from "../../stores/placeStore";
import type { PlacePackage } from "../../data/placePackages";
import { APP_CONFIG } from "../../shared/config";
import {
  applyLookQuaternion as applyCameraLookQuaternion,
  applyWalkMovementFrame,
  computeCameraBounds,
  type CameraBounds,
} from "./cameraMath";
import { useCameraModeTransitions } from "./useCameraModeTransitions";
import { useCameraInputHandlers } from "./useCameraInputHandlers";

type CameraControllerProps = {
  pkg: PlacePackage;
};

type PlaceStoreState = {
  viewMode: "top" | "walk";
  inputPreset: InputPreset;
  setViewMode: (m: "top" | "walk") => void;
};

const CAMERA_CONFIG = APP_CONFIG.scene.camera;
const PRESET_CONFIG: Record<InputPreset, { moveSpeed: number; verticalSpeed: number; lookSensitivity: number }> =
  CAMERA_CONFIG.inputPreset;
const CAMERA_KEYBIND = CAMERA_CONFIG.keybind;

export default function CameraController({ pkg }: CameraControllerProps) {
  const { camera } = useThree();
  const viewMode = usePlaceStore((s) => (s as PlaceStoreState).viewMode);
  const inputPreset = usePlaceStore((s) => (s as PlaceStoreState).inputPreset);
  const setViewMode = usePlaceStore((s) => (s as PlaceStoreState).setViewMode);

  const keysRef = useRef<Set<string>>(new Set());
  const isWalkingRef = useRef(false);
  const isMouseDraggingRef = useRef(false);
  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const touchPrevRef = useRef<{ x: number; y: number } | null>(null);
  const moveInputRef = useRef(new THREE.Vector3());
  const forwardRef = useRef(new THREE.Vector3());
  const rightRef = useRef(new THREE.Vector3());
  const zoomForwardRef = useRef(new THREE.Vector3());
  const pinchScalePrevRef = useRef<number | null>(null);

  const boundsRef = useRef<CameraBounds>({
    min: -CAMERA_CONFIG.boundsFallbackMaxAbs,
    max: CAMERA_CONFIG.boundsFallbackMaxAbs,
  });

  const applyLookQuaternion = useCallback(() => {
    applyCameraLookQuaternion(camera, yawRef.current, pitchRef.current);
  }, [camera]);

  const applyLookDelta = useCallback(
    (deltaX: number, deltaY: number, multiplier = 1) => {
      const lookSensitivity = PRESET_CONFIG[inputPreset].lookSensitivity * multiplier;
      yawRef.current -= deltaX * lookSensitivity;
      pitchRef.current -= deltaY * lookSensitivity;
      pitchRef.current = THREE.MathUtils.clamp(
        pitchRef.current,
        -CAMERA_CONFIG.maxPitchRadians,
        CAMERA_CONFIG.maxPitchRadians,
      );
      applyLookQuaternion();
    },
    [applyLookQuaternion, inputPreset],
  );

  const switchToTop = useCallback(() => {
    const [topX, topY, topZ] = CAMERA_CONFIG.topViewPosition;
    camera.position.set(topX, topY, topZ);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  const switchToWalk = useCallback(() => {
    const [wx, wy, wz] = pkg.walkStartPosition;
    camera.position.set(wx, wy, wz);
    yawRef.current = 0;
    pitchRef.current = 0;
    applyLookQuaternion();
  }, [camera, pkg.walkStartPosition, applyLookQuaternion]);

  useEffect(() => {
    boundsRef.current = computeCameraBounds(pkg, CAMERA_CONFIG);
  }, [pkg]);

  useCameraModeTransitions({
    viewMode,
    switchToTop,
    switchToWalk,
    isWalkingRef,
  });

  useCameraInputHandlers({
    viewMode,
    inputPreset,
    setViewMode,
    camera,
    cameraConfig: CAMERA_CONFIG,
    cameraKeybind: CAMERA_KEYBIND,
    boundsRef,
    keysRef,
    isMouseDraggingRef,
    touchPrevRef,
    pinchScalePrevRef,
    zoomForwardRef,
    applyLookDelta,
  });

  useFrame((_state, delta) => {
    if (!isWalkingRef.current) {
      return;
    }

    const keys = keysRef.current;
    const config = PRESET_CONFIG[inputPreset];

    applyWalkMovementFrame({
      camera,
      keys,
      inputConfig: config,
      keybind: CAMERA_KEYBIND,
      cameraConfig: CAMERA_CONFIG,
      bounds: boundsRef.current,
      delta,
      moveInput: moveInputRef.current,
      forward: forwardRef.current,
      right: rightRef.current,
    });
  });

  return null;
}

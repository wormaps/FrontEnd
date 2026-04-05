"use client";

import { useRef, useEffect, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePlaceStore } from "../../stores/placeStore";
import type { InputPreset } from "../../stores/placeStore";
import type { PlacePackage } from "../../data/placePackages";
import { APP_CONFIG } from "../../shared/config";

type CameraControllerProps = {
  pkg: PlacePackage;
};

type CameraBounds = {
  min: number;
  max: number;
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

  const boundsRef = useRef<CameraBounds>({
    min: -CAMERA_CONFIG.boundsFallbackMaxAbs,
    max: CAMERA_CONFIG.boundsFallbackMaxAbs,
  });

  const applyLookQuaternion = useCallback(() => {
    const qYaw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yawRef.current);
    const qPitch = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), pitchRef.current);
    camera.quaternion.copy(qYaw).multiply(qPitch);
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
    const maxAbs = Math.max(
      ...pkg.roads.flatMap((r) => [Math.abs(r.start[0]), Math.abs(r.start[1]), Math.abs(r.end[0]), Math.abs(r.end[1])]),
      CAMERA_CONFIG.boundsFallbackMaxAbs,
    );
    boundsRef.current = {
      min: -maxAbs - CAMERA_CONFIG.boundsPadding,
      max: maxAbs + CAMERA_CONFIG.boundsPadding,
    };
  }, [pkg]);

  useEffect(() => {
    if (viewMode === "top") {
      switchToTop();
      isWalkingRef.current = false;
    } else {
      switchToWalk();
      isWalkingRef.current = true;
    }
  }, [viewMode, switchToTop, switchToWalk]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysRef.current.add(key);

      if (key === CAMERA_KEYBIND.toggleView) {
        setViewMode(viewMode === "top" ? "walk" : "top");
      }

      if (key === CAMERA_KEYBIND.exitWalk && viewMode === "walk") {
        setViewMode("top");
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    const onMouseDown = (e: MouseEvent) => {
      if (viewMode !== "walk") return;
      if (e.button !== 0) return;
      isMouseDraggingRef.current = true;
    };

    const onMouseUp = () => {
      isMouseDraggingRef.current = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (viewMode !== "walk") return;
      if (!isMouseDraggingRef.current) return;
      applyLookDelta(e.movementX, e.movementY);
    };

    const onWheel = (e: WheelEvent) => {
      if (viewMode !== "walk") return;
      if (!e.ctrlKey && !e.metaKey) {
        return;
      }

      e.preventDefault();
      applyLookDelta(
        e.deltaX,
        e.deltaY,
        CAMERA_CONFIG.gesture.wheelLookMultiplier,
      );
    };

    const onTouchStart = (e: TouchEvent) => {
      if (viewMode !== "walk") return;
      const touch = e.touches[0];
      if (!touch) return;
      touchPrevRef.current = {
        x: touch.clientX,
        y: touch.clientY,
      };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (viewMode !== "walk") return;
      const touch = e.touches[0];
      if (!touch) return;
      const previous = touchPrevRef.current;
      if (!previous) {
        touchPrevRef.current = {
          x: touch.clientX,
          y: touch.clientY,
        };
        return;
      }

      const deltaX = touch.clientX - previous.x;
      const deltaY = touch.clientY - previous.y;

      touchPrevRef.current = {
        x: touch.clientX,
        y: touch.clientY,
      };

      applyLookDelta(
        deltaX,
        deltaY,
        CAMERA_CONFIG.gesture.touchLookMultiplier,
      );
    };

    const onTouchEnd = () => {
      touchPrevRef.current = null;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [viewMode, inputPreset, setViewMode, applyLookDelta]);

  useFrame((_state, delta) => {
    if (!isWalkingRef.current) {
      return;
    }

    const keys = keysRef.current;
    const config = PRESET_CONFIG[inputPreset];
    const moveDistance = config.moveSpeed * delta;
    const verticalDistance = config.verticalSpeed * delta;

    const moveInput = moveInputRef.current;
    moveInput.set(
      Number(keys.has(CAMERA_KEYBIND.moveRight)) - Number(keys.has(CAMERA_KEYBIND.moveLeft)),
      0,
      Number(keys.has(CAMERA_KEYBIND.moveBackward)) - Number(keys.has(CAMERA_KEYBIND.moveForward)),
    );

    if (moveInput.lengthSq() > 0) {
      moveInput.normalize().multiplyScalar(moveDistance);

      const forward = forwardRef.current;
      forward.set(0, 0, -1).applyQuaternion(camera.quaternion);
      forward.y = 0;
      forward.normalize();

      const right = rightRef.current;
      right.set(1, 0, 0).applyQuaternion(camera.quaternion);
      right.y = 0;
      right.normalize();

      camera.position.addScaledVector(right, moveInput.x);
      camera.position.addScaledVector(forward, -moveInput.z);
    }

    let nextY = camera.position.y;

    if (keys.has(CAMERA_KEYBIND.moveUp)) {
      nextY += verticalDistance;
    }

    if (keys.has(CAMERA_KEYBIND.moveDown)) {
      nextY -= verticalDistance;
    }

    const { min, max } = boundsRef.current;
    camera.position.set(
      THREE.MathUtils.clamp(camera.position.x, min, max),
      THREE.MathUtils.clamp(
        nextY,
        CAMERA_CONFIG.walkHeight + CAMERA_CONFIG.walkVerticalClampOffset.min,
        CAMERA_CONFIG.walkHeight + CAMERA_CONFIG.walkVerticalClampOffset.max,
      ),
      THREE.MathUtils.clamp(camera.position.z, min, max),
    );
  });

  return null;
}

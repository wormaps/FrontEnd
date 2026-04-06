import { useEffect, type RefObject } from "react";
import type * as THREE from "three";
import type { InputPreset } from "../../stores/placeStore";
import type { CameraConfig, CameraBounds, CameraKeybind } from "./cameraMath";
import { applyTopViewZoom, applyWalkForwardZoom } from "./cameraMath";

type GestureEventWithScale = Event & {
  scale?: number;
};

type UseCameraInputHandlersInput = {
  viewMode: "top" | "walk";
  inputPreset: InputPreset;
  setViewMode: (m: "top" | "walk") => void;
  camera: THREE.Camera;
  cameraConfig: CameraConfig;
  cameraKeybind: CameraKeybind;
  boundsRef: RefObject<CameraBounds>;
  keysRef: RefObject<Set<string>>;
  isMouseDraggingRef: RefObject<boolean>;
  touchPrevRef: RefObject<{ x: number; y: number } | null>;
  pinchScalePrevRef: RefObject<number | null>;
  zoomForwardRef: RefObject<THREE.Vector3>;
  applyLookDelta: (deltaX: number, deltaY: number, multiplier?: number) => void;
};

export function useCameraInputHandlers(input: UseCameraInputHandlersInput) {
  const {
    viewMode,
    inputPreset,
    setViewMode,
    camera,
    cameraConfig,
    cameraKeybind,
    boundsRef,
    keysRef,
    isMouseDraggingRef,
    touchPrevRef,
    pinchScalePrevRef,
    zoomForwardRef,
    applyLookDelta,
  } = input;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysRef.current.add(key);

      if (key === cameraKeybind.toggleView) {
        setViewMode(viewMode === "top" ? "walk" : "top");
      }

      if (key === cameraKeybind.exitWalk && viewMode === "walk") {
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
      if (viewMode === "top") {
        e.preventDefault();
        applyTopViewZoom({
          camera,
          cameraConfig,
          deltaY: e.deltaY,
        });
        return;
      }

      if (viewMode !== "walk") return;

      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      const dominantRatio = cameraConfig.gesture.wheelDominantAxisRatio;

      const isHorizontalLook = absX > absY * dominantRatio;
      const isPinchLikeZoom = e.ctrlKey || e.metaKey;
      const isVerticalZoom = absY > absX * dominantRatio && !isPinchLikeZoom;

      if (!isHorizontalLook && !isPinchLikeZoom && !isVerticalZoom) {
        return;
      }

      e.preventDefault();

      if (isPinchLikeZoom) {
        applyWalkForwardZoom({
          camera,
          bounds: boundsRef.current,
          delta: e.deltaY,
          multiplier: cameraConfig.gesture.pinchZoomMultiplier,
          zoomForward: zoomForwardRef.current,
        });
        return;
      }

      if (isVerticalZoom) {
        applyWalkForwardZoom({
          camera,
          bounds: boundsRef.current,
          delta: e.deltaY,
          multiplier: cameraConfig.gesture.wheelZoomMultiplier,
          zoomForward: zoomForwardRef.current,
        });
        return;
      }

      applyLookDelta(e.deltaX, 0, cameraConfig.gesture.wheelLookMultiplier);
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

      applyLookDelta(deltaX, deltaY, cameraConfig.gesture.touchLookMultiplier);
    };

    const onTouchEnd = () => {
      touchPrevRef.current = null;
    };

    const onGestureStart = (event: Event) => {
      const e = event as GestureEventWithScale;
      if (viewMode !== "walk" && viewMode !== "top") return;
      if (typeof e.scale !== "number") return;

      pinchScalePrevRef.current = e.scale;
      event.preventDefault();
    };

    const onGestureChange = (event: Event) => {
      const e = event as GestureEventWithScale;
      if (viewMode !== "walk" && viewMode !== "top") return;
      if (typeof e.scale !== "number") return;

      const previousScale = pinchScalePrevRef.current;
      if (previousScale === null) {
        pinchScalePrevRef.current = e.scale;
        return;
      }

      const deltaScale = e.scale - previousScale;
      pinchScalePrevRef.current = e.scale;

      if (Math.abs(deltaScale) < 0.001) {
        return;
      }

      event.preventDefault();

      if (viewMode === "top") {
        applyTopViewZoom({
          camera,
          cameraConfig,
          deltaY: -deltaScale,
          multiplier: cameraConfig.gesture.pinchGestureZoomMultiplier,
        });
        return;
      }

      applyWalkForwardZoom({
        camera,
        bounds: boundsRef.current,
        delta: -deltaScale,
        multiplier: cameraConfig.gesture.pinchGestureZoomMultiplier,
        zoomForward: zoomForwardRef.current,
      });
    };

    const onGestureEnd = () => {
      pinchScalePrevRef.current = null;
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
    window.addEventListener("gesturestart", onGestureStart as EventListener, { passive: false });
    window.addEventListener("gesturechange", onGestureChange as EventListener, { passive: false });
    window.addEventListener("gestureend", onGestureEnd as EventListener);

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
      window.removeEventListener("gesturestart", onGestureStart as EventListener);
      window.removeEventListener("gesturechange", onGestureChange as EventListener);
      window.removeEventListener("gestureend", onGestureEnd as EventListener);
    };
  }, [
    applyLookDelta,
    boundsRef,
    camera,
    cameraConfig,
    cameraKeybind,
    inputPreset,
    isMouseDraggingRef,
    keysRef,
    pinchScalePrevRef,
    setViewMode,
    touchPrevRef,
    viewMode,
    zoomForwardRef,
  ]);
}

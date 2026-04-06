"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { APP_CONFIG } from "../../shared/config";
import { usePerformanceStore } from "../../stores/performanceStore";

export default function PerformanceSystem() {
  const setSnapshot = usePerformanceStore((s) => s.setSnapshot);
  const elapsedMsRef = useRef(0);
  const framesRef = useRef(0);

  useFrame((_state, delta) => {
    const deltaMs = delta * 1000;

    elapsedMsRef.current += deltaMs;
    framesRef.current += 1;

    if (elapsedMsRef.current < APP_CONFIG.scene.performance.sampleIntervalMs) {
      return;
    }

    const fps = Math.round((framesRef.current * 1000) / elapsedMsRef.current);
    const frameTimeMs = elapsedMsRef.current / framesRef.current;

    setSnapshot({
      fps,
      frameTimeMs,
      sampledAt: Date.now(),
    });

    elapsedMsRef.current = 0;
    framesRef.current = 0;
  });

  return null;
}

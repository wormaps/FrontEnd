"use client";

import { useFrame } from "@react-three/fiber";
import { usePlaybackStore } from "../../stores/playbackStore";

const BASE_HOURS_PER_SECOND = 0.1;

export default function PlaybackSystem() {
  const isPlaying = usePlaybackStore((s) => s.isPlaying);
  const speed = usePlaybackStore((s) => s.speed);
  const advanceTime = usePlaybackStore((s) => s.advanceTime);

  useFrame((_state, delta) => {
    if (!isPlaying) {
      return;
    }

    const deltaHours = delta * BASE_HOURS_PER_SECOND * speed;
    advanceTime(deltaHours);
  });

  return null;
}

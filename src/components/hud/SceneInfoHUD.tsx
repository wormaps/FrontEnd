"use client";

import { useMemo } from "react";
import { usePlaceStore } from "../../stores/placeStore";
import { usePlaybackStore } from "../../stores/playbackStore";

function formatTime(hour: number) {
  const normalized = ((hour % 24) + 24) % 24;
  const h = Math.floor(normalized);
  const m = Math.floor((normalized - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export default function SceneInfoHUD() {
  const currentPlace = usePlaceStore((s) => s.currentPlace);
  const viewMode = usePlaceStore((s) => s.viewMode);
  const weather = usePlaybackStore((s) => s.weather);
  const currentTime = usePlaybackStore((s) => s.currentTime);
  const speed = usePlaybackStore((s) => s.speed);
  const isPlaying = usePlaybackStore((s) => s.isPlaying);

  const placeLabel = useMemo(() => {
    if (!currentPlace) return "Unknown Place";
    return currentPlace.name;
  }, [currentPlace]);

  return (
    <div className="pointer-events-none absolute left-4 top-4 z-20 rounded-xl border border-white/10 bg-black/55 px-4 py-3 text-white backdrop-blur-sm">
      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cyan-300">WorMap · Place MVP</p>
      <h2 className="mt-1 text-base font-semibold">{placeLabel}</h2>
      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-zinc-300">
        <span>Mode: {viewMode === "top" ? "Top" : "Walk"}</span>
        <span>Weather: {weather}</span>
        <span>Time: {formatTime(currentTime)}</span>
        <span>Playback: {isPlaying ? `${speed}x` : "Paused"}</span>
      </div>
    </div>
  );
}

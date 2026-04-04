"use client";

import { usePlaybackStore } from "../../stores/playbackStore";
import { usePlaceStore } from "../../stores/placeStore";
import type { InputPreset } from "../../stores/placeStore";

const SPEED_OPTIONS = [1, 2, 4];
const WEATHER_OPTIONS = ["clear", "cloudy", "rain"] as const;
const INPUT_PRESET_OPTIONS: InputPreset[] = ["precision", "balanced", "fast"];

function formatTime(hour: number) {
  const normalized = ((hour % 24) + 24) % 24;
  const h = Math.floor(normalized);
  const m = Math.floor((normalized - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export default function PlaybackHUD() {
  const { isPlaying, speed, weather, currentTime, setIsPlaying, setSpeed, setWeather, setCurrentTime } =
    usePlaybackStore();
  const viewMode = usePlaceStore((s) => s.viewMode);
  const inputPreset = usePlaceStore((s) => s.inputPreset);
  const setViewMode = usePlaceStore((s) => s.setViewMode);
  const setInputPreset = usePlaceStore((s) => s.setInputPreset);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-3 pb-8">
      <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-white/10 bg-black/60 px-5 py-3 text-white backdrop-blur-md">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-bold transition hover:bg-white/20"
        >
          {isPlaying ? "⏸" : "▶"}
        </button>

        <div className="flex items-center gap-1">
          {SPEED_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`rounded px-2.5 py-1 text-xs font-medium transition ${
                speed === s ? "bg-cyan-500 text-black" : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {s}×
            </button>
          ))}
        </div>

        <div className="h-5 w-px bg-white/20" />

        <div className="flex items-center gap-1">
          {WEATHER_OPTIONS.map((w) => (
            <button
              key={w}
              onClick={() => setWeather(w)}
              className={`rounded px-2.5 py-1 text-xs font-medium capitalize transition ${
                weather === w ? "bg-cyan-500 text-black" : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {w}
            </button>
          ))}
        </div>

        <div className="h-5 w-px bg-white/20" />

        <div className="flex items-center gap-2 rounded bg-white/10 px-2 py-1 text-xs">
          <span className="text-zinc-300">Time</span>
          <span className="font-semibold text-cyan-300 tabular-nums">{formatTime(currentTime)}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentTime(currentTime - 1)}
            className="rounded px-2 py-1 text-xs font-medium bg-white/10 hover:bg-white/20 transition"
          >
            -1h
          </button>
          <button
            onClick={() => setCurrentTime(currentTime + 1)}
            className="rounded px-2 py-1 text-xs font-medium bg-white/10 hover:bg-white/20 transition"
          >
            +1h
          </button>
        </div>

        <div className="h-5 w-px bg-white/20" />

        <button
          onClick={() => setViewMode(viewMode === "top" ? "walk" : "top")}
          className={`rounded px-3 py-1 text-xs font-medium capitalize transition ${
            viewMode === "top" ? "bg-white/10 hover:bg-white/20" : "bg-cyan-500 text-black"
          }`}
        >
          {viewMode === "top" ? "탑뷰" : "워크뷰"}
        </button>

        <div className="h-5 w-px bg-white/20" />

        <div className="flex items-center gap-1">
          {INPUT_PRESET_OPTIONS.map((preset) => (
            <button
              key={preset}
              onClick={() => setInputPreset(preset)}
              className={`rounded px-2.5 py-1 text-xs font-medium capitalize transition ${
                inputPreset === preset ? "bg-cyan-500 text-black" : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {viewMode === "walk" && (
        <p className="rounded-lg bg-black/50 px-3 py-1.5 text-xs text-zinc-300 backdrop-blur-sm">
          WASD 이동 · E 상승 / R 하강 · 마우스 좌클릭 드래그로 시야 회전 · V 탑뷰 전환 · ESC 복귀 · precision/balanced/fast 감도
        </p>
      )}
    </div>
  );
}

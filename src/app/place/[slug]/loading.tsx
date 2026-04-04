"use client";

import { useEffect, useState } from "react";
import { usePlaceStore } from "../../../stores/placeStore";

export default function PlaceLoading() {
  const currentPlace = usePlaceStore((s) => s.currentPlace);
  const progress = usePlaceStore((s) => s.progress);
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const placeName = currentPlace
    ? currentPlace.name
    : "장소를 찾는 중";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-zinc-950 px-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-cyan-400">
          WorMap · Loading
        </p>
        <h1 className="text-2xl font-semibold text-zinc-100">
          {placeName}
        </h1>
      </div>

      <div className="flex w-64 flex-col gap-2">
        <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-cyan-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-center text-xs text-zinc-400">
          씬 준비 중{dots} ({progress}%)
        </p>
      </div>

      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </main>
  );
}

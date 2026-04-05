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
    <main className="surface-loading-base flex min-h-screen flex-col items-center justify-center gap-8 px-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-accent-strong text-xs font-medium uppercase tracking-[0.22em]">
          WorMap · Loading
        </p>
        <h1 className="text-foreground-soft text-2xl font-semibold">
          {placeName}
        </h1>
      </div>

      <div className="flex w-64 flex-col gap-2">
        <div className="surface-loading-track h-1 w-full overflow-hidden rounded-full">
          <div
            className="surface-loading-progress h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-muted-strong text-center text-xs">
          씬 준비 중{dots} ({progress}%)
        </p>
      </div>

      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="status-dot-active animate-pulse"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </main>
  );
}

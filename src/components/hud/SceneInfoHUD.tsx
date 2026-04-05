import { useMemo } from "react";
import { MapPin, Wind, Thermometer, Info } from "lucide-react";
import { usePlaceStore } from "../../stores/placeStore";
import { usePlaybackStore } from "../../stores/playbackStore";
import { Label } from "../ui/Label";
import { Panel } from "../ui/Panel";
import { StatusBadge } from "../ui/StatusBadge";

function formatTime(hour: number) {
  const normalized = ((hour % 24) + 24) % 24;
  const h = Math.floor(normalized);
  const m = Math.floor((normalized - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function toWeatherLabel(weather: "clear" | "cloudy" | "rain" | "snow"): string {
  if (weather === "clear") {
    return "Clear";
  }

  if (weather === "cloudy") {
    return "Cloudy";
  }

  if (weather === "rain") {
    return "Rain";
  }

  return "Snow";
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

  const statusLabel = isPlaying ? `Running · ${speed}x` : "Paused";
  const statusTone = isPlaying ? "active" : "paused";

  return (
    <div className="pointer-events-none absolute left-6 top-6 z-20 flex flex-col gap-3">
      <Panel className="px-5 py-4 w-64 animate-in fade-in slide-in-from-left-4 duration-700">
        <div className="flex items-center gap-2 mb-3">
          <div className="surface-accent text-accent-strong flex h-6 w-6 items-center justify-center rounded-lg">
            <MapPin size={14} />
          </div>
          <p className="text-accent-primary text-[10px] font-bold uppercase tracking-[0.18em] opacity-80">WorMap Live Scene</p>
        </div>
        
        <h2 className="text-foreground-strong text-xl font-bold tracking-tight">{placeLabel}</h2>
        <p className="text-muted-strong mt-1 text-xs font-medium">{currentPlace?.city || "Discovery Mode"}</p>

        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between text-[11px]">
            <Label className="tracking-wider" tone="muted" size="xs">
              Status
            </Label>
            <StatusBadge tone={statusTone} pulse={isPlaying}>
              {statusLabel}
            </StatusBadge>
          </div>

          <div className="divider-soft" />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label className="tracking-wider" tone="muted" size="xs">
                Environment
              </Label>
              <div className="text-foreground-strong flex items-center gap-1.5 text-xs font-bold capitalize">
                <Wind size={12} className="text-muted-strong" />
                {toWeatherLabel(weather)}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="tracking-wider" tone="muted" size="xs">
                Local Time
              </Label>
              <div className="text-foreground-strong flex items-center gap-1.5 text-xs font-bold">
                <Thermometer size={12} className="text-muted-strong" />
                {formatTime(currentTime)}
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <Panel className="px-4 py-2 flex items-center gap-2.5 animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
        <Info size={14} className="text-accent-strong" />
        <p className="text-[10px] font-bold uppercase tracking-tight text-zinc-300">
          Camera: <span className="text-foreground-strong">{viewMode === "walk" ? "Street" : "Overview"}</span>
        </p>
      </Panel>
    </div>
  );
}

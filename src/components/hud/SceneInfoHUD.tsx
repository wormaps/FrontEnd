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

  const statusLabel = isPlaying ? `Active ${speed}x` : "Paused";
  const statusTone = isPlaying ? "active" : "paused";

  return (
    <div className="pointer-events-none absolute left-6 top-6 z-20 flex flex-col gap-3">
      <Panel className="px-5 py-4 w-64 animate-in fade-in slide-in-from-left-4 duration-700">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
            <MapPin size={14} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300/80">WorMap Simulation</p>
        </div>
        
        <h2 className="text-xl font-bold text-white tracking-tight">{placeLabel}</h2>
        <p className="text-xs text-zinc-400 mt-1 font-medium">{currentPlace?.city || "Discovery Mode"}</p>

        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between text-[11px]">
            <Label className="tracking-wider" tone="muted" size="xs">
              Status
            </Label>
            <StatusBadge tone={statusTone} pulse={isPlaying}>
              {statusLabel}
            </StatusBadge>
          </div>

          <div className="h-px bg-white/5" />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label className="tracking-wider" tone="muted" size="xs">
                Environment
              </Label>
              <div className="flex items-center gap-1.5 text-xs text-zinc-200 font-bold capitalize">
                <Wind size={12} className="text-zinc-400" />
                {weather}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="tracking-wider" tone="muted" size="xs">
                Local Time
              </Label>
              <div className="flex items-center gap-1.5 text-xs text-zinc-200 font-bold">
                <Thermometer size={12} className="text-zinc-400" />
                {formatTime(currentTime)}
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <Panel className="px-4 py-2 flex items-center gap-2.5 animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
        <Info size={14} className="text-cyan-400" />
        <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-tight">
          Mode: <span className="text-white">{viewMode} View</span>
        </p>
      </Panel>
    </div>
  );
}

import { 
  Play, 
  Pause, 
  Cloud, 
  CloudRain, 
  Sun, 
  Clock, 
  Navigation, 
  Move,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { usePlaybackStore } from "../../stores/playbackStore";
import { usePlaceStore } from "../../stores/placeStore";
import type { InputPreset } from "../../stores/placeStore";
import { ControlButton } from "../ui/ControlButton";
import { Panel } from "../ui/Panel";

const SPEED_OPTIONS = [1, 2, 4];
const WEATHER_OPTIONS = [
  { value: "clear", icon: Sun, label: "Clear" },
  { value: "cloudy", icon: Cloud, label: "Cloudy" },
  { value: "rain", icon: CloudRain, label: "Rain" },
] as const;
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
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-4 pb-10">
      <Panel className="pointer-events-auto flex items-center gap-4 px-6 py-4">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`glass-button h-11 w-11 ${isPlaying ? "bg-white/20" : "surface-accent text-accent-primary"}`}
            title={isPlaying ? "일시정지" : "재생"}
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-0.5" fill="currentColor" />}
          </button>

          <div className="flex items-center gap-1.5 ml-1">
            {SPEED_OPTIONS.map((s) => (
              <ControlButton
                key={s}
                onClick={() => setSpeed(s)}
                size="chip"
                tone={speed === s ? "active" : "default"}
              >
                {s}×
              </ControlButton>
            ))}
          </div>
        </div>

        <div className="divider-vertical" />

        {/* Weather Controls */}
        <div className="flex items-center gap-1.5">
          {WEATHER_OPTIONS.map(({ value, icon: Icon, label }) => (
            <ControlButton
              key={value}
              onClick={() => setWeather(value)}
              size="icon-md"
              tone={weather === value ? "active" : "default"}
              title={label}
            >
              <Icon size={16} />
            </ControlButton>
          ))}
        </div>

        <div className="divider-vertical" />

        {/* Time Controls */}
        <div className="flex items-center gap-3">
          <div className="surface-muted flex items-center gap-2 rounded-xl px-3 py-1.5">
            <Clock size={14} className="text-muted-strong" />
            <span className="text-accent-primary text-sm font-bold tabular-nums tracking-wider">
              {formatTime(currentTime)}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <ControlButton
              onClick={() => setCurrentTime(currentTime - 1)}
              size="icon-sm"
              title="-1시간"
            >
              <ChevronLeft size={16} />
            </ControlButton>
            <ControlButton
              onClick={() => setCurrentTime(currentTime + 1)}
              size="icon-sm"
              title="+1시간"
            >
              <ChevronRight size={16} />
            </ControlButton>
          </div>
        </div>

        <div className="divider-vertical" />

        {/* View Mode Toggle */}
        <button
          onClick={() => setViewMode(viewMode === "top" ? "walk" : "top")}
          className={`glass-button h-10 px-4 gap-2 text-xs font-bold ${
            viewMode === "walk" ? "glass-button-active" : ""
          }`}
        >
          {viewMode === "top" ? <Navigation size={14} /> : <Move size={14} />}
          {viewMode === "top" ? "Overview" : "Street"}
        </button>

        <div className="divider-vertical" />

        {/* Sensitivity / Input Presets */}
        <div className="flex items-center gap-1.5">
          {INPUT_PRESET_OPTIONS.map((preset) => (
            <ControlButton
              key={preset}
              onClick={() => setInputPreset(preset)}
              className="px-2.5 text-[10px] tracking-tighter"
              size="chip"
              tone={inputPreset === preset ? "active" : "default"}
            >
              {preset}
            </ControlButton>
          ))}
        </div>
      </Panel>

      {viewMode === "walk" && (
        <Panel className="animate-in fade-in slide-in-from-bottom-2 duration-500 px-4 py-2">
          <p className="text-[11px] font-medium tracking-tight text-zinc-300">
            <span className="text-accent-strong font-bold">WASD</span> move · <span className="text-accent-strong font-bold">E / R</span> up/down · <span className="text-accent-strong font-bold">Drag</span> look · <span className="text-accent-strong font-bold">⌘/Ctrl + Trackpad</span> look · <span className="text-accent-strong font-bold">V</span> toggle view · <span className="text-accent-strong font-bold">ESC</span> back
          </p>
        </Panel>
      )}
    </div>
  );
}

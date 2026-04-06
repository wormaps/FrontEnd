import {
  Play,
  Pause,
  Cloud,
  CloudRain,
  Snowflake,
  Sun,
  Clock,
  Navigation,
  Move,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ControlButton } from "../ui/ControlButton";
import type { InputPreset } from "../../stores/placeStore";

const SPEED_OPTIONS = [1, 2, 4];
const WEATHER_OPTIONS = [
  { value: "clear", icon: Sun, label: "Clear" },
  { value: "cloudy", icon: Cloud, label: "Cloudy" },
  { value: "rain", icon: CloudRain, label: "Rain" },
  { value: "snow", icon: Snowflake, label: "Snow" },
] as const;
const INPUT_PRESET_OPTIONS: InputPreset[] = ["precision", "balanced", "fast"];

function formatTime(hour: number) {
  const normalized = ((hour % 24) + 24) % 24;
  const h = Math.floor(normalized);
  const m = Math.floor((normalized - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

type PlaybackControlSectionProps = {
  isPlaying: boolean;
  speed: number;
  onTogglePlayback: () => void;
  onSetSpeed: (speed: number) => void;
};

export function PlaybackControlSection(props: PlaybackControlSectionProps) {
  const { isPlaying, speed, onTogglePlayback, onSetSpeed } = props;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onTogglePlayback}
        className={`glass-button h-11 w-11 ${isPlaying ? "bg-white/20" : "surface-accent text-accent-primary"}`}
        title={isPlaying ? "일시정지" : "재생"}
      >
        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-0.5" fill="currentColor" />}
      </button>

      <div className="ml-1 flex items-center gap-1.5">
        {SPEED_OPTIONS.map((itemSpeed) => (
          <ControlButton
            key={itemSpeed}
            onClick={() => onSetSpeed(itemSpeed)}
            size="chip"
            tone={speed === itemSpeed ? "active" : "default"}
          >
            {itemSpeed}×
          </ControlButton>
        ))}
      </div>
    </div>
  );
}

type WeatherControlSectionProps = {
  weather: "clear" | "cloudy" | "rain" | "snow";
  onSetWeather: (weather: "clear" | "cloudy" | "rain" | "snow") => void;
};

export function WeatherControlSection(props: WeatherControlSectionProps) {
  const { weather, onSetWeather } = props;

  return (
    <div className="flex items-center gap-1.5">
      {WEATHER_OPTIONS.map(({ value, icon: Icon, label }) => (
        <ControlButton
          key={value}
          onClick={() => onSetWeather(value)}
          size="icon-md"
          tone={weather === value ? "active" : "default"}
          title={label}
        >
          <Icon size={16} />
        </ControlButton>
      ))}
    </div>
  );
}

type TimeControlSectionProps = {
  currentTime: number;
  onSetCurrentTime: (time: number) => void;
};

export function TimeControlSection(props: TimeControlSectionProps) {
  const { currentTime, onSetCurrentTime } = props;

  return (
    <div className="flex items-center gap-3">
      <div className="surface-muted flex items-center gap-2 rounded-xl px-3 py-1.5">
        <Clock size={14} className="text-muted-strong" />
        <span className="text-accent-primary text-sm font-bold tabular-nums tracking-wider">
          {formatTime(currentTime)}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <ControlButton onClick={() => onSetCurrentTime(currentTime - 1)} size="icon-sm" title="-1시간">
          <ChevronLeft size={16} />
        </ControlButton>
        <ControlButton onClick={() => onSetCurrentTime(currentTime + 1)} size="icon-sm" title="+1시간">
          <ChevronRight size={16} />
        </ControlButton>
      </div>
    </div>
  );
}

type ViewModeToggleSectionProps = {
  viewMode: "top" | "walk";
  onToggleViewMode: () => void;
};

export function ViewModeToggleSection(props: ViewModeToggleSectionProps) {
  const { viewMode, onToggleViewMode } = props;

  return (
    <button
      onClick={onToggleViewMode}
      className={`glass-button h-10 gap-2 px-4 text-xs font-bold ${viewMode === "walk" ? "glass-button-active" : ""}`}
    >
      {viewMode === "top" ? <Navigation size={14} /> : <Move size={14} />}
      {viewMode === "top" ? "Overview" : "Street"}
    </button>
  );
}

type InputPresetSectionProps = {
  inputPreset: InputPreset;
  onSetInputPreset: (preset: InputPreset) => void;
};

export function InputPresetSection(props: InputPresetSectionProps) {
  const { inputPreset, onSetInputPreset } = props;

  return (
    <div className="flex items-center gap-1.5">
      {INPUT_PRESET_OPTIONS.map((preset) => (
        <ControlButton
          key={preset}
          onClick={() => onSetInputPreset(preset)}
          className="px-2.5 text-[10px] tracking-tighter"
          size="chip"
          tone={inputPreset === preset ? "active" : "default"}
        >
          {preset}
        </ControlButton>
      ))}
    </div>
  );
}

export function WalkModeHint() {
  return (
    <p className="text-[11px] font-medium tracking-tight text-zinc-300">
      <span className="text-accent-strong font-bold">WASD</span> move · <span className="text-accent-strong font-bold">Two-finger ↑↓</span> zoom · <span className="text-accent-strong font-bold">Two-finger ↔</span> look · <span className="text-accent-strong font-bold">Spread / Pinch</span> zoom · <span className="text-accent-strong font-bold">Drag</span> look · <span className="text-accent-strong font-bold">V</span> toggle view · <span className="text-accent-strong font-bold">ESC</span> back
    </p>
  );
}

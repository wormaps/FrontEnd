import {
  Play, Pause, Cloud, CloudRain, Snowflake, Sun,
  Clock, Navigation, Move, ChevronLeft, ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/src/shared/utils/cn";
import { ControlButton } from "@/src/components/ui/ControlButton";
import type { InputPreset } from "@/src/stores/placeStore";
import { useTranslation } from "@/src/stores/useI18nStore";
import { formatTime } from "@/src/shared/domains";
import type { WeatherMode } from "@/src/stores/playbackStore";

const SPEED_OPTIONS = [1, 2, 4] as const;
const WEATHER_OPTIONS: { value: WeatherMode; icon: LucideIcon }[] = [
  { value: "clear", icon: Sun },
  { value: "cloudy", icon: Cloud },
  { value: "rain", icon: CloudRain },
  { value: "snow", icon: Snowflake },
];
const INPUT_PRESET_OPTIONS: InputPreset[] = ["precision", "balanced", "fast"];

type PlaybackControlSectionProps = {
  isPlaying: boolean;
  speed: number;
  onTogglePlayback: () => void;
  onSetSpeed: (speed: number) => void;
};

export function PlaybackControlSection(props: PlaybackControlSectionProps) {
  const { isPlaying, speed, onTogglePlayback, onSetSpeed } = props;
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onTogglePlayback}
        className={cn(
          'h-11 w-11 flex items-center justify-center rounded-full border transition-colors',
          isPlaying
            ? 'bg-zinc-700/60 border-zinc-600 text-white hover:bg-zinc-600/60'
            : 'surface-accent text-accent-primary border-transparent',
        )}
        title={isPlaying ? t('scene.status.paused') : t('scene.status.running')}
      >
        {isPlaying
          ? <Pause size={20} fill="currentColor" />
          : <Play size={20} className="ml-0.5" fill="currentColor" />
        }
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
  weather: WeatherMode;
  onSetWeather: (weather: WeatherMode) => void;
};

export function WeatherControlSection(props: WeatherControlSectionProps) {
  const { weather, onSetWeather } = props;
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-1.5">
      {WEATHER_OPTIONS.map(({ value, icon: Icon }) => (
        <ControlButton
          key={value}
          onClick={() => onSetWeather(value)}
          size="icon-md"
          tone={weather === value ? "active" : "default"}
          title={t(`scene.weather.${value}`)}
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
        <ControlButton onClick={() => onSetCurrentTime(currentTime - 1)} size="icon-sm" title="-1h">
          <ChevronLeft size={16} />
        </ControlButton>
        <ControlButton onClick={() => onSetCurrentTime(currentTime + 1)} size="icon-sm" title="+1h">
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
  const { t } = useTranslation();

  return (
    <button
      onClick={onToggleViewMode}
      className={cn(
        'h-10 gap-2 px-4 text-xs font-bold flex items-center rounded-xl border transition-colors',
        viewMode === 'walk'
          ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
          : 'surface-muted border-transparent hover:bg-zinc-700/40',
      )}
    >
      {viewMode === "top" ? <Navigation size={14} /> : <Move size={14} />}
      {viewMode === "top" ? t('scene.info.overview') : t('scene.info.street')}
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
      <span className="text-accent-strong font-bold">WASD</span> move ·{" "}
      <span className="text-accent-strong font-bold">Two-finger ↑↓</span> zoom ·{" "}
      <span className="text-accent-strong font-bold">Two-finger ↔</span> look ·{" "}
      <span className="text-accent-strong font-bold">Spread / Pinch</span> zoom ·{" "}
      <span className="text-accent-strong font-bold">Drag</span> look ·{" "}
      <span className="text-accent-strong font-bold">V</span> toggle view ·{" "}
      <span className="text-accent-strong font-bold">ESC</span> back
    </p>
  );
}

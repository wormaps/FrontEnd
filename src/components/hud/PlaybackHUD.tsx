import { 
  Play, 
  Pause, 
  FastForward, 
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
import { normalizeHour } from "../../shared/domains";

const SPEED_OPTIONS = [1, 2, 4];
const WEATHER_OPTIONS = [
  { value: "clear", icon: Sun },
  { value: "cloudy", icon: Cloud },
  { value: "rain", icon: CloudRain },
] as const;
const INPUT_PRESET_OPTIONS: InputPreset[] = ["precision", "balanced", "fast"];

function formatTime(hour: number) {
  const normalized = normalizeHour(hour);
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
      <div className="pointer-events-auto flex items-center gap-4 glass-panel px-6 py-4">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`glass-button h-11 w-11 ${isPlaying ? "bg-white/20" : "bg-cyan-500/20 text-cyan-300"}`}
            title={isPlaying ? "일시정지" : "재생"}
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-0.5" fill="currentColor" />}
          </button>

          <div className="flex items-center gap-1.5 ml-1">
            {SPEED_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`glass-button h-8 px-3 text-[11px] font-bold ${
                  speed === s ? "glass-button-active" : ""
                }`}
              >
                {s}×
              </button>
            ))}
          </div>
        </div>

        <div className="h-6 w-px bg-white/10" />

        {/* Weather Controls */}
        <div className="flex items-center gap-1.5">
          {WEATHER_OPTIONS.map(({ value, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setWeather(value)}
              className={`glass-button h-9 w-9 ${
                weather === value ? "glass-button-active" : ""
              }`}
              title={value}
            >
              <Icon size={16} />
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-white/10" />

        {/* Time Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-1.5">
            <Clock size={14} className="text-zinc-400" />
            <span className="text-sm font-bold text-cyan-300 tabular-nums tracking-wider">
              {formatTime(currentTime)}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentTime(currentTime - 1)}
              className="glass-button h-8 w-8"
              title="-1시간"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentTime(currentTime + 1)}
              className="glass-button h-8 w-8"
              title="+1시간"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="h-6 w-px bg-white/10" />

        {/* View Mode Toggle */}
        <button
          onClick={() => setViewMode(viewMode === "top" ? "walk" : "top")}
          className={`glass-button h-10 px-4 gap-2 text-xs font-bold ${
            viewMode === "walk" ? "glass-button-active" : ""
          }`}
        >
          {viewMode === "top" ? <Navigation size={14} /> : <Move size={14} />}
          {viewMode === "top" ? "TOP VIEW" : "WALK VIEW"}
        </button>

        <div className="h-6 w-px bg-white/10" />

        {/* Sensitivity / Input Presets */}
        <div className="flex items-center gap-1.5">
          {INPUT_PRESET_OPTIONS.map((preset) => (
            <button
              key={preset}
              onClick={() => setInputPreset(preset)}
              className={`glass-button h-8 px-2.5 text-[10px] font-bold uppercase tracking-tighter ${
                inputPreset === preset ? "glass-button-active" : ""
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {viewMode === "walk" && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 glass-panel px-4 py-2">
          <p className="text-[11px] font-medium text-zinc-300 tracking-tight">
            <span className="text-cyan-400 font-bold">WASD</span> 이동 · <span className="text-cyan-400 font-bold">E/R</span> 상승/하강 · <span className="text-cyan-400 font-bold">드래그</span> 회전 · <span className="text-cyan-400 font-bold">V</span> 탑뷰 · <span className="text-cyan-400 font-bold">ESC</span> 복귀
          </p>
        </div>
      )}
    </div>
  );
}

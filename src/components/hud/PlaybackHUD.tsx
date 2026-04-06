import { usePlaybackStore } from "../../stores/playbackStore";
import { usePlaceStore } from "../../stores/placeStore";
import { Panel } from "../ui/Panel";
import {
  InputPresetSection,
  PlaybackControlSection,
  TimeControlSection,
  ViewModeToggleSection,
  WalkModeHint,
  WeatherControlSection,
} from "./playbackSections";

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
        <PlaybackControlSection
          isPlaying={isPlaying}
          speed={speed}
          onTogglePlayback={() => setIsPlaying(!isPlaying)}
          onSetSpeed={setSpeed}
        />

        <div className="divider-vertical" />

        <WeatherControlSection weather={weather} onSetWeather={setWeather} />

        <div className="divider-vertical" />

        <TimeControlSection currentTime={currentTime} onSetCurrentTime={setCurrentTime} />

        <div className="divider-vertical" />

        <ViewModeToggleSection
          viewMode={viewMode}
          onToggleViewMode={() => setViewMode(viewMode === "top" ? "walk" : "top")}
        />

        <div className="divider-vertical" />

        <InputPresetSection inputPreset={inputPreset} onSetInputPreset={setInputPreset} />
      </Panel>

      {viewMode === "walk" && (
        <Panel className="animate-in fade-in slide-in-from-bottom-2 duration-500 px-4 py-2">
          <WalkModeHint />
        </Panel>
      )}
    </div>
  );
}

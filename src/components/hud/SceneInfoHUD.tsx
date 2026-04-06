import { useMemo } from "react";
import { MapPin, Wind, Clock, Info } from "lucide-react";
import { usePlaceStore } from "@/src/stores/placeStore";
import { usePlaybackStore } from "@/src/stores/playbackStore";
import { useTranslation } from "@/src/stores/useI18nStore";
import { formatTime } from "@/src/shared/domains";
import { Label } from "@/src/components/ui/Label";
import { Panel } from "@/src/components/ui/Panel";
import { StatusBadge } from "@/src/components/ui/StatusBadge";

export default function SceneInfoHUD() {
  const { t } = useTranslation();
  const currentPlace = usePlaceStore((s) => s.currentPlace);
  const viewMode = usePlaceStore((s) => s.viewMode);
  const weather = usePlaybackStore((s) => s.weather);
  const currentTime = usePlaybackStore((s) => s.currentTime);
  const speed = usePlaybackStore((s) => s.speed);
  const isPlaying = usePlaybackStore((s) => s.isPlaying);

  const placeLabel = useMemo(
    () => currentPlace?.name ?? t('scene.info.unknown'),
    [currentPlace, t],
  );

  const statusLabel = isPlaying
    ? `${t('scene.status.running')} · ${speed}x`
    : t('scene.status.paused');
  const statusTone = isPlaying ? "active" : "paused";

  return (
    <div className="pointer-events-none absolute left-6 top-6 z-20 flex flex-col gap-3">
      <Panel className="px-5 py-4 w-64 animate-in fade-in slide-in-from-left-4 duration-700">
        <div className="flex items-center gap-2 mb-3">
          <div className="surface-accent text-accent-strong flex h-6 w-6 items-center justify-center rounded-lg">
            <MapPin size={14} />
          </div>
          <p className="text-accent-primary text-[10px] font-bold uppercase tracking-[0.18em] opacity-80">
            {t('scene.info.tag')}
          </p>
        </div>

        <h2 className="text-foreground-strong text-xl font-bold tracking-tight">{placeLabel}</h2>
        <p className="text-muted-strong mt-1 text-xs font-medium">
          {currentPlace?.city ?? t('scene.info.discoveryMode')}
        </p>

        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between text-[11px]">
            <Label className="tracking-wider" tone="muted" size="xs">
              {t('scene.info.status')}
            </Label>
            <StatusBadge tone={statusTone} pulse={isPlaying}>
              {statusLabel}
            </StatusBadge>
          </div>

          <div className="divider-soft" />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label className="tracking-wider" tone="muted" size="xs">
                {t('scene.info.environment')}
              </Label>
              <div className="text-foreground-strong flex items-center gap-1.5 text-xs font-bold capitalize">
                <Wind size={12} className="text-muted-strong" />
                {t(`scene.weather.${weather}`)}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="tracking-wider" tone="muted" size="xs">
                {t('scene.info.localTime')}
              </Label>
              <div className="text-foreground-strong flex items-center gap-1.5 text-xs font-bold">
                <Clock size={12} className="text-muted-strong" />
                {formatTime(currentTime)}
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <Panel className="px-4 py-2 flex items-center gap-2.5 animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
        <Info size={14} className="text-accent-strong" />
        <p className="text-[10px] font-bold uppercase tracking-tight text-zinc-300">
          {t('scene.info.camera')}:{" "}
          <span className="text-foreground-strong">
            {viewMode === "walk" ? t('scene.info.street') : t('scene.info.overview')}
          </span>
        </p>
      </Panel>
    </div>
  );
}

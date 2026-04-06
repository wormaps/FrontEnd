import { APP_CONFIG } from "@/src/shared/config";
import { usePerformanceStore } from "@/src/stores/performanceStore";
import { useTranslation } from "@/src/stores/useI18nStore";
import { Label } from "@/src/components/ui/Label";
import { Panel } from "@/src/components/ui/Panel";
import { StatusBadge } from "@/src/components/ui/StatusBadge";

export default function PerformanceHUD() {
  const { t } = useTranslation();
  const snapshot = usePerformanceStore((s) => s.snapshot);

  const isWarning =
    snapshot.fps < APP_CONFIG.scene.performance.warningFps ||
    snapshot.frameTimeMs > APP_CONFIG.scene.performance.warningFrameTimeMs;

  return (
    <div className="pointer-events-none absolute right-6 top-6 z-20">
      <Panel className="px-4 py-3 w-52 animate-in fade-in slide-in-from-right-4 duration-700 delay-150">
        <div className="flex items-center justify-between">
          <Label tone="muted" size="xs" className="tracking-wider">
            {t('scene.performance.title')}
          </Label>
          <StatusBadge tone={isWarning ? "paused" : "active"} pulse={!isWarning}>
            {isWarning ? t('scene.performance.watch') : t('scene.performance.healthy')}
          </StatusBadge>
        </div>

        <div className="divider-soft my-2" />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label tone="muted" size="xs" className="tracking-wider">
              {t('scene.performance.fps')}
            </Label>
            <p className="text-foreground-strong text-sm font-bold tabular-nums">{snapshot.fps}</p>
          </div>
          <div>
            <Label tone="muted" size="xs" className="tracking-wider">
              {t('scene.performance.frame')}
            </Label>
            <p className="text-foreground-strong text-sm font-bold tabular-nums">
              {snapshot.frameTimeMs.toFixed(1)}ms
            </p>
          </div>
        </div>
      </Panel>
    </div>
  );
}

import { APP_CONFIG } from "../../shared/config";
import { usePerformanceStore } from "../../stores/performanceStore";
import { Label } from "../ui/Label";
import { Panel } from "../ui/Panel";
import { StatusBadge } from "../ui/StatusBadge";

export default function PerformanceHUD() {
  const snapshot = usePerformanceStore((s) => s.snapshot);

  const isWarning =
    snapshot.fps < APP_CONFIG.scene.performance.warningFps ||
    snapshot.frameTimeMs > APP_CONFIG.scene.performance.warningFrameTimeMs;

  const statusLabel = isWarning ? "Watch" : "Healthy";

  return (
    <div className="pointer-events-none absolute right-6 top-6 z-20">
      <Panel className="px-4 py-3 w-48 animate-in fade-in slide-in-from-right-4 duration-700 delay-150">
        <div className="flex items-center justify-between">
          <Label tone="muted" size="xs" className="tracking-wider">
            Performance
          </Label>
          <StatusBadge tone={isWarning ? "paused" : "active"} pulse={!isWarning}>
            {statusLabel}
          </StatusBadge>
        </div>

        <div className="divider-soft my-2" />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label tone="muted" size="xs" className="tracking-wider">
              FPS
            </Label>
            <p className="text-foreground-strong text-sm font-bold tabular-nums">{snapshot.fps}</p>
          </div>
          <div>
            <Label tone="muted" size="xs" className="tracking-wider">
              Frame
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

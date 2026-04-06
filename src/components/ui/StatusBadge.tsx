import type { ReactNode } from "react";
import { cn } from "@/src/shared/utils/cn";

type StatusBadgeTone = "active" | "paused" | "neutral";

type StatusBadgeProps = {
  className?: string;
  tone?: StatusBadgeTone;
  pulse?: boolean;
  children: ReactNode;
};

const dotBaseClass = "status-dot";

const dotToneClasses: Record<StatusBadgeTone, string> = {
  active: "status-dot-success",
  paused: "bg-zinc-500",
  neutral: "status-dot-active",
};

export function StatusBadge({ tone = "neutral", pulse = false, className, children }: StatusBadgeProps) {
  return (
    <span className={cn("text-zinc-200 font-bold flex items-center gap-1.5", className)}>
      <span
        className={cn(
          dotBaseClass,
          dotToneClasses[tone],
          pulse && tone === "active" && "animate-pulse",
        )}
      />
      {children}
    </span>
  );
}

import type { ReactNode } from "react";
import { cn } from "@/src/shared/utils/cn";

type PanelTone = "default" | "subtle";

type PanelProps = {
  className?: string;
  tone?: PanelTone;
  children: ReactNode;
};

const toneClasses: Record<PanelTone, string> = {
  default: "glass-panel",
  subtle: "bg-white/5",
};

export function Panel({ tone = "default", className, children }: PanelProps) {
  return (
    <div className={cn(toneClasses[tone], className)}>
      {children}
    </div>
  );
}

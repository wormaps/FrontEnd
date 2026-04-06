import type { ReactNode } from "react";
import { cn } from "@/src/shared/utils/cn";

type LabelTone = "default" | "muted" | "accent";
type LabelSize = "xs" | "sm";

type LabelProps = {
  className?: string;
  tone?: LabelTone;
  size?: LabelSize;
  children: ReactNode;
};

const toneClasses: Record<LabelTone, string> = {
  default: "text-foreground-strong",
  muted: "text-muted-soft",
  accent: "text-accent-primary",
};

const sizeClasses: Record<LabelSize, string> = {
  xs: "text-[10px]",
  sm: "text-xs",
};

export function Label({ tone = "default", size = "xs", className, children }: LabelProps) {
  return (
    <span className={cn("font-bold uppercase", toneClasses[tone], sizeClasses[size], className)}>
      {children}
    </span>
  );
}

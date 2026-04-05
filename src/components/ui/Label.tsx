import type { ReactNode } from "react";

type LabelTone = "default" | "muted" | "accent";
type LabelSize = "xs" | "sm";

type LabelProps = {
  className?: string;
  tone?: LabelTone;
  size?: LabelSize;
  children: ReactNode;
};

function toToneClass(tone: LabelTone): string {
  if (tone === "muted") {
    return "text-muted-soft";
  }

  if (tone === "accent") {
    return "text-accent-primary";
  }

  return "text-foreground-strong";
}

function toSizeClass(size: LabelSize): string {
  if (size === "sm") {
    return "text-xs";
  }

  return "text-[10px]";
}

export function Label(props: LabelProps) {
  const tone = props.tone ?? "default";
  const size = props.size ?? "xs";

  const baseClass = "font-bold uppercase";
  const className = [baseClass, toToneClass(tone), toSizeClass(size), props.className]
    .filter(Boolean)
    .join(" ");

  return <span className={className}>{props.children}</span>;
}

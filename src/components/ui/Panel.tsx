import type { ReactNode } from "react";

type PanelTone = "default" | "subtle";

type PanelProps = {
  className?: string;
  tone?: PanelTone;
  children: ReactNode;
};

function toPanelToneClass(tone: PanelTone): string {
  if (tone === "subtle") {
    return "bg-white/5";
  }

  return "glass-panel";
}

export function Panel(props: PanelProps) {
  const tone = props.tone ?? "default";
  const toneClass = toPanelToneClass(tone);
  const className = props.className ? `${toneClass} ${props.className}` : toneClass;

  return <div className={className}>{props.children}</div>;
}

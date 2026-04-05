import type { ReactNode } from "react";

type StatusBadgeTone = "active" | "paused" | "neutral";

type StatusBadgeProps = {
  className?: string;
  tone?: StatusBadgeTone;
  pulse?: boolean;
  children: ReactNode;
};

function toDotClass(tone: StatusBadgeTone, pulse: boolean): string {
  const base = "h-1.5 w-1.5 rounded-full";

  if (tone === "active") {
    return pulse ? `${base} bg-green-500 animate-pulse` : `${base} bg-green-500`;
  }

  if (tone === "paused") {
    return `${base} bg-zinc-500`;
  }

  return `${base} bg-cyan-400`;
}

export function StatusBadge(props: StatusBadgeProps) {
  const tone = props.tone ?? "neutral";
  const pulse = props.pulse ?? false;
  const className = ["text-zinc-200 font-bold flex items-center gap-1.5", props.className]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={className}>
      <span className={toDotClass(tone, pulse)} />
      {props.children}
    </span>
  );
}

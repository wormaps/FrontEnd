import type { ButtonHTMLAttributes, ReactNode } from "react";

type ControlButtonTone = "default" | "active";
type ControlButtonSize = "icon-sm" | "icon-md" | "chip";

type ControlButtonProps = {
  className?: string;
  tone?: ControlButtonTone;
  size?: ControlButtonSize;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

function toToneClass(tone: ControlButtonTone): string {
  if (tone === "active") {
    return "glass-button-active";
  }

  return "";
}

function toSizeClass(size: ControlButtonSize): string {
  if (size === "icon-sm") {
    return "h-8 w-8";
  }

  if (size === "icon-md") {
    return "h-9 w-9";
  }

  return "h-8 px-3 text-[11px] font-bold";
}

export function ControlButton(props: ControlButtonProps) {
  const {
    className: userClassName,
    tone = "default",
    size = "icon-md",
    children,
    ...buttonProps
  } = props;

  const className = ["glass-button", toToneClass(tone), toSizeClass(size), userClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <button {...buttonProps} className={className}>
      {children}
    </button>
  );
}

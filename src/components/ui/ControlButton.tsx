import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/src/shared/utils/cn";

type ControlButtonTone = "default" | "active";
type ControlButtonSize = "icon-sm" | "icon-md" | "chip";

type ControlButtonProps = {
  className?: string;
  tone?: ControlButtonTone;
  size?: ControlButtonSize;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const toneClasses: Record<ControlButtonTone, string> = {
  default: "",
  active: "glass-button-active",
};

const sizeClasses: Record<ControlButtonSize, string> = {
  "icon-sm": "h-8 w-8",
  "icon-md": "h-9 w-9",
  chip: "h-8 px-3 text-[11px] font-bold",
};

export function ControlButton(props: ControlButtonProps) {
  const {
    className,
    tone = "default",
    size = "icon-md",
    children,
    ...buttonProps
  } = props;

  return (
    <button
      {...buttonProps}
      className={cn("glass-button", toneClasses[tone], sizeClasses[size], className)}
    >
      {children}
    </button>
  );
}

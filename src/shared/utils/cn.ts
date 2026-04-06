import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind 클래스 충돌을 안전하게 병합하는 유틸리티입니다.
 * clsx로 조건부 클래스를 처리하고, tailwind-merge로 중복 규칙을 제거합니다.
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-blue-500", className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

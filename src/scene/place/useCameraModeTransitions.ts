import { useEffect } from "react";

type UseCameraModeTransitionsInput = {
  viewMode: "top" | "walk";
  switchToTop: () => void;
  switchToWalk: () => void;
  isWalkingRef: { current: boolean };
};

export function useCameraModeTransitions(input: UseCameraModeTransitionsInput) {
  const { viewMode, switchToTop, switchToWalk, isWalkingRef } = input;

  useEffect(() => {
    if (viewMode === "top") {
      switchToTop();
      isWalkingRef.current = false;
      return;
    }

    switchToWalk();
    isWalkingRef.current = true;
  }, [isWalkingRef, switchToTop, switchToWalk, viewMode]);
}

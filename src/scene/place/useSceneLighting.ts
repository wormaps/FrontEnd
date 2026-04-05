import type { PlacePackage } from "../../data/placePackages";
import { APP_CONFIG } from "../../shared/config";

type UseSceneLightingInput = {
  scenePkg: PlacePackage;
  isNight: boolean;
};

type UseSceneLightingOutput = {
  ambientIntensity: number;
  ambientColor: string;
  directionalIntensity: number;
  directionalColor: string;
};

export function useSceneLighting(input: UseSceneLightingInput): UseSceneLightingOutput {
  const { scenePkg, isNight } = input;

  return {
    ambientIntensity: isNight
      ? APP_CONFIG.scene.light.night.ambientIntensity
      : APP_CONFIG.scene.light.day.ambientIntensity,
    ambientColor: isNight ? APP_CONFIG.scene.light.night.ambientColor : scenePkg.ambientColor,
    directionalIntensity: isNight
      ? APP_CONFIG.scene.light.night.directionalIntensity
      : APP_CONFIG.scene.light.day.directionalIntensity,
    directionalColor: isNight
      ? APP_CONFIG.scene.light.night.directionalColor
      : APP_CONFIG.scene.light.day.directionalColor,
  };
}

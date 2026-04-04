export const APP_CONFIG = {
  place: {
    loading: {
      initialProgress: 10,
      completedProgress: 100,
      readyDelayMs: 600,
    },
  },
  scene: {
    light: {
      night: {
        ambientIntensity: 0.28,
        ambientColor: "#9ba4ff",
        directionalIntensity: 0.12,
        directionalColor: "#9db5ff",
      },
      day: {
        ambientIntensity: 1,
        directionalIntensity: 1.25,
        directionalColor: "#ffffff",
      },
      directionalPosition: [50, 80, 30] as const,
      directionalShadowMapSize: [2048, 2048] as const,
    },
  },
  cesium: {
    marker: {
      pixelSize: 12,
      outlineWidth: 2,
      labelFont: "14px sans-serif",
      labelOffset: [0, -24] as const,
      flyHomeDuration: 0,
    },
  },
} as const;

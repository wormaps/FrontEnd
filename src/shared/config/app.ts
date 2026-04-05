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
    camera: {
      walkHeight: 1.7,
      topViewPosition: [0, 0, 80] as const,
      topViewZoomRange: {
        minZ: 32,
        maxZ: 140,
      },
      topViewWheelZoomMultiplier: 0.028,
      maxPitchRadians: Math.PI * 0.46,
      boundsFallbackMaxAbs: 48,
      boundsPadding: 6,
      walkVerticalClampOffset: {
        min: -0.4,
        max: 3.2,
      },
      gesture: {
        wheelLookMultiplier: 0.32,
        touchLookMultiplier: 0.9,
        wheelDominantAxisRatio: 1.2,
        wheelZoomMultiplier: 0.012,
        pinchZoomMultiplier: 0.02,
        pinchGestureZoomMultiplier: 5,
      },
      inputPreset: {
        precision: {
          moveSpeed: 3.8,
          verticalSpeed: 2.4,
          lookSensitivity: 0.0015,
        },
        balanced: {
          moveSpeed: 5.2,
          verticalSpeed: 3.2,
          lookSensitivity: 0.0022,
        },
        fast: {
          moveSpeed: 7.1,
          verticalSpeed: 4.3,
          lookSensitivity: 0.003,
        },
      },
      keybind: {
        toggleView: "v",
        exitWalk: "escape",
        moveLeft: "a",
        moveRight: "d",
        moveForward: "w",
        moveBackward: "s",
        moveUp: "e",
        moveDown: "r",
      },
    },
    performance: {
      sampleIntervalMs: 500,
      warningFps: 45,
      warningFrameTimeMs: 22,
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

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
      pixelSize: 10,
      outlineWidth: 2,
      labelFont: "700 12px 'Inter', system-ui, sans-serif",
      labelOffset: [0, -22] as const,
      labelBackgroundColor: "#16181A",
      labelBackgroundAlpha: 0.85,
      labelBackgroundPadding: [12, 6] as const,
      pointColor: "#3b82f6",
      markerAltitude: 150,
    },
    globe: {
      initialView: {
        lng: 127.0276,
        lat: 37.4979,
        altitude: 15_000_000,
      },
      zoom: {
        factor: 3,
        inertia: 0.85,
        min: 1,
        max: 2.5e7,
      },
      fog: {
        density: 0.0001,
        screenSpaceErrorFactor: 2.0,
      },
      rendering: {
        maximumScreenSpaceError: 1.0,
        shadowMapMaxDistance: 5000.0,
      },
      scaleByDistance: {
        point: [1.5e2, 1.5, 8.0e6, 0.4] as const,
        labelNear: [1.5e2, 1.0, 1.5e7, 0.3] as const,
        labelFar: [1.5e2, 1.0, 1.5e7, 0.2] as const,
      },
    },
  },
} as const;

// Static place package data for MVP.
// In later phases this will be fetched from the backend.

export type PlacePackage = {
  slug: string;
  bounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
  // Camera presets
  topViewPosition: [number, number, number]; // [x, y, z]
  walkStartPosition: [number, number, number]; // [x, y, z]
  // Scene config
  groundColor: string;
  ambientColor: string;
  buildings: BuildingConfig[];
  roads: RoadConfig[];
};

export type BuildingConfig = {
  id: string;
  position: [number, number, number]; // x, y (ground), z (height)
  size: [number, number, number]; // width, depth, height
  color: string;
};

export type RoadConfig = {
  id: string;
  start: [number, number];
  end: [number, number];
  width: number;
  color: string;
};

export const PLACE_PACKAGES: Record<string, PlacePackage> = {
  "shibuya-crossing": {
    slug: "shibuya-crossing",
    bounds: {
      minLat: 35.657,
      maxLat: 35.662,
      minLng: 139.698,
      maxLng: 139.703,
    },
    // Camera will fly to a top-down elevated position
    topViewPosition: [0, 0, 80],
    walkStartPosition: [0, 0, 1.7], // eye height ~1.7m
    groundColor: "#2a2a2a",
    ambientColor: "#ffffff",
    buildings: [
      // Shibuya Station area - simplified block representations
      { id: "b1", position: [-20, -15, 0], size: [12, 8, 40], color: "#4a4a5a" },
      { id: "b2", position: [8, -20, 0], size: [10, 10, 55], color: "#3a3a4a" },
      { id: "b3", position: [22, -10, 0], size: [8, 12, 30], color: "#5a5a6a" },
      { id: "b4", position: [-25, 8, 0], size: [14, 8, 25], color: "#4a4a5a" },
      { id: "b5", position: [5, 12, 0], size: [9, 9, 45], color: "#3a3a4a" },
      { id: "b6", position: [-10, 20, 0], size: [11, 7, 35], color: "#5a5a6a" },
      { id: "b7", position: [18, 18, 0], size: [7, 10, 28], color: "#4a4a5a" },
      // Scramble crossing周边
      { id: "b8", position: [-5, -5, 0], size: [6, 6, 22], color: "#6a6a7a" },
    ],
    roads: [
      // Main crossing roads
      { id: "r1", start: [-40, 0], end: [40, 0], width: 12, color: "#333333" },
      { id: "r2", start: [0, -40], end: [0, 40], width: 12, color: "#333333" },
      // Connecting roads
      { id: "r3", start: [-40, -30], end: [40, -30], width: 8, color: "#2a2a2a" },
      { id: "r4", start: [-40, 30], end: [40, 30], width: 8, color: "#2a2a2a" },
      { id: "r5", start: [-30, -40], end: [-30, 40], width: 8, color: "#2a2a2a" },
      { id: "r6", start: [30, -40], end: [30, 40], width: 8, color: "#2a2a2a" },
    ],
  },

  "times-square": {
    slug: "times-square",
    bounds: {
      minLat: 40.755,
      maxLat: 40.761,
      minLng: -73.988,
      maxLng: -73.982,
    },
    topViewPosition: [0, 0, 80],
    walkStartPosition: [0, 0, 1.7],
    groundColor: "#1a1a1a",
    ambientColor: "#ffffff",
    buildings: [
      { id: "b1", position: [-20, -15, 0], size: [14, 10, 50], color: "#3a3a4a" },
      { id: "b2", position: [10, -18, 0], size: [12, 12, 65], color: "#4a4a5a" },
      { id: "b3", position: [-22, 10, 0], size: [10, 8, 35], color: "#5a5a6a" },
      { id: "b4", position: [12, 12, 0], size: [8, 14, 48], color: "#3a3a4a" },
      { id: "b5", position: [0, 0, 0], size: [5, 5, 20], color: "#6a6a7a" },
    ],
    roads: [
      { id: "r1", start: [-45, 0], end: [45, 0], width: 14, color: "#252525" },
      { id: "r2", start: [0, -45], end: [0, 45], width: 14, color: "#252525" },
      { id: "r3", start: [-45, -35], end: [45, -35], width: 8, color: "#1e1e1e" },
      { id: "r4", start: [-45, 35], end: [45, 35], width: 8, color: "#1e1e1e" },
    ],
  },

  "gangnam-station": {
    slug: "gangnam-station",
    bounds: {
      minLat: 37.495,
      maxLat: 37.501,
      minLng: 127.025,
      maxLng: 127.030,
    },
    topViewPosition: [0, 0, 80],
    walkStartPosition: [0, 0, 1.7],
    groundColor: "#222222",
    ambientColor: "#ffffff",
    buildings: [
      { id: "b1", position: [-18, -12, 0], size: [12, 10, 38], color: "#3a3a4a" },
      { id: "b2", position: [10, -15, 0], size: [9, 11, 52], color: "#4a4a5a" },
      { id: "b3", position: [-20, 10, 0], size: [13, 8, 30], color: "#5a5a6a" },
      { id: "b4", position: [8, 12, 0], size: [10, 9, 42], color: "#3a3a4a" },
      { id: "b5", position: [0, 0, 0], size: [5, 5, 18], color: "#6a6a7a" },
    ],
    roads: [
      { id: "r1", start: [-40, 0], end: [40, 0], width: 12, color: "#2a2a2a" },
      { id: "r2", start: [0, -40], end: [0, 40], width: 12, color: "#2a2a2a" },
      { id: "r3", start: [-40, -30], end: [40, -30], width: 7, color: "#1e1e1e" },
      { id: "r4", start: [-40, 30], end: [40, 30], width: 7, color: "#1e1e1e" },
    ],
  },
};

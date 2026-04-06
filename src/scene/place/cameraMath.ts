import * as THREE from "three";
import type { PlacePackage } from "../../data/placePackages";
import { APP_CONFIG } from "../../shared/config";

export type CameraBounds = {
  min: number;
  max: number;
};

export type CameraConfig = typeof APP_CONFIG.scene.camera;
export type InputPresetConfig = {
  moveSpeed: number;
  verticalSpeed: number;
  lookSensitivity: number;
};
export type CameraKeybind = CameraConfig["keybind"];

export function applyLookQuaternion(camera: THREE.Camera, yaw: number, pitch: number) {
  const qYaw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
  const qPitch = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), pitch);
  camera.quaternion.copy(qYaw).multiply(qPitch);
}

export function computeCameraBounds(pkg: PlacePackage, cameraConfig: CameraConfig): CameraBounds {
  const maxAbs = Math.max(
    ...pkg.roads.flatMap((r) => [Math.abs(r.start[0]), Math.abs(r.start[1]), Math.abs(r.end[0]), Math.abs(r.end[1])]),
    cameraConfig.boundsFallbackMaxAbs,
  );

  return {
    min: -maxAbs - cameraConfig.boundsPadding,
    max: maxAbs + cameraConfig.boundsPadding,
  };
}

export function applyWalkForwardZoom(params: {
  camera: THREE.Camera;
  bounds: CameraBounds;
  delta: number;
  multiplier: number;
  zoomForward: THREE.Vector3;
}) {
  const { camera, bounds, delta, multiplier, zoomForward } = params;

  zoomForward.set(0, 0, -1).applyQuaternion(camera.quaternion);
  zoomForward.y = 0;

  if (zoomForward.lengthSq() <= 0) {
    return;
  }

  zoomForward.normalize();

  const zoomDistance = delta * multiplier;
  const nextX = THREE.MathUtils.clamp(camera.position.x + zoomForward.x * zoomDistance, bounds.min, bounds.max);
  const nextZ = THREE.MathUtils.clamp(camera.position.z + zoomForward.z * zoomDistance, bounds.min, bounds.max);

  camera.position.set(nextX, camera.position.y, nextZ);
}

export function applyTopViewZoom(params: {
  camera: THREE.Camera;
  cameraConfig: CameraConfig;
  deltaY: number;
  multiplier?: number;
}) {
  const { camera, cameraConfig, deltaY, multiplier = 1 } = params;
  const [topX, topY] = cameraConfig.topViewPosition;
  const minZ = cameraConfig.topViewZoomRange.minZ;
  const maxZ = cameraConfig.topViewZoomRange.maxZ;

  const nextZ = THREE.MathUtils.clamp(
    camera.position.z + deltaY * cameraConfig.topViewWheelZoomMultiplier * multiplier,
    minZ,
    maxZ,
  );

  camera.position.set(topX, topY, nextZ);
  camera.lookAt(0, 0, 0);
}

export function applyWalkMovementFrame(params: {
  camera: THREE.Camera;
  keys: Set<string>;
  inputConfig: InputPresetConfig;
  keybind: CameraKeybind;
  cameraConfig: CameraConfig;
  bounds: CameraBounds;
  delta: number;
  moveInput: THREE.Vector3;
  forward: THREE.Vector3;
  right: THREE.Vector3;
}) {
  const {
    camera,
    keys,
    inputConfig,
    keybind,
    cameraConfig,
    bounds,
    delta,
    moveInput,
    forward,
    right,
  } = params;

  const moveDistance = inputConfig.moveSpeed * delta;
  const verticalDistance = inputConfig.verticalSpeed * delta;

  moveInput.set(
    Number(keys.has(keybind.moveRight)) - Number(keys.has(keybind.moveLeft)),
    0,
    Number(keys.has(keybind.moveBackward)) - Number(keys.has(keybind.moveForward)),
  );

  if (moveInput.lengthSq() > 0) {
    moveInput.normalize().multiplyScalar(moveDistance);

    forward.set(0, 0, -1).applyQuaternion(camera.quaternion);
    forward.y = 0;
    forward.normalize();

    right.set(1, 0, 0).applyQuaternion(camera.quaternion);
    right.y = 0;
    right.normalize();

    camera.position.addScaledVector(right, moveInput.x);
    camera.position.addScaledVector(forward, -moveInput.z);
  }

  let nextY = camera.position.y;

  if (keys.has(keybind.moveUp)) {
    nextY += verticalDistance;
  }

  if (keys.has(keybind.moveDown)) {
    nextY -= verticalDistance;
  }

  camera.position.set(
    THREE.MathUtils.clamp(camera.position.x, bounds.min, bounds.max),
    THREE.MathUtils.clamp(
      nextY,
      cameraConfig.walkHeight + cameraConfig.walkVerticalClampOffset.min,
      cameraConfig.walkHeight + cameraConfig.walkVerticalClampOffset.max,
    ),
    THREE.MathUtils.clamp(camera.position.z, bounds.min, bounds.max),
  );
}

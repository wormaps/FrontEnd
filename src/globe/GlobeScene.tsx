"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { useAppStore } from "../stores/appStore";
import type { Place } from "../types/place";
import { createLogger, toErrorContext } from "../shared/logger";
import { createStaticSceneBootstrap } from "../shared/scene";

type GlobeSceneProps = {
  places: Place[];
};

type WebKitGestureEvent = Event & {
  scale?: number;
};

type GestureHandlers = {
  onGestureStart: (event: Event) => void;
  onGestureChange: (event: Event) => void;
  onGestureEnd: (event: Event) => void;
  onCtrlWheelPinch: (event: WheelEvent) => void;
};

const logger = createLogger("globe:scene");

declare global {
  interface Window {
    CESIUM_BASE_URL?: string;
  }
}

export default function GlobeScene({ places }: GlobeSceneProps) {
  const router = useRouter();
  const setSelectedPlaceId = useAppStore((s) => s.setSelectedPlaceId);
  const setMode = useAppStore((s) => s.setMode);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<import("cesium").Viewer | null>(null);
  const clickHandlerRef = useRef<import("cesium").ScreenSpaceEventHandler | null>(
    null,
  );
  const gestureHandlersRef = useRef<GestureHandlers | null>(null);
  const entityMapRef = useRef<Map<string, string>>(new Map());
  const nameMapRef = useRef<Map<string, string>>(new Map());

  const markerSummary = useMemo(
    () => places.map((place) => place.name).join(" · "),
    [places],
  );

  useEffect(() => {
    let isCancelled = false;
    const slugMap = entityMapRef.current;
    const placeNameMap = nameMapRef.current;

    async function initCesium() {
      if (!containerRef.current || viewerRef.current) {
        return;
      }

      window.CESIUM_BASE_URL = "/cesium";

      const Cesium = await import("cesium");

      if (isCancelled || !containerRef.current) {
        return;
      }

      if (process.env.NEXT_PUBLIC_CESIUM_TOKEN) {
        Cesium.Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_TOKEN;
      }

      const viewer = new Cesium.Viewer(containerRef.current, {
        animation: false,
        timeline: false,
        sceneModePicker: false,
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        navigationHelpButton: false,
        fullscreenButton: false,
        shouldAnimate: true,
        skyAtmosphere: new Cesium.SkyAtmosphere(),
        requestRenderMode: true,
      });

      const screenSpaceController = viewer.scene.screenSpaceCameraController;
      screenSpaceController.enableInputs = true;
      screenSpaceController.enableZoom = true;
      screenSpaceController.zoomEventTypes = [
        Cesium.CameraEventType.RIGHT_DRAG,
        Cesium.CameraEventType.WHEEL,
        Cesium.CameraEventType.PINCH,
      ];
      screenSpaceController.zoomFactor = 5;

      // Google Earth 스타일 대기 및 안개 설정
      viewer.scene.globe.enableLighting = true;
      viewer.scene.globe.showGroundAtmosphere = true;
      viewer.scene.fog.enabled = true;
      viewer.scene.fog.density = 0.0001;
      viewer.scene.fog.screenSpaceErrorFactor = 2.0;
      
      if (viewer.scene.moon) {
        viewer.scene.moon.show = true;
      }

      if (viewer.scene.sun) {
        viewer.scene.sun.show = true;
      }

      let previousGestureScale: number | null = null;
      const onGestureStart = (event: Event) => {
        const gestureEvent = event as WebKitGestureEvent;

        if (typeof gestureEvent.scale !== "number") {
          return;
        }

        event.preventDefault();
        previousGestureScale = gestureEvent.scale;
      };

      const onGestureChange = (event: Event) => {
        const gestureEvent = event as WebKitGestureEvent;

        if (typeof gestureEvent.scale !== "number") {
          return;
        }

        event.preventDefault();

        if (previousGestureScale === null) {
          previousGestureScale = gestureEvent.scale;
          return;
        }

        const scaleDelta = gestureEvent.scale - previousGestureScale;
        previousGestureScale = gestureEvent.scale;

        if (Math.abs(scaleDelta) < 0.001) {
          return;
        }

        const cameraHeight = viewer.camera.positionCartographic.height;
        const zoomAmount = Math.max(cameraHeight * Math.abs(scaleDelta) * 0.08, 10);

        if (scaleDelta > 0) {
          viewer.camera.zoomIn(zoomAmount);
        } else {
          viewer.camera.zoomOut(zoomAmount);
        }

        viewer.scene.requestRender();
      };

      const onGestureEnd = (event: Event) => {
        event.preventDefault();
        previousGestureScale = null;
      };

      const onCtrlWheelPinch = (event: WheelEvent) => {
        if (!event.ctrlKey) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        const cameraHeight = viewer.camera.positionCartographic.height;
        const zoomAmount = Math.max(cameraHeight * Math.min(Math.abs(event.deltaY), 240) * 0.0015, 10);

        if (event.deltaY < 0) {
          viewer.camera.zoomIn(zoomAmount);
        } else {
          viewer.camera.zoomOut(zoomAmount);
        }

        viewer.scene.requestRender();
      };

      viewer.canvas.addEventListener("gesturestart", onGestureStart, { passive: false });
      viewer.canvas.addEventListener("gesturechange", onGestureChange, { passive: false });
      viewer.canvas.addEventListener("gestureend", onGestureEnd, { passive: false });
      viewer.canvas.addEventListener("wheel", onCtrlWheelPinch, { passive: false });

      gestureHandlersRef.current = {
        onGestureStart,
        onGestureChange,
        onGestureEnd,
        onCtrlWheelPinch,
      };
      
      viewerRef.current = viewer;

      slugMap.clear();
      placeNameMap.clear();

      for (const place of places) {
        const bootstrap = createStaticSceneBootstrap(place);
        logger.debug("Prepared scene bootstrap for marker", {
          placeId: place.id,
          slug: place.slug,
          geometryId: bootstrap.geometryId,
          assetUrl: bootstrap.assetUrl,
        });

        const entity = viewer.entities.add({
          id: place.id,
          name: place.name,
          position: Cesium.Cartesian3.fromDegrees(place.lng, place.lat, 0),
          point: {
            pixelSize: 8,
            color: Cesium.Color.CYAN.withAlpha(0.8),
            outlineColor: Cesium.Color.WHITE.withAlpha(0.5),
            outlineWidth: 2,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.5, 8.0e6, 0.5),
          },
          label: {
            text: place.name,
            font: "14px 'Inter', system-ui, sans-serif",
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK.withAlpha(0.5),
            outlineWidth: 2,
            pixelOffset: new Cesium.Cartesian2(0, -28),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            showBackground: true,
            backgroundColor: Cesium.Color.BLACK.withAlpha(0.6),
            backgroundPadding: new Cesium.Cartesian2(8, 4),
            scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5),
            translucencyByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.2),
          },
        });

        const entityId = String(entity.id);
        slugMap.set(entityId, place.slug);
        placeNameMap.set(entityId, place.name);
      }

      // 우주에서 빨려 들어가는 듯한 카메라 연출 (Google Earth Fly-in)
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(127.0276, 37.4979, 15000000), // 우주 고도
        orientation: {
          heading: 0,
          pitch: Cesium.Math.toRadians(-90),
          roll: 0,
        },
      });

      // 1초 뒤 강남역 부근으로 빠르게 이동 후 서서히 안정화
      setTimeout(() => {
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(127.0276, 37.4979, 12000000),
          duration: 3,
          easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,
        });
      }, 500);

      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      clickHandlerRef.current = handler;
      handler.setInputAction((movement: { position: import("cesium").Cartesian2 }) => {
        const picked = viewer.scene.pick(movement.position);
        if (!picked || !picked.id) {
          return;
        }

        const pickedId = String(picked.id.id);
        const slug = slugMap.get(pickedId);

        if (!slug) {
          return;
        }

        setSelectedPlaceId(pickedId);
        setMode("loading");
        logger.info("Place selected from globe", {
          placeId: pickedId,
          slug,
        });
        router.push(`/place/${slug}`);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    void initCesium().catch((error) => {
      logger.error("Failed to initialize Cesium scene", {
        ...toErrorContext(error),
      });
    });

    return () => {
      isCancelled = true;

      if (clickHandlerRef.current) {
        clickHandlerRef.current.destroy();
        clickHandlerRef.current = null;
      }

      if (viewerRef.current) {
        const gestureHandlers = gestureHandlersRef.current;

        if (gestureHandlers) {
          viewerRef.current.canvas.removeEventListener("gesturestart", gestureHandlers.onGestureStart);
          viewerRef.current.canvas.removeEventListener("gesturechange", gestureHandlers.onGestureChange);
          viewerRef.current.canvas.removeEventListener("gestureend", gestureHandlers.onGestureEnd);
          viewerRef.current.canvas.removeEventListener("wheel", gestureHandlers.onCtrlWheelPinch);
        }

        viewerRef.current.destroy();
        viewerRef.current = null;
      }

      gestureHandlersRef.current = null;

      slugMap.clear();
      placeNameMap.clear();
    };
  }, [places, router, setMode, setSelectedPlaceId]);

  return (
    <div className="relative flex min-h-screen w-full">
      <div ref={containerRef} className="h-screen w-full touch-none" />
      <div className="pointer-events-none absolute bottom-4 left-4 z-10 rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-xs text-zinc-200 backdrop-blur-sm">
        <p>Markers: {markerSummary}</p>
        <p className="mt-1 text-cyan-300">
          마커를 클릭해 Place Scene으로 이동
        </p>
      </div>
    </div>
  );
}

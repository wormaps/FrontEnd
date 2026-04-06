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
  const entityMapRef = useRef<Map<string, string>>(new Map());
  const nameMapRef = useRef<Map<string, string>>(new Map());

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
        useBrowserRecommendedResolution: false, // 브라우저 자동 해상도 다운스케일링 금지 (선명해짐)
        terrainShadows: Cesium.ShadowMode.ENABLED, // 지형 간 그림자 생성
        selectionIndicator: false,
        infoBox: false
      });

      // 픽셀 비율(DPI)에 맞춰 해상도 강제 1:1 매칭 (매우 선명해짐)
      viewer.resolutionScale = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1;
      viewer.scene.shadowMap.maximumDistance = 5000.0;

      const screenSpaceController = viewer.scene.screenSpaceCameraController;
      screenSpaceController.enableInputs = true;
      screenSpaceController.enableZoom = true;
      screenSpaceController.zoomEventTypes = [
        Cesium.CameraEventType.RIGHT_DRAG,
        Cesium.CameraEventType.WHEEL,
        Cesium.CameraEventType.PINCH,
      ];
      screenSpaceController.zoomFactor = 3;
      screenSpaceController.inertiaZoom = 0.85;
      screenSpaceController.minimumZoomDistance = 1;
      screenSpaceController.maximumZoomDistance = 2.5e7;

      // Google Earth 수준의 렌더링 튜닝
      viewer.scene.globe.enableLighting = true;
      viewer.scene.globe.showGroundAtmosphere = true;
      viewer.scene.fog.enabled = true;
      viewer.scene.fog.density = 0.0001;
      viewer.scene.fog.screenSpaceErrorFactor = 2.0;
      
      // 고해상도 최적화: HDR 오픈, FXAA 안티앨리어싱
      viewer.scene.highDynamicRange = true;
      viewer.scene.postProcessStages.fxaa.enabled = true;
      viewer.scene.globe.maximumScreenSpaceError = 1.0; // 1.0 이하로 줄여 텍스처를 최고 해상도로 타일링 (기본값 2)
      
      if (viewer.scene.moon) viewer.scene.moon.show = true;
      if (viewer.scene.sun) viewer.scene.sun.show = true;
      
      viewerRef.current = viewer;

      // 3D 지형 (Terrain) 및 전 세계 3D 빌딩 (OSM) 로드
      try {
        const terrainProvider = await Cesium.createWorldTerrainAsync({
          requestVertexNormals: true, // 지형의 곡류와 입체적인 빛 반사/그림자를 살림
          requestWaterMask: true 
        });
        if (!isCancelled && viewerRef.current) {
          viewer.terrainProvider = terrainProvider;
          // 그림자 디테일 증가
          viewer.scene.globe.shadows = Cesium.ShadowMode.RECEIVE_ONLY;
        }

        const osmBuildings = await Cesium.createOsmBuildingsAsync();
        if (!isCancelled && viewerRef.current) {
          // 건물 디테일 최적화
          osmBuildings.maximumScreenSpaceError = 1; 
          viewer.scene.primitives.add(osmBuildings);
        }
      } catch (e) {
        logger.warn("Could not load 3D terrain or buildings (Skipping)", e);
      }

      slugMap.clear();
      placeNameMap.clear();

      for (const place of places) {
        const bootstrap = createStaticSceneBootstrap(place);
        logger.debug("Prepared scene bootstrap for marker", {
          placeId: place.id,
          slug: place.slug,
          geometryId: bootstrap.geometryId,
        });

        const entity = viewer.entities.add({
          id: place.id,
          name: place.name,
          position: Cesium.Cartesian3.fromDegrees(place.lng, place.lat, 150),
          point: {
            pixelSize: 10,
            color: Cesium.Color.fromCssColorString('#3b82f6'), // Tailwind blue-500
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.5, 8.0e6, 0.4),
          },
          label: {
            text: place.name.toUpperCase(),
            font: "700 12px 'Inter', system-ui, sans-serif",
            style: Cesium.LabelStyle.FILL,
            fillColor: Cesium.Color.WHITE,
            pixelOffset: new Cesium.Cartesian2(0, -22),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            showBackground: true,
            backgroundColor: Cesium.Color.fromCssColorString('#16181A').withAlpha(0.85),
            backgroundPadding: new Cesium.Cartesian2(12, 6),
            scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.3),
            translucencyByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.2),
          },
        });

        const entityId = String(entity.id);
        slugMap.set(entityId, place.slug);
        placeNameMap.set(entityId, place.name);
      }

      // 우주에서 바라보는 초기 고정 카메라 위치 (시네마틱 X)
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(127.0276, 37.4979, 15000000), 
        orientation: {
          heading: 0,
          pitch: Cesium.Math.toRadians(-90),
          roll: 0,
        },
      });

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
        logger.info("Place selected from globe", { placeId: pickedId, slug });
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
        viewerRef.current.destroy();
        viewerRef.current = null;
      }

      slugMap.clear();
      placeNameMap.clear();
    };
  }, [places, router, setMode, setSelectedPlaceId]);

  return (
    <div className="relative flex min-h-screen w-full bg-black">
      <div ref={containerRef} className="h-screen w-full touch-none" />
    </div>
  );
}

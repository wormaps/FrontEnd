"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { useAppStore } from "@/src/stores/appStore";
import type { Place } from "@/src/types/place";
import { createLogger, toErrorContext } from "@/src/shared/logger";
import { createStaticSceneBootstrap } from "@/src/shared/scene";
import { APP_CONFIG } from "@/src/shared/config";

type GlobeSceneProps = {
  places: Place[];
};

const logger = createLogger("globe:scene");

declare global {
  interface Window {
    CESIUM_BASE_URL?: string;
  }
}

const { globe: GLOBE, marker: MARKER } = APP_CONFIG.cesium;

export default function GlobeScene({ places }: GlobeSceneProps) {
  const router = useRouter();
  const setSelectedPlaceId = useAppStore((s) => s.setSelectedPlaceId);
  const setMode = useAppStore((s) => s.setMode);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<import("cesium").Viewer | null>(null);
  const clickHandlerRef = useRef<import("cesium").ScreenSpaceEventHandler | null>(null);
  const entityMapRef = useRef<Map<string, string>>(new Map());
  const nameMapRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    let isCancelled = false;
    const slugMap = entityMapRef.current;
    const placeNameMap = nameMapRef.current;

    async function initCesium() {
      if (!containerRef.current || viewerRef.current) return;

      window.CESIUM_BASE_URL = "/cesium";
      const Cesium = await import("cesium");
      if (isCancelled || !containerRef.current) return;

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
        selectionIndicator: false,
        infoBox: false,
        shouldAnimate: true,
        skyAtmosphere: new Cesium.SkyAtmosphere(),
        requestRenderMode: true,
        useBrowserRecommendedResolution: true, // Retina 디스플레이 자동 최적화
        terrainShadows: Cesium.ShadowMode.DISABLED, // 극강의 FPS 확보를 위해 터레인 그림자 해제
      });

      // 카메라 입력 설정
      const ssc = viewer.scene.screenSpaceCameraController;
      ssc.enableInputs = true;
      ssc.enableZoom = true;
      ssc.zoomEventTypes = [
        Cesium.CameraEventType.RIGHT_DRAG,
        Cesium.CameraEventType.WHEEL,
        Cesium.CameraEventType.PINCH,
      ];
      ssc.zoomFactor = GLOBE.zoom.factor;
      ssc.inertiaZoom = GLOBE.zoom.inertia;
      ssc.minimumZoomDistance = GLOBE.zoom.min;
      ssc.maximumZoomDistance = GLOBE.zoom.max;

      // 렌더링 품질 최적화 설정
      viewer.scene.globe.enableLighting = true;
      viewer.scene.globe.showGroundAtmosphere = true;
      viewer.scene.globe.maximumScreenSpaceError = GLOBE.rendering.maximumScreenSpaceError;
      viewer.scene.globe.shadows = Cesium.ShadowMode.DISABLED; // 전지구적 그림자 처리 해제
      
      viewer.scene.fog.enabled = true;
      viewer.scene.fog.density = GLOBE.fog.density;
      viewer.scene.fog.screenSpaceErrorFactor = GLOBE.fog.screenSpaceErrorFactor;
      
      // 후처리(FXAA, HDR) 기능 해제를 통한 연산량 대폭 절감
      viewer.scene.highDynamicRange = false;
      viewer.scene.postProcessStages.fxaa.enabled = false;
      
      if (viewer.scene.moon) viewer.scene.moon.show = true;
      if (viewer.scene.sun) viewer.scene.sun.show = true;

      viewerRef.current = viewer;

      // 3D 지형 (Mountains) 활성화 (OSM 빌딩은 성능을 위해 완전히 제거됨)
      try {
        const terrainProvider = await Cesium.createWorldTerrainAsync({ 
          requestVertexNormals: true, 
          requestWaterMask: true 
        });
        
        if (!isCancelled && viewerRef.current) {
          viewer.terrainProvider = terrainProvider;
        }
      } catch (e) {
        logger.warn("Could not load world terrain — degrading gracefully", toErrorContext(e));
      }

      // 마커 추가
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
          position: Cesium.Cartesian3.fromDegrees(place.lng, place.lat, MARKER.markerAltitude),
          point: {
            pixelSize: MARKER.pixelSize,
            color: Cesium.Color.fromCssColorString(MARKER.pointColor),
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: MARKER.outlineWidth,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            scaleByDistance: new Cesium.NearFarScalar(...GLOBE.scaleByDistance.point),
          },
          label: {
            text: place.name.toUpperCase(),
            font: MARKER.labelFont,
            style: Cesium.LabelStyle.FILL,
            fillColor: Cesium.Color.WHITE,
            pixelOffset: new Cesium.Cartesian2(...MARKER.labelOffset),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            showBackground: true,
            backgroundColor: Cesium.Color.fromCssColorString(MARKER.labelBackgroundColor).withAlpha(MARKER.labelBackgroundAlpha),
            backgroundPadding: new Cesium.Cartesian2(...MARKER.labelBackgroundPadding),
            scaleByDistance: new Cesium.NearFarScalar(...GLOBE.scaleByDistance.labelNear),
            translucencyByDistance: new Cesium.NearFarScalar(...GLOBE.scaleByDistance.labelFar),
          },
        });

        const entityId = String(entity.id);
        slugMap.set(entityId, place.slug);
        placeNameMap.set(entityId, place.name);
      }

      // 초기 카메라 위치
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
          GLOBE.initialView.lng,
          GLOBE.initialView.lat,
          GLOBE.initialView.altitude,
        ),
        orientation: {
          heading: 0,
          pitch: Cesium.Math.toRadians(-90),
          roll: 0,
        },
      });

      // 클릭 핸들러
      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      clickHandlerRef.current = handler;
      handler.setInputAction(
        (movement: { position: import("cesium").Cartesian2 }) => {
          const picked = viewer.scene.pick(movement.position);
          if (!picked?.id) return;

          const pickedId = String(picked.id.id);
          const slug = slugMap.get(pickedId);
          if (!slug) return;

          setSelectedPlaceId(pickedId);
          setMode("loading");
          logger.info("Place selected from globe", { placeId: pickedId, slug });
          router.push(`/place/${slug}`);
        },
        Cesium.ScreenSpaceEventType.LEFT_CLICK,
      );
    }

    void initCesium().catch((error) => {
      logger.error("Failed to initialize Cesium scene", { ...toErrorContext(error) });
    });

    return () => {
      isCancelled = true;
      clickHandlerRef.current?.destroy();
      clickHandlerRef.current = null;
      viewerRef.current?.destroy();
      viewerRef.current = null;
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

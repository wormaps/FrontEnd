"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { useAppStore } from "../stores/appStore";
import type { Place } from "../types/place";

type GlobeSceneProps = {
  places: Place[];
};

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
      });

      viewer.scene.globe.enableLighting = true;
      viewerRef.current = viewer;

      slugMap.clear();
      placeNameMap.clear();

      for (const place of places) {
        const entity = viewer.entities.add({
          id: place.id,
          name: place.name,
          position: Cesium.Cartesian3.fromDegrees(place.lng, place.lat, 0),
          point: {
            pixelSize: 12,
            color: Cesium.Color.CYAN,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
          label: {
            text: place.name,
            font: "14px sans-serif",
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            pixelOffset: new Cesium.Cartesian2(0, -24),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
        });

        const entityId = String(entity.id);
        slugMap.set(entityId, place.slug);
        placeNameMap.set(entityId, place.name);
      }

      viewer.camera.flyHome(0);

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
        router.push(`/place/${slug}`);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    void initCesium();

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
    <div className="relative flex min-h-screen w-full">
      <div ref={containerRef} className="h-screen w-full" />
      <div className="pointer-events-none absolute bottom-4 left-4 z-10 rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-xs text-zinc-200 backdrop-blur-sm">
        <p>Markers: {markerSummary}</p>
        <p className="mt-1 text-cyan-300">
          마커를 클릭해 Place Scene으로 이동
        </p>
      </div>
    </div>
  );
}

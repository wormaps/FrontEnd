"use client";

import { Suspense } from "react";
import type { PlacePackage } from "../../data/placePackages";
import type { GeometryLiveMapping } from "../../shared/contracts";
import SceneAssetModel from "./SceneAssetModel";
import StaticEnvironmentFallback from "./StaticEnvironmentFallback";

type StaticEnvironmentProps = {
  pkg: PlacePackage;
  assetUrl: string;
  assetAvailable: boolean;
  mapping: GeometryLiveMapping | null;
};

export default function StaticEnvironment({ pkg, assetUrl, assetAvailable, mapping }: StaticEnvironmentProps) {
  if (!assetAvailable || assetUrl.length === 0) {
    return <StaticEnvironmentFallback pkg={pkg} />;
  }

  return (
    <Suspense fallback={<StaticEnvironmentFallback pkg={pkg} />}>
      <SceneAssetModel assetUrl={assetUrl} mapping={mapping} />
    </Suspense>
  );
}

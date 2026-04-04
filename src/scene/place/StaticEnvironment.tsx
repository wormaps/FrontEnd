"use client";

import { Suspense } from "react";
import { Component, type ReactNode } from "react";
import type { PlacePackage } from "../../data/placePackages";
import type { GeometryLiveMapping } from "../../shared/contracts";
import { createLogger, toErrorContext } from "../../shared/logger";
import SceneAssetModel from "./SceneAssetModel";
import StaticEnvironmentFallback from "./StaticEnvironmentFallback";

type StaticEnvironmentProps = {
  pkg: PlacePackage;
  assetUrl: string;
  assetAvailable: boolean;
  mapping: GeometryLiveMapping | null;
};

type StaticEnvironmentErrorBoundaryProps = {
  assetUrl: string;
  fallback: ReactNode;
  children: ReactNode;
};

type StaticEnvironmentErrorBoundaryState = {
  hasError: boolean;
};

const logger = createLogger("scene:static-environment");

class StaticEnvironmentErrorBoundary extends Component<
  StaticEnvironmentErrorBoundaryProps,
  StaticEnvironmentErrorBoundaryState
> {
  state: StaticEnvironmentErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: unknown) {
    logger.error("Failed to render GLB static environment. Falling back to procedural scene.", {
      assetUrl: this.props.assetUrl,
      ...toErrorContext(error),
    });
  }

  componentDidUpdate(prevProps: StaticEnvironmentErrorBoundaryProps) {
    if (prevProps.assetUrl !== this.props.assetUrl && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default function StaticEnvironment({ pkg, assetUrl, assetAvailable, mapping }: StaticEnvironmentProps) {
  const fallback = <StaticEnvironmentFallback pkg={pkg} />;

  if (!assetAvailable || assetUrl.length === 0) {
    return fallback;
  }

  return (
    <StaticEnvironmentErrorBoundary assetUrl={assetUrl} fallback={fallback}>
      <Suspense fallback={fallback}>
        <SceneAssetModel assetUrl={assetUrl} mapping={mapping} />
      </Suspense>
    </StaticEnvironmentErrorBoundary>
  );
}

import { NextResponse, type NextRequest } from "next/server";
import { access } from "node:fs/promises";
import path from "node:path";
import { MVP_PLACES } from "../../../../../data/places";
import { createStaticSceneBootstrap } from "../../../../../shared/scene";
import { createLogger, toErrorContext } from "../../../../../shared/logger";

const logger = createLogger("api:scene:bootstrap");

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toPublicAssetFilePath(assetUrl: string) {
  const normalized = assetUrl.startsWith("/") ? assetUrl.slice(1) : assetUrl;
  return path.join(process.cwd(), "public", normalized);
}

async function checkAssetAvailable(assetUrl: string) {
  const assetPath = toPublicAssetFilePath(assetUrl);

  try {
    await access(assetPath);
    return true;
  } catch {
    return false;
  }
}

export async function GET(
  _request: NextRequest,
  context: RouteContext<"/api/scene/[slug]/bootstrap">,
) {
  const { slug } = await context.params;

  try {
    const place = MVP_PLACES.find((candidate) => candidate.slug === slug);

    if (!place) {
      return NextResponse.json(
        {
          error: "Place not found",
        },
        {
          status: 404,
        },
      );
    }

    const defaultBootstrap = createStaticSceneBootstrap(place);
    const assetAvailable = await checkAssetAvailable(defaultBootstrap.assetUrl);
    const bootstrap = createStaticSceneBootstrap(place, {
      assetAvailable,
    });

    logger.debug("Serving scene bootstrap", {
      slug,
      assetUrl: bootstrap.assetUrl,
      assetAvailable: bootstrap.assetAvailable,
    });

    return NextResponse.json(bootstrap, {
      status: 200,
      headers: {
        "Cache-Control": `public, max-age=${bootstrap.cacheTtlSeconds.places}, stale-while-revalidate=${Math.max(bootstrap.cacheTtlSeconds.places, 30)}`,
      },
    });
  } catch (error) {
    logger.error("Failed to build scene bootstrap response", {
      slug,
      ...toErrorContext(error),
    });
    return NextResponse.json(
      {
        error: "Failed to build scene bootstrap",
      },
      {
        status: 500,
      },
    );
  }
}

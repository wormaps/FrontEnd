import { NextResponse, type NextRequest } from "next/server";
import { MVP_PLACES } from "../../../../../data/places";
import { createStaticSceneBootstrap } from "../../../../../shared/scene";
import { createLogger, toErrorContext } from "../../../../../shared/logger";

const logger = createLogger("api:scene:bootstrap");

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

    const bootstrap = createStaticSceneBootstrap(place);

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

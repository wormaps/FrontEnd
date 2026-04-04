import { NextResponse, type NextRequest } from "next/server";
import { PLACE_PACKAGES } from "../../../../../data/placePackages";
import { createLogger } from "../../../../../shared/logger";

const logger = createLogger("api:scene:package");

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  context: RouteContext<"/api/scene/[slug]/package">,
) {
  const { slug } = await context.params;
  const pkg = PLACE_PACKAGES[slug];

  if (!pkg) {
    return NextResponse.json(
      {
        error: "Place package not found",
      },
      {
        status: 404,
      },
    );
  }

  logger.debug("Serving place package", {
    slug,
    buildings: pkg.buildings.length,
    roads: pkg.roads.length,
  });

  return NextResponse.json(pkg, {
    status: 200,
    headers: {
      "Cache-Control": "public, max-age=120, stale-while-revalidate=120",
    },
  });
}

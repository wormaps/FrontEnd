import { NextResponse, type NextRequest } from "next/server";
import { createStaticSceneBootstrap } from "../../../../../shared/scene";
import { MVP_PLACES } from "../../../../../data/places";
import { toLiveStateCacheKey } from "../../../../../shared/cache";
import { validateLivePlaceSnapshot } from "../../../../../shared/contracts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: RouteContext<"/api/live/[slug]/places">,
) {
  const { slug } = await context.params;
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
  const raw = request.nextUrl.searchParams.get("density") ?? "medium";
  const density = raw === "low" || raw === "high" ? raw : "medium";

  const snapshot = validateLivePlaceSnapshot({
    geometryId: bootstrap.geometryId,
    key: toLiveStateCacheKey(bootstrap.geometryId, "places"),
    pedestrianDensity: density,
    vehicleDensity: density,
    capturedAtIso: new Date().toISOString(),
  });

  return NextResponse.json(snapshot, {
    status: 200,
    headers: {
      "Cache-Control": `public, max-age=${bootstrap.cacheTtlSeconds.places}, stale-while-revalidate=${bootstrap.cacheTtlSeconds.places}`,
    },
  });
}

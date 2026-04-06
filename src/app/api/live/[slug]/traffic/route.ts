import { NextResponse, type NextRequest } from "next/server";
import { createStaticSceneBootstrap } from "../../../../../shared/scene";
import { MVP_PLACES } from "../../../../../data/places";
import { toLiveStateCacheKey } from "../../../../../shared/cache";
import { validateLiveTrafficSnapshot } from "../../../../../shared/contracts";
import { normalizeHour, toTrafficPolicy } from "../../../../../shared/domains";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: RouteContext<"/api/live/[slug]/traffic">,
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
  const hour = Number(request.nextUrl.searchParams.get("hour") ?? "12");
  const normalizedHour = normalizeHour(hour);
  const trafficPolicy = toTrafficPolicy(normalizedHour);

  const payload = validateLiveTrafficSnapshot({
    geometryId: bootstrap.geometryId,
    key: toLiveStateCacheKey(bootstrap.geometryId, "traffic"),
    density: trafficPolicy.density,
    speedKph: trafficPolicy.speedKph,
    capturedAtIso: new Date().toISOString(),
  });

  return NextResponse.json(payload, {
    status: 200,
    headers: {
      "Cache-Control": `public, max-age=${bootstrap.cacheTtlSeconds.traffic}, stale-while-revalidate=${bootstrap.cacheTtlSeconds.traffic}`,
    },
  });
}

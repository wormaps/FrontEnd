import { NextResponse, type NextRequest } from "next/server";
import { createStaticSceneBootstrap } from "../../../../../shared/scene";
import { MVP_PLACES } from "../../../../../data/places";
import { toLiveStateCacheKey } from "../../../../../shared/cache";
import { validateLiveTrafficSnapshot } from "../../../../../shared/contracts";

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
  const normalizedHour = Number.isFinite(hour) ? ((hour % 24) + 24) % 24 : 12;
  const rushHour = (normalizedHour >= 8 && normalizedHour <= 10) || (normalizedHour >= 17 && normalizedHour <= 20);

  const payload = validateLiveTrafficSnapshot({
    geometryId: bootstrap.geometryId,
    key: toLiveStateCacheKey(bootstrap.geometryId, "traffic"),
    density: rushHour ? "high" : "medium",
    speedKph: rushHour ? 18 : 32,
    capturedAtIso: new Date().toISOString(),
  });

  return NextResponse.json(payload, {
    status: 200,
    headers: {
      "Cache-Control": `public, max-age=${bootstrap.cacheTtlSeconds.traffic}, stale-while-revalidate=${bootstrap.cacheTtlSeconds.traffic}`,
    },
  });
}

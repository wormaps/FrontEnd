import { NextResponse, type NextRequest } from "next/server";
import { createStaticSceneBootstrap } from "../../../../../shared/scene";
import { MVP_PLACES } from "../../../../../data/places";
import { toLiveStateCacheKey } from "../../../../../shared/cache";
import { validateLiveWeatherSnapshot } from "../../../../../shared/contracts";
import { buildWeatherPolicy, normalizeHour } from "../../../../../shared/domains";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: RouteContext<"/api/live/[slug]/weather">,
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
  const weatherPolicy = buildWeatherPolicy(normalizedHour);

  const snapshot = validateLiveWeatherSnapshot({
    geometryId: bootstrap.geometryId,
    key: toLiveStateCacheKey(bootstrap.geometryId, "weather"),
    condition: weatherPolicy.condition,
    temperatureCelsius: weatherPolicy.temperatureCelsius,
    capturedAtIso: new Date().toISOString(),
  });

  return NextResponse.json(snapshot, {
    status: 200,
    headers: {
      "Cache-Control": `public, max-age=${bootstrap.cacheTtlSeconds.weather}, stale-while-revalidate=${bootstrap.cacheTtlSeconds.weather}`,
    },
  });
}

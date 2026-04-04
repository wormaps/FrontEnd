import { NextResponse, type NextRequest } from "next/server";
import { createStaticGeometryMapping } from "../../../../../shared/scene";
import { createLogger, toErrorContext } from "../../../../../shared/logger";

const logger = createLogger("api:scene:mapping");

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  context: RouteContext<"/api/scene/[slug]/mapping">,
) {
  const { slug } = await context.params;

  try {
    const mapping = createStaticGeometryMapping(slug);

    return NextResponse.json(mapping, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    logger.error("Failed to build geometry mapping", {
      slug,
      ...toErrorContext(error),
    });
    return NextResponse.json(
      {
        error: "Failed to build geometry mapping",
      },
      {
        status: 500,
      },
    );
  }
}

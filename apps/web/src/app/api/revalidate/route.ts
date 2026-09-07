import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";

/**
 * On-Demand Cache Invalidation Webhook
 * 
 * Secure endpoint invoked by apps/admin to revalidate cached RSC tags
 * when mutations occur (e.g. portfolio-projects, portfolio-settings, portfolio-experience).
 */
export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get("x-revalidate-secret");
    const expectedSecret = process.env.REVALIDATION_SECRET || "ugaas-revalidate-secret-key";

    if (!secret || secret !== expectedSecret) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing x-revalidate-secret header" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const tag = body.tag;

    if (!tag || typeof tag !== "string") {
      return NextResponse.json(
        { error: "Bad Request: Missing or invalid 'tag' in request payload" },
        { status: 400 }
      );
    }

    // Next.js on-demand tag cache eviction
    revalidateTag(tag, "max");

    console.log(`🔄 [Webhook] Cache tag successfully invalidated: "${tag}"`);

    return NextResponse.json({
      revalidated: true,
      tag,
      now: Date.now(),
    });
  } catch (error: any) {
    console.error("❌ [Revalidate Webhook] Handler error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error during cache revalidation" },
      { status: 500 }
    );
  }
}

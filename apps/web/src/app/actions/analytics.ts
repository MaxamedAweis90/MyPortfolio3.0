"use server";

import { headers } from "next/headers";
import { connectToDatabase, VisitorAnalytics } from "@portfolio/database";

/**
 * Server Action to record real-time visitor page telemetry into MongoDB.
 * Replaces client-side REST fetch calls to /api/ugaas/analytics.
 */
export async function logPageView(path: string, clientReferrer?: string) {
  try {
    // Ignore internal admin, API, and static asset routes
    if (!path || path.startsWith("/ugaas") || path.startsWith("/api") || path.startsWith("/_next")) {
      return { success: false, ignored: true };
    }

    const headerList = await headers();
    const userAgent = headerList.get("user-agent") || "";
    const ip =
      headerList.get("x-forwarded-for")?.split(",")[0].trim() ||
      headerList.get("x-real-ip") ||
      "127.0.0.1";
    const referrer = clientReferrer || headerList.get("referer") || "direct";

    const isMobile = /mobile|iphone|android/i.test(userAgent);
    const isTablet = /tablet|ipad/i.test(userAgent);
    const deviceType: "desktop" | "mobile" | "tablet" | "unknown" = isTablet
      ? "tablet"
      : isMobile
      ? "mobile"
      : "desktop";

    await connectToDatabase();

    await VisitorAnalytics.create({
      path,
      ipAddress: ip,
      userAgent,
      referrer,
      device: {
        type: deviceType,
        os: userAgent.includes("Windows")
          ? "Windows"
          : userAgent.includes("Mac")
          ? "macOS"
          : userAgent.includes("Linux")
          ? "Linux"
          : userAgent.includes("Android")
          ? "Android"
          : userAgent.includes("iPhone")
          ? "iOS"
          : "Other",
        browser: userAgent.includes("Chrome")
          ? "Chrome"
          : userAgent.includes("Safari")
          ? "Safari"
          : userAgent.includes("Firefox")
          ? "Firefox"
          : userAgent.includes("Edge")
          ? "Edge"
          : "Other",
      },
      duration: 120, // default session duration fallback in seconds
    });

    return { success: true };
  } catch (error) {
    console.warn("⚠️ [Analytics Action] Failed to record page view telemetry:", error);
    return { success: false };
  }
}

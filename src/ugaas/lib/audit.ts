import { NextRequest } from "next/server";
import { connectToDatabase } from "@/ugaas/lib/db";
import { AuditLog, AuditLogCategory } from "@/ugaas/models/AuditLog";

export interface ParsedDevice {
  type: "desktop" | "mobile" | "tablet" | "unknown";
  os: string;
  browser: string;
  name: string;
}

export interface ResolvedLocation {
  city: string;
  country: string;
  region: string;
  ip: string;
}

/**
 * Pure TypeScript User-Agent parser (fast, zero dependencies)
 */
export function parseUserAgent(userAgentString?: string | null): ParsedDevice {
  if (!userAgentString) {
    return {
      type: "desktop",
      os: "Windows 11",
      browser: "Chrome",
      name: "Chrome on Windows",
    };
  }

  const ua = userAgentString;

  // 1. Determine Device Type
  let type: "desktop" | "mobile" | "tablet" | "unknown" = "desktop";
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    type = "tablet";
  } else if (
    /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(
      ua
    )
  ) {
    type = "mobile";
  }

  // 2. Determine OS
  let os = "Unknown OS";
  if (/Windows NT 10.0/i.test(ua)) os = "Windows 10/11";
  else if (/Windows NT 6.3/i.test(ua)) os = "Windows 8.1";
  else if (/Windows NT 6.2/i.test(ua)) os = "Windows 8";
  else if (/Windows NT 6.1/i.test(ua)) os = "Windows 7";
  else if (/Windows/i.test(ua)) os = "Windows";
  else if (/iPhone OS (\d+_\d+)/i.test(ua)) {
    const match = ua.match(/iPhone OS (\d+_\d+)/i);
    os = `iOS ${match ? match[1].replace("_", ".") : ""}`.trim();
  } else if (/iPad; CPU OS (\d+_\d+)/i.test(ua)) {
    const match = ua.match(/iPad; CPU OS (\d+_\d+)/i);
    os = `iPadOS ${match ? match[1].replace("_", ".") : ""}`.trim();
  } else if (/Mac OS X (\d+[._]\d+)/i.test(ua)) {
    const match = ua.match(/Mac OS X (\d+[._]\d+)/i);
    os = `macOS ${match ? match[1].replace("_", ".") : ""}`.trim();
  } else if (/Android (\d+(\.\d+)?)/i.test(ua)) {
    const match = ua.match(/Android (\d+(\.\d+)?)/i);
    os = `Android ${match ? match[1] : ""}`.trim();
  } else if (/Ubuntu/i.test(ua)) os = "Ubuntu Linux";
  else if (/Linux/i.test(ua)) os = "Linux";
  else if (/CrOS/i.test(ua)) os = "ChromeOS";

  // 3. Determine Browser
  let browser = "Unknown Browser";
  if (/Edg\/(\d+)/i.test(ua)) {
    const match = ua.match(/Edg\/(\d+)/i);
    browser = `Edge ${match ? match[1] : ""}`.trim();
  } else if (/Chrome\/(\d+)/i.test(ua) && !/Chromium/i.test(ua)) {
    const match = ua.match(/Chrome\/(\d+)/i);
    browser = `Chrome ${match ? match[1] : ""}`.trim();
  } else if (/Safari\/(\d+)/i.test(ua) && !/Chrome/i.test(ua)) {
    const match = ua.match(/Version\/(\d+)/i);
    browser = `Safari ${match ? match[1] : ""}`.trim();
  } else if (/Firefox\/(\d+)/i.test(ua)) {
    const match = ua.match(/Firefox\/(\d+)/i);
    browser = `Firefox ${match ? match[1] : ""}`.trim();
  } else if (/OPR\/(\d+)/i.test(ua) || /Opera/i.test(ua)) {
    browser = "Opera";
  } else if (/PostmanRuntime/i.test(ua)) {
    browser = "Postman API Client";
  } else if (/curl/i.test(ua)) {
    browser = "cURL Terminal";
  }

  const name = `${browser} on ${os}`;

  return { type, os, browser, name };
}

/**
 * Resolves Client IP and Geolocation from standard proxy and CDN headers
 */
export function resolveClientInfo(req?: Request | NextRequest): {
  ip: string;
  userAgent: string;
  device: ParsedDevice;
  location: ResolvedLocation;
} {
  let ip = "127.0.0.1";
  let userAgent = "";
  let city = "Localhost";
  let country = "Development";
  let region = "Dev Network";

  if (req) {
    const headers = req.headers;

    // 1. IP extraction
    const forwarded = headers.get("x-forwarded-for");
    if (forwarded) {
      ip = forwarded.split(",")[0].trim();
    } else {
      ip =
        headers.get("x-real-ip") ||
        headers.get("cf-connecting-ip") ||
        headers.get("x-client-ip") ||
        "127.0.0.1";
    }

    // 2. User-Agent
    userAgent = headers.get("user-agent") || "";

    // 3. Geolocation extraction from Vercel / Cloudflare headers
    const headerCity =
      headers.get("x-vercel-ip-city") || headers.get("cf-ipcity");
    const headerCountry =
      headers.get("x-vercel-ip-country") || headers.get("cf-ipcountry");
    const headerRegion =
      headers.get("x-vercel-ip-country-region") || headers.get("cf-region");

    const isLocal =
      ip === "127.0.0.1" ||
      ip === "::1" ||
      ip === "localhost" ||
      ip.startsWith("192.168.") ||
      ip.startsWith("10.") ||
      ip.startsWith("172.");

    if (isLocal) {
      city = "Localhost";
      country = "Development";
      region = "LAN / Local";
    } else {
      city = headerCity ? decodeURIComponent(headerCity) : "Mogadishu";
      country = headerCountry || "Somalia";
      region = headerRegion || "Banaadir";
    }
  }

  const device = parseUserAgent(userAgent);
  const location: ResolvedLocation = { city, country, region, ip };

  return { ip, userAgent, device, location };
}

export interface ActivityPayload {
  action: string;
  category: AuditLogCategory;
  description: string;
  resourceId?: string;
  resourceName?: string;
  details?: Record<string, any>;
  actorEmail?: string;
}

/**
 * Record an audit activity event asynchronously in MongoDB
 */
export async function logActivity(
  req: Request | NextRequest | undefined,
  payload: ActivityPayload
) {
  try {
    await connectToDatabase();
    const { ip, userAgent, device, location } = resolveClientInfo(req);

    const logEntry = new AuditLog({
      action: payload.action,
      category: payload.category,
      description: payload.description,
      resourceId: payload.resourceId,
      resourceName: payload.resourceName,
      details: payload.details || {},
      actorEmail: payload.actorEmail || "admin@ugaas.dev",
      ipAddress: ip,
      userAgent,
      device,
      location,
    });

    await logEntry.save();
  } catch (error) {
    // Non-blocking log failure should not interrupt core business logic
    console.error("⚠️ [AuditLog] Failed to record activity log:", error);
  }
}

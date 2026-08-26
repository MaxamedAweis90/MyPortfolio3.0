import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/ugaas/lib/db";
import { Settings } from "@/ugaas/models/Settings";

export async function POST(req: NextRequest) {
  try {
    const { passphrase } = await req.json();

    if (!passphrase || typeof passphrase !== "string") {
      return NextResponse.json(
        { success: false, error: "wrong input please try another" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const settings = await Settings.findOne().lean();
    const secretKey = (settings?.timeoutOverrideKey || "Hooyo Mcn").trim();

    // Clean quotes from input
    const cleanedPassphrase = passphrase.trim().replace(/^['"]+|['"]+$/g, "");

    if (cleanedPassphrase === secretKey) {
      // Record activity audit log if possible
      try {
        const { logActivity } = await import("@/ugaas/lib/audit");
        await logActivity(req, {
          action: "SESSION_REVOKED",
          category: "auth",
          description: "Security timeout lockout overridden via secret passphrase",
          details: { method: "timeout -r" },
        });
      } catch {
        // ignore
      }

      return NextResponse.json({
        success: true,
        message: "Security timeout lockout cleared successfully.",
      });
    } else {
      return NextResponse.json(
        { success: false, error: "wrong input please try another" },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error("Timeout override error:", error);
    return NextResponse.json(
      { success: false, error: "wrong input please try another" },
      { status: 500 }
    );
  }
}

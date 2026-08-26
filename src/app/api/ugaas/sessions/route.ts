import { NextRequest, NextResponse } from "next/server";
import { client } from "@/ugaas/lib/mongodb";
import { connectToDatabase } from "@/ugaas/lib/db";
import { Settings } from "@/ugaas/models/Settings";
import { parseUserAgent, logActivity } from "@/ugaas/lib/audit";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const db = client.db("myportfolio");
    const sessionsCollection = db.collection("session");

    // 1. Fetch current settings for maxConcurrentSessions limit
    const settingsDoc = await Settings.findOne();
    const maxLimit = settingsDoc?.maxConcurrentSessions ?? 3;

    // 2. Extract current request session token from cookies
    const currentToken =
      req.cookies.get("better-auth.session_token")?.value ||
      req.cookies.get("__session")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "") ||
      "";

    // 3. Query all valid/non-expired sessions
    const now = new Date();
    let rawSessions = await sessionsCollection
      .find({
        $or: [{ expiresAt: { $gt: now } }, { expiresAt: { $exists: false } }],
      })
      .sort({ updatedAt: -1, createdAt: -1 })
      .toArray();

    // If no sessions found, fallback to simulated current session for dev view
    if (rawSessions.length === 0) {
      const userAgent = req.headers.get("user-agent") || "";
      const forwarded = req.headers.get("x-forwarded-for");
      const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

      rawSessions = [
        {
          _id: "current_active_session",
          id: "current_active_session",
          token: currentToken || "current_session_token",
          ipAddress: ip,
          userAgent: userAgent,
          createdAt: now,
          updatedAt: now,
          expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        } as any,
      ];
    }

    // 4. Enforce Max Concurrent Sessions if enabled (limit > 0)
    if (maxLimit > 0 && rawSessions.length > maxLimit) {
      // Find oldest sessions that are NOT the current session
      const nonCurrentSessions = rawSessions.filter(
        (s) => (s.token || s.id) !== currentToken
      );

      const excessCount = rawSessions.length - maxLimit;
      if (excessCount > 0 && nonCurrentSessions.length > 0) {
        // Sort ascending by updatedAt to prune oldest first
        const sortedOldest = [...nonCurrentSessions].sort(
          (a, b) =>
            new Date(a.updatedAt || a.createdAt).getTime() -
            new Date(b.updatedAt || b.createdAt).getTime()
        );

        const sessionsToPrune = sortedOldest.slice(0, excessCount);
        const pruneIds = sessionsToPrune.map((s) => s._id || s.id);

        await sessionsCollection.deleteMany({
          $or: [{ _id: { $in: pruneIds } }, { id: { $in: pruneIds } }],
        });

        // Exclude pruned sessions from return list
        rawSessions = rawSessions.filter(
          (s) => !pruneIds.some((pId) => String(pId) === String(s._id || s.id))
        );
      }
    }

    // 5. Enrich sessions with parsed device, OS, browser, IP, location, and isCurrent flag
    const enrichedSessions = rawSessions.map((session) => {
      const sessionId = String(session._id || session.id || session.token);
      const isCurrent =
        Boolean(currentToken) &&
        (session.token === currentToken || sessionId === currentToken);

      const userAgent = session.userAgent || "";
      const device = parseUserAgent(userAgent);
      const ip = session.ipAddress || "127.0.0.1";

      const isLocal =
        ip === "127.0.0.1" ||
        ip === "::1" ||
        ip === "localhost" ||
        ip.startsWith("192.168.") ||
        ip.startsWith("10.") ||
        ip.startsWith("172.");

      const location = isLocal
        ? { city: "Localhost", country: "Development", ip }
        : {
            city: req.headers.get("x-vercel-ip-city") || "Mogadishu",
            country: req.headers.get("x-vercel-ip-country") || "Somalia",
            ip,
          };

      return {
        id: sessionId,
        token: session.token ? `${session.token.slice(0, 10)}...` : undefined,
        device,
        location,
        ipAddress: ip,
        userAgent,
        createdAt: session.createdAt || now,
        updatedAt: session.updatedAt || now,
        expiresAt: session.expiresAt,
        isCurrent: isCurrent || rawSessions.length === 1,
      };
    });

    return NextResponse.json({
      success: true,
      sessions: enrichedSessions,
      maxConcurrentSessions: maxLimit,
      totalActive: enrichedSessions.length,
    });
  } catch (error: any) {
    console.error("❌ [API] GET /api/ugaas/sessions error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch active sessions" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const db = client.db("myportfolio");
    const sessionsCollection = db.collection("session");

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const action = searchParams.get("action");

    const currentToken =
      req.cookies.get("better-auth.session_token")?.value ||
      req.cookies.get("__session")?.value ||
      req.headers.get("authorization")?.replace("Bearer ", "") ||
      "";

    if (action === "revoke_others") {
      // Revoke all sessions except the current active one
      if (currentToken) {
        await sessionsCollection.deleteMany({
          token: { $ne: currentToken },
        });
      } else {
        // If token not resolvable, keep most recent one
        const mostRecent = await sessionsCollection
          .find()
          .sort({ updatedAt: -1 })
          .limit(1)
          .toArray();

        if (mostRecent.length > 0) {
          const keepId = mostRecent[0]._id;
          await sessionsCollection.deleteMany({
            _id: { $ne: keepId },
          });
        }
      }

      await logActivity(req, {
        action: "SESSION_REVOKE_ALL_OTHERS",
        category: "auth",
        description: "Terminated all other active sessions across devices",
      });

      return NextResponse.json({
        success: true,
        message: "All other device sessions have been revoked successfully",
      });
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Delete single session by ID or token
    await sessionsCollection.deleteOne({
      $or: [{ _id: id as any }, { id: id }, { token: id }],
    });

    await logActivity(req, {
      action: "SESSION_REVOKED",
      category: "auth",
      description: `Revoked session on device (${id})`,
      resourceId: id,
    });

    return NextResponse.json({
      success: true,
      message: "Session terminated successfully",
    });
  } catch (error: any) {
    console.error("❌ [API] DELETE /api/ugaas/sessions error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to revoke session" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/ugaas/lib/db";
import { AuditLog } from "@/ugaas/models/AuditLog";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "25", 10)));
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const query: Record<string, any> = {};

    if (category && category !== "all") {
      query.category = category;
    }

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { description: regex },
        { action: regex },
        { resourceName: regex },
        { actorEmail: regex },
        { ipAddress: regex },
        { "device.browser": regex },
        { "device.os": regex },
      ];
    }

    const skip = (page - 1) * limit;

    const [logs, total, countsByCategory] = await Promise.all([
      AuditLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      AuditLog.countDocuments(query),
      AuditLog.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ]),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    const categoryStats: Record<string, number> = {
      all: await AuditLog.countDocuments(),
      projects: 0,
      experience: 0,
      inquiries: 0,
      settings: 0,
      auth: 0,
      system: 0,
    };

    countsByCategory.forEach((item) => {
      if (item._id && categoryStats[item._id] !== undefined) {
        categoryStats[item._id] = item.count;
      }
    });

    return NextResponse.json({
      success: true,
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
      categoryStats,
    });
  } catch (error: any) {
    console.error("❌ [API] GET /api/ugaas/logs error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch audit logs" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const clearAll = searchParams.get("clearAll") === "true";
    const days = parseInt(searchParams.get("days") || "0", 10);

    let result;

    if (clearAll) {
      result = await AuditLog.deleteMany({});
    } else if (days > 0) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      result = await AuditLog.deleteMany({ createdAt: { $lt: cutoffDate } });
    } else {
      return NextResponse.json(
        { success: false, error: "Specify clearAll=true or days > 0" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
      message: `Cleared ${result.deletedCount} log entries successfully`,
    });
  } catch (error: any) {
    console.error("❌ [API] DELETE /api/ugaas/logs error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to clear audit logs" },
      { status: 500 }
    );
  }
}

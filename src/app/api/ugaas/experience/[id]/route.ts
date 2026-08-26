import { NextResponse } from "next/server";
import { connectToDatabase } from "@/ugaas/lib/db";
import { Experience } from "@/ugaas/models/Experience";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { _id: id };
    const record = await Experience.findOne(query).lean();

    if (!record) {
      return NextResponse.json(
        { success: false, error: "Record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      experience: {
        ...record,
        id: (record as any)._id.toString(),
      },
    });
  } catch (error) {
    console.error("❌ [Experience Get Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch record" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    await connectToDatabase();

    const {
      role,
      company,
      duration,
      badges,
      highlights,
      techStack,
      image,
      credentialUrl,
      credentialId,
      type,
      order,
    } = body;

    const updateData: any = {};
    if (role !== undefined) updateData.role = role;
    if (company !== undefined) updateData.company = company;
    if (duration !== undefined) updateData.duration = duration;
    if (badges !== undefined) {
      updateData.badges = Array.isArray(badges) ? badges : [badges].filter(Boolean);
    }
    if (highlights !== undefined) {
      updateData.highlights = Array.isArray(highlights)
        ? highlights.filter(Boolean)
        : typeof highlights === "string"
        ? highlights.split("\n").filter(Boolean)
        : [];
    }
    if (techStack !== undefined) {
      updateData.techStack = Array.isArray(techStack)
        ? techStack.filter(Boolean)
        : typeof techStack === "string"
        ? techStack.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [];
    }
    if (image !== undefined) updateData.image = image;
    if (credentialUrl !== undefined) updateData.credentialUrl = credentialUrl;
    if (credentialId !== undefined) updateData.credentialId = credentialId;
    if (type !== undefined) updateData.type = type;
    if (order !== undefined) updateData.order = Number(order);

    const updated = await Experience.findByIdAndUpdate(id, updateData, {
      new: true,
    }).lean();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Record not found" },
        { status: 404 }
      );
    }

    // Record activity audit log
    const { logActivity } = await import("@/ugaas/lib/audit");
    await logActivity(request, {
      action: "EXPERIENCE_UPDATE",
      category: "experience",
      description: `Updated experience record: "${(updated as any).role}" at "${(updated as any).company}"`,
      resourceId: (updated as any)._id.toString(),
      resourceName: `${(updated as any).role} - ${(updated as any).company}`,
      details: {
        updatedFields: Object.keys(updateData),
        type: (updated as any).type,
      },
    });

    return NextResponse.json({
      success: true,
      experience: {
        ...updated,
        id: (updated as any)._id.toString(),
      },
    });
  } catch (error) {
    console.error("❌ [Experience Update Error]:", error);
    const message = error instanceof Error ? error.message : "Failed to update record";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const deleted = await Experience.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Record not found" },
        { status: 404 }
      );
    }

    // Record activity audit log
    const { logActivity } = await import("@/ugaas/lib/audit");
    await logActivity(request, {
      action: "EXPERIENCE_DELETE",
      category: "experience",
      description: `Deleted experience record: "${deleted.role}" at "${deleted.company}"`,
      resourceId: deleted._id.toString(),
      resourceName: `${deleted.role} - ${deleted.company}`,
      details: {
        type: deleted.type,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Record deleted successfully",
    });
  } catch (error) {
    console.error("❌ [Experience Delete Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete record" },
      { status: 500 }
    );
  }
}

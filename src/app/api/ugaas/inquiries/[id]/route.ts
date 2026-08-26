import { NextResponse } from "next/server";
import { connectToDatabase } from "@/ugaas/lib/db";
import { Inquiry } from "@/ugaas/models/Inquiry";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const inquiry = await Inquiry.findById(id).lean();
    if (!inquiry) {
      return NextResponse.json(
        { success: false, error: "Inquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      inquiry: {
        ...inquiry,
        id: (inquiry as any)._id.toString(),
      },
    });
  } catch (error) {
    console.error("❌ [Inquiry Get Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch inquiry" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!["unread", "read", "archived"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status value" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const updated = await Inquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Inquiry not found" },
        { status: 404 }
      );
    }

    // Record activity audit log
    const { logActivity } = await import("@/ugaas/lib/audit");
    await logActivity(request, {
      action: "INQUIRY_STATUS_CHANGE",
      category: "inquiries",
      description: `Changed inquiry status to "${status}" for "${(updated as any).projectName || (updated as any).name}"`,
      resourceId: (updated as any)._id.toString(),
      resourceName: (updated as any).projectName || (updated as any).name,
      details: {
        newStatus: status,
        clientEmail: (updated as any).email,
      },
    });

    return NextResponse.json({
      success: true,
      inquiry: {
        ...updated,
        id: (updated as any)._id.toString(),
      },
    });
  } catch (error) {
    console.error("❌ [Inquiry Update Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update inquiry" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const deleted = await Inquiry.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Inquiry not found" },
        { status: 404 }
      );
    }

    // Record activity audit log
    const { logActivity } = await import("@/ugaas/lib/audit");
    await logActivity(request, {
      action: "INQUIRY_DELETE",
      category: "inquiries",
      description: `Deleted inquiry from "${deleted.name}" (${deleted.projectName || "No Project"})`,
      resourceId: deleted._id.toString(),
      resourceName: deleted.projectName || deleted.name,
      details: {
        email: deleted.email,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Inquiry deleted successfully",
    });
  } catch (error) {
    console.error("❌ [Inquiry Delete Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}

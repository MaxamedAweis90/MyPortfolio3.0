import { NextResponse } from "next/server";
import { connectToDatabase } from "@/ugaas/lib/db";
import { Project } from "@/ugaas/models/Project";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { slug: id };
    const project = await Project.findOne(query).lean();

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      project: {
        ...project,
        id: (project as any)._id.toString(),
      },
    });
  } catch (error) {
    console.error("❌ [Project Get Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve project" },
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

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { slug: id };

    const {
      title,
      slug,
      category,
      desc,
      fullDesc,
      liveUrl,
      githubUrl,
      clientUrl,
      serverUrl,
      playStoreUrl,
      appStoreUrl,
      image,
      tools,
      isFeatured,
      order,
    } = body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (category !== undefined) updateData.category = category;
    if (desc !== undefined) updateData.desc = desc;
    if (fullDesc !== undefined) updateData.fullDesc = fullDesc;
    if (liveUrl !== undefined) updateData.liveUrl = liveUrl;
    if (githubUrl !== undefined) updateData.githubUrl = githubUrl;
    if (clientUrl !== undefined) updateData.clientUrl = clientUrl;
    if (serverUrl !== undefined) updateData.serverUrl = serverUrl;
    if (playStoreUrl !== undefined) updateData.playStoreUrl = playStoreUrl;
    if (appStoreUrl !== undefined) updateData.appStoreUrl = appStoreUrl;
    if (image !== undefined) updateData.image = image;
    if (tools !== undefined) {
      updateData.tools = Array.isArray(tools)
        ? tools
        : typeof tools === "string"
        ? tools.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [];
    }
    if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured);
    if (order !== undefined) updateData.order = Number(order);

    const updated = await Project.findOneAndUpdate(query, updateData, {
      new: true,
    }).lean();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Record activity audit log
    const { logActivity } = await import("@/ugaas/lib/audit");
    await logActivity(request, {
      action: "PROJECT_UPDATE",
      category: "projects",
      description: `Updated project "${(updated as any).title}"`,
      resourceId: (updated as any)._id.toString(),
      resourceName: (updated as any).title,
      details: {
        updatedFields: Object.keys(updateData),
        category: (updated as any).category,
        slug: (updated as any).slug,
      },
    });

    return NextResponse.json({
      success: true,
      project: {
        ...updated,
        id: (updated as any)._id.toString(),
      },
    });
  } catch (error) {
    console.error("❌ [Project Update Error]:", error);
    const message = error instanceof Error ? error.message : "Failed to update project";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    await connectToDatabase();

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { slug: id };

    const updated = await Project.findOneAndUpdate(query, body, {
      new: true,
    }).lean();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Record activity audit log
    const { logActivity } = await import("@/ugaas/lib/audit");
    await logActivity(request, {
      action: "PROJECT_PATCH",
      category: "projects",
      description: `Patched project "${(updated as any).title}"`,
      resourceId: (updated as any)._id.toString(),
      resourceName: (updated as any).title,
      details: body,
    });

    return NextResponse.json({
      success: true,
      project: {
        ...updated,
        id: (updated as any)._id.toString(),
      },
    });
  } catch (error) {
    console.error("❌ [Project Patch Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to patch project" },
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

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { slug: id };

    const deleted = await Project.findOneAndDelete(query);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Record activity audit log
    const { logActivity } = await import("@/ugaas/lib/audit");
    await logActivity(request, {
      action: "PROJECT_DELETE",
      category: "projects",
      description: `Deleted project "${deleted.title}" (${deleted.slug})`,
      resourceId: deleted._id.toString(),
      resourceName: deleted.title,
      details: {
        category: deleted.category,
        slug: deleted.slug,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("❌ [Project Delete Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete project" },
      { status: 500 }
    );
  }
}

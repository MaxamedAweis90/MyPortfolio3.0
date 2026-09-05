import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/ugaas/lib/db";
import { Project } from "@/ugaas/models/Project";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
      appIconUrl,
      apkUrl,
      screenshots,
      images,
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
    if (appIconUrl !== undefined) updateData.appIconUrl = appIconUrl;
    if (apkUrl !== undefined) updateData.apkUrl = apkUrl;
    if (screenshots !== undefined) {
      updateData.screenshots = Array.isArray(screenshots)
        ? screenshots.filter(Boolean)
        : screenshots
        ? [screenshots]
        : [];
    }
    if (images !== undefined) {
      updateData.images = Array.isArray(images)
        ? images.filter(Boolean)
        : images
        ? [images]
        : [];
    }
    if (image !== undefined) updateData.image = image;
    if (tools !== undefined) {
      updateData.tools = Array.isArray(tools)
        ? tools
        : typeof tools === "string"
        ? tools.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [];
    }
    if (isFeatured !== undefined) {
      const willBeFeatured = Boolean(isFeatured);
      if (willBeFeatured) {
        const current = await Project.findOne(query).select("_id isFeatured").lean();
        if (current && !current.isFeatured) {
          const featuredCount = await Project.countDocuments({
            isFeatured: true,
            _id: { $ne: current._id },
          });
          if (featuredCount >= 6) {
            return NextResponse.json(
              {
                success: false,
                error: "Maximum 6 projects can be featured on the Home section.",
              },
              { status: 400 }
            );
          }
        }
      }
      updateData.isFeatured = willBeFeatured;
    }
    if (order !== undefined) updateData.order = Number(order);
    if (body.sortOrder !== undefined) updateData.sortOrder = Number(body.sortOrder);

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

    try {
      revalidatePath("/");
      revalidatePath("/work");
      if ((updated as any).slug) {
        revalidatePath(`/work/${(updated as any).slug}`);
      }
    } catch {}

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

    if (body.isFeatured !== undefined && Boolean(body.isFeatured) === true) {
      const current = await Project.findOne(query).select("_id isFeatured").lean();
      if (current && !current.isFeatured) {
        const featuredCount = await Project.countDocuments({
          isFeatured: true,
          _id: { $ne: current._id },
        });
        if (featuredCount >= 6) {
          return NextResponse.json(
            {
              success: false,
              error: "Maximum 6 projects can be featured on the Home section.",
            },
            { status: 400 }
          );
        }
      }
    }

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

    try {
      revalidatePath("/");
      revalidatePath("/work");
      if ((updated as any).slug) {
        revalidatePath(`/work/${(updated as any).slug}`);
      }
    } catch {}

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
    const query = isObjectId
      ? { $or: [{ _id: new mongoose.Types.ObjectId(id) }, { _id: id }, { slug: id }] }
      : { slug: id };

    let deleted = await Project.findOneAndDelete(query).lean();
    if (!deleted && isObjectId) {
      // Direct collection fallback in case Mongoose model casting differed
      const raw = await Project.collection.findOne({
        _id: new mongoose.Types.ObjectId(id),
      });
      if (raw) {
        await Project.collection.deleteOne({ _id: raw._id });
        deleted = raw as any;
      }
    }

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Re-sequence all remaining projects so numbers are descending (N down to 1) and sortOrder is 1..N
    const remaining = await Project.find()
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();
    const totalRemaining = remaining.length;
    if (totalRemaining > 0) {
      for (let i = 0; i < totalRemaining; i++) {
        const correctNumber = totalRemaining - i;
        const correctSort = i + 1;
        if (
          remaining[i].projectNumber !== correctNumber ||
          remaining[i].sortOrder !== correctSort
        ) {
          await Project.collection.updateOne(
            { _id: remaining[i]._id },
            {
              $set: {
                projectNumber: correctNumber,
                sortOrder: correctSort,
                order: correctSort,
              },
            }
          );
        }
      }
    }

    // Record activity audit log
    const { logActivity } = await import("@/ugaas/lib/audit");
    await logActivity(request, {
      action: "PROJECT_DELETE",
      category: "projects",
      description: `Deleted project "${(deleted as any).title}" (${(deleted as any).slug})`,
      resourceId: (deleted as any)._id.toString(),
      resourceName: (deleted as any).title,
      details: {
        category: (deleted as any).category,
        slug: (deleted as any).slug,
      },
    });

    try {
      revalidatePath("/ugaas/projects");
      revalidatePath("/");
      revalidatePath("/work");
      if ((deleted as any).slug) {
        revalidatePath(`/work/${(deleted as any).slug}`);
      }
    } catch {}

    return NextResponse.json(
      {
        success: true,
        message: "Project deleted successfully",
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("❌ [Project Delete Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete project" },
      { status: 500 }
    );
  }
}

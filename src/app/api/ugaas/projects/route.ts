import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/ugaas/lib/db";
import { Project } from "@/ugaas/models/Project";
import { ProjectCategory } from "@/ugaas/models/ProjectCategory";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await connectToDatabase();

    // 1. Fetch projects respecting manual drag order (sortOrder) or creation order
    const projects = await Project.find()
      .sort({ sortOrder: 1, createdAt: -1, _id: -1 })
      .lean();

    const total = projects.length;

    // 2. Ensure all active projects have descending numbers (N down to 1) and ascending sortOrder (1 to N)
    const needsNormalization = projects.some(
      (p: any, idx: number) =>
        p.projectNumber !== total - idx || p.sortOrder !== idx + 1
    );

    if (needsNormalization && total > 0) {
      for (let i = 0; i < total; i++) {
        const assignedNumber = total - i;
        const assignedSort = i + 1;
        await Project.collection.updateOne(
          { _id: projects[i]._id },
          {
            $set: {
              projectNumber: assignedNumber,
              sortOrder: assignedSort,
              order: assignedSort,
            },
          }
        );
        projects[i].projectNumber = assignedNumber;
        projects[i].sortOrder = assignedSort;
        projects[i].order = assignedSort;
      }
    }

    const sanitized = projects.map((p: any, index: number) => ({
      ...p,
      id: p._id.toString(),
      _id: p._id.toString(),
      projectNumber: p.projectNumber ?? (total - index),
      sortOrder: p.sortOrder ?? (index + 1),
    }));

    return NextResponse.json(
      { success: true, projects: sanitized },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("❌ [Projects Fetch Error]:", error);
    const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 200 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      slug: customSlug,
      category = "Web",
      desc,
      fullDesc,
      liveUrl = "",
      githubUrl = "",
      clientUrl = "",
      serverUrl = "",
      playStoreUrl = "",
      appStoreUrl = "",
      appIconUrl = "",
      apkUrl = "",
      screenshots = [],
      images = [],
      image = "/Hero3DMe.png",
      tools = [],
      isFeatured = false,
    } = body;

    if (!title || !desc) {
      return NextResponse.json(
        { success: false, error: "Title and description are required." },
        { status: 400 }
      );
    }

    // Generate or sanitize slug
    const rawSlug = customSlug || title;
    const baseSlug = rawSlug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    await connectToDatabase();

    // Ensure slug is unique
    let finalSlug = baseSlug;
    const existing = await Project.findOne({ slug: finalSlug });
    if (existing) {
      finalSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    // Ensure category exists in ProjectCategory collection
    if (category && typeof category === "string" && category.trim()) {
      const catTrimmed = category.trim();
      if (catTrimmed.toLowerCase() !== "all") {
        const existingCat = await ProjectCategory.findOne({
          name: { $regex: new RegExp(`^${catTrimmed}$`, "i") },
        });
        if (!existingCat) {
          const catCount = await ProjectCategory.countDocuments();
          await ProjectCategory.create({
            name: catTrimmed,
            slug: catTrimmed.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            order: catCount + 1,
          });
        }
      }
    }

    // Check max 6 featured projects constraint
    const requestedFeatured = Boolean(isFeatured);
    if (requestedFeatured) {
      const activeFeaturedCount = await Project.countDocuments({ isFeatured: true });
      if (activeFeaturedCount >= 6) {
        return NextResponse.json(
          {
            success: false,
            error: "Maximum 6 projects can be featured on the Home section.",
          },
          { status: 400 }
        );
      }
    }

    // Shift all existing projects down in sortOrder so new project is placed on top (sortOrder: 1)
    await Project.updateMany(
      {},
      { $inc: { sortOrder: 1, order: 1 } }
    );

    const count = await Project.countDocuments();
    const newProjectNumber = count + 1;

    const newProject = await Project.create({
      title,
      slug: finalSlug,
      category: category ? category.trim() : "Web",
      desc,
      fullDesc: fullDesc || desc,
      liveUrl,
      githubUrl,
      clientUrl,
      serverUrl,
      playStoreUrl,
      appStoreUrl,
      appIconUrl: appIconUrl || "",
      apkUrl: apkUrl || "",
      screenshots: Array.isArray(screenshots)
        ? screenshots.filter(Boolean)
        : screenshots
        ? [screenshots]
        : [],
      images: Array.isArray(images)
        ? images.filter(Boolean)
        : images
        ? [images]
        : [],
      image: image || "/Hero3DMe.png",
      tools: Array.isArray(tools)
        ? tools
        : typeof tools === "string"
        ? tools.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [],
      isFeatured: requestedFeatured,
      order: 1,
      sortOrder: 1,
      projectNumber: newProjectNumber,
    });

    // Record activity audit log
    const { logActivity } = await import("@/ugaas/lib/audit");
    await logActivity(request, {
      action: "PROJECT_CREATE",
      category: "projects",
      description: `Created new project "${title}" (${finalSlug})`,
      resourceId: newProject._id.toString(),
      resourceName: title,
      details: {
        category,
        tools,
        isFeatured: Boolean(isFeatured),
        slug: finalSlug,
      },
    });

    try {
      revalidatePath("/");
      revalidatePath("/work");
    } catch (revErr) {
      console.warn("Revalidation warning:", revErr);
    }

    return NextResponse.json(
      {
        success: true,
        project: {
          ...newProject.toObject(),
          id: newProject._id.toString(),
          _id: newProject._id.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ [Project Creation Error]:", error);
    const message = error instanceof Error ? error.message : "Failed to create project";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

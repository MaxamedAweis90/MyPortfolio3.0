import { NextResponse } from "next/server";
import { connectToDatabase } from "@/ugaas/lib/db";
import { Project } from "@/ugaas/models/Project";
import { projectsData } from "@/data/portfolioData";

export async function GET() {
  try {
    await connectToDatabase();
    let projects = await Project.find().sort({ order: 1, createdAt: -1 }).lean();

    // If database is empty, auto-seed with projectsData
    if (!projects || projects.length === 0) {
      const formattedProjects = projectsData.map((p, index) => ({
        title: p.title,
        slug: p.slug,
        category: ["All", "Web", "Mobile", "Design"].includes(p.category)
          ? p.category
          : "Web",
        desc: p.description || p.shortTagline || p.title,
        fullDesc: p.longDescription?.join("\n\n") || p.description || "",
        liveUrl: p.liveProjectUrl || "",
        githubUrl: "",
        clientUrl: "",
        serverUrl: "",
        playStoreUrl: p.playStoreUrl || "",
        appStoreUrl: p.appStoreUrl || "",
        image:
          p.images?.[0] ||
          p.appIconUrl ||
          p.screenshots?.[0] ||
          "/Hero3DMe.png",
        tools: p.tools?.map((t) => t.title || "").filter(Boolean) || [],
        isFeatured: p.isFeatured ?? false,
        order: index + 1,
      }));

      await Project.insertMany(formattedProjects);
      projects = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
    }

    const sanitized = projects.map((p: any) => ({
      ...p,
      id: p._id.toString(),
      _id: p._id.toString(),
    }));

    return NextResponse.json({ success: true, projects: sanitized });
  } catch (error) {
    console.error("❌ [Projects Fetch Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
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

    const count = await Project.countDocuments();
    const newProject = await Project.create({
      title,
      slug: finalSlug,
      category,
      desc,
      fullDesc: fullDesc || desc,
      liveUrl,
      githubUrl,
      clientUrl,
      serverUrl,
      playStoreUrl,
      appStoreUrl,
      image: image || "/Hero3DMe.png",
      tools: Array.isArray(tools)
        ? tools
        : typeof tools === "string"
        ? tools.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [],
      isFeatured: Boolean(isFeatured),
      order: count + 1,
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

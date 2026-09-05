import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/ugaas/lib/db";
import { Experience } from "@/ugaas/models/Experience";
import { Certificate } from "@/ugaas/models/Certificate";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await connectToDatabase();
    const experiences = await Experience.find().sort({ order: 1, createdAt: -1 }).lean();
    const certificates = await Certificate.find().sort({ order: 1, createdAt: -1 }).lean();

    const sanitizedExperiences = experiences.map((e: any) => ({
      ...e,
      id: e._id.toString(),
      _id: e._id.toString(),
    }));

    const sanitizedCertificates = certificates.map((c: any) => ({
      ...c,
      id: c._id.toString(),
      _id: c._id.toString(),
    }));

    return NextResponse.json(
      {
        success: true,
        experiences: sanitizedExperiences,
        certificates: sanitizedCertificates,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("❌ [Experience Fetch Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch experience records" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      role,
      company,
      duration,
      badges = [],
      highlights = [],
      techStack = [],
      image = "",
      credentialUrl = "",
      credentialId = "",
      type = "career",
      order,
    } = body;

    if (!role || !company || !duration) {
      return NextResponse.json(
        { success: false, error: "Role, company, and duration are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const count = await Experience.countDocuments({ type });
    const newRecord = await Experience.create({
      role,
      company,
      duration,
      badges: Array.isArray(badges) ? badges : [badges].filter(Boolean),
      highlights: Array.isArray(highlights)
        ? highlights.filter(Boolean)
        : typeof highlights === "string"
        ? highlights.split("\n").filter(Boolean)
        : [],
      techStack: Array.isArray(techStack)
        ? techStack.filter(Boolean)
        : typeof techStack === "string"
        ? techStack.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [],
      image,
      credentialUrl,
      credentialId,
      type,
      order: order ?? count + 1,
    });

    // Record activity audit log
    const { logActivity } = await import("@/ugaas/lib/audit");
    await logActivity(request, {
      action: "EXPERIENCE_CREATE",
      category: "experience",
      description: `Created new ${type} record: "${role}" at "${company}"`,
      resourceId: newRecord._id.toString(),
      resourceName: `${role} - ${company}`,
      details: {
        type,
        duration,
        badges,
      },
    });

    try {
      revalidatePath("/");
      revalidatePath("/experience");
      revalidatePath("/about");
    } catch (revErr) {
      console.warn("Revalidation warning:", revErr);
    }

    return NextResponse.json(
      {
        success: true,
        experience: {
          ...newRecord.toObject(),
          id: newRecord._id.toString(),
          _id: newRecord._id.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ [Experience Create Error]:", error);
    const message = error instanceof Error ? error.message : "Failed to create record";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

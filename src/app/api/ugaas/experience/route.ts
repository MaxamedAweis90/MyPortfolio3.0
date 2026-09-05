import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/ugaas/lib/db";
import { Experience } from "@/ugaas/models/Experience";
import { Certificate } from "@/ugaas/models/Certificate";
import {
  experiencesData,
  educationData,
  certificationsData,
} from "@/data/experienceData";
import { certificatesData } from "@/data/portfolioData";

export async function GET() {
  try {
    await connectToDatabase();
    let experiences = await Experience.find().sort({ order: 1, createdAt: -1 }).lean();
    let certificates = await Certificate.find().sort({ order: 1, createdAt: -1 }).lean();

    // Auto-seed if both collections are empty
    if (!experiences || experiences.length === 0) {
      const formattedExperiences = [
        ...experiencesData.map((e, index) => ({
          role: e.role,
          company: e.company,
          duration: e.period || "Present",
          badges: [e.type].filter(Boolean),
          highlights: e.highlights || [],
          techStack: e.technologies || [],
          type: "career" as const,
          order: index + 1,
        })),
        ...educationData.map((ed, index) => ({
          role: ed.degree,
          company: ed.institution,
          duration: ed.period || "2022 - 2026",
          badges: [ed.location].filter(Boolean),
          highlights: ed.details ? [ed.details] : [],
          techStack: [],
          type: "education" as const,
          order: index + 10,
        })),
      ];
      await Experience.insertMany(formattedExperiences);
      experiences = await Experience.find().sort({ order: 1, createdAt: -1 }).lean();
    }

    if (!certificates || certificates.length === 0) {
      const allCerts: Array<{
        title: string;
        issuer: string;
        link?: string;
        code?: string;
        image?: string;
        category?: string;
      }> = [
        ...certificatesData.map((c) => ({
          title: c.title,
          issuer: c.issuer || "Certificate Authority",
          link: c.verificationUrl || "",
          code: c.verificationCode || "",
          image: c.imageUrl || "/Hero3DMe.png",
          category:
            typeof c.category === "object" && c.category?.title
              ? c.category.title
              : "Certification",
        })),
        ...certificationsData.map((c) => ({
          title: c.name,
          issuer: c.issuer || "Certificate Authority",
          link: "",
          code: "",
          image: "/Hero3DMe.png",
          category: "Certification",
        })),
      ];

      const uniqueCertsMap = new Map<string, (typeof allCerts)[number]>();
      allCerts.forEach((c) => {
        if (c && c.title && !uniqueCertsMap.has(c.title)) {
          uniqueCertsMap.set(c.title, c);
        }
      });

      const formattedCertificates = Array.from(uniqueCertsMap.values()).map(
        (c, index) => ({
          title: c.title,
          issuer: c.issuer,
          link: c.link || "",
          code: c.code || "",
          image: c.image || "/Hero3DMe.png",
          category: c.category || "Certification",
          order: index + 1,
        })
      );
      await Certificate.insertMany(formattedCertificates);
      certificates = await Certificate.find().sort({ order: 1, createdAt: -1 }).lean();
    }

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

    return NextResponse.json({
      success: true,
      experiences: sanitizedExperiences,
      certificates: sanitizedCertificates,
    });
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

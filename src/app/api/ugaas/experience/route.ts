import { NextResponse } from "next/server";
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
          duration: e.duration || (e as any).period || "2025 - Present",
          badges: e.badges || [(e as any).type].filter(Boolean),
          highlights: e.highlights || [],
          techStack: e.techStack || (e as any).technologies || [],
          type: "career" as const,
          order: index + 1,
        })),
        ...educationData.map((ed, index) => ({
          role: ed.role,
          company: ed.company,
          duration: ed.duration || (ed as any).period || "2021 - 2025",
          badges: ed.badges || [(ed as any).type].filter(Boolean),
          highlights: ed.highlights || [],
          techStack: ed.techStack || (ed as any).technologies || [],
          type: "education" as const,
          order: index + 10,
        })),
      ];
      await Experience.insertMany(formattedExperiences);
      experiences = await Experience.find().sort({ order: 1, createdAt: -1 }).lean();
    }

    if (!certificates || certificates.length === 0) {
      const allCerts = [...certificatesData, ...certificationsData];
      const uniqueCertsMap = new Map();
      allCerts.forEach((c) => {
        if (c && c.title && !uniqueCertsMap.has(c.title)) {
          uniqueCertsMap.set(c.title, c);
        }
      });

      const formattedCertificates = Array.from(uniqueCertsMap.values()).map(
        (c, index) => ({
          title: c.title,
          issuer: c.issuer,
          issueDate: c.date || c.issuedDate || "2024",
          credentialUrl: c.credentialUrl || c.link || c.verificationUrl || "",
          credentialId: c.credentialId || c.verificationCode || "",
          image: c.image || c.imageUrl || "/Hero3DMe.png",
          category: c.category?.title || c.category || "Development",
          skills: c.skills || [],
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

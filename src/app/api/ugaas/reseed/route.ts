import { NextResponse } from "next/server";
import { connectToDatabase } from "@/ugaas/lib/db";
import { Project } from "@/ugaas/models/Project";
import { Experience } from "@/ugaas/models/Experience";
import { Certificate } from "@/ugaas/models/Certificate";
import { projectsData, certificatesData } from "@/data/portfolioData";
import {
  experiencesData,
  educationData,
  certificationsData,
} from "@/data/experienceData";

export async function POST() {
  try {
    await connectToDatabase();

    // 1. Clear existing collections
    await Promise.all([
      Project.deleteMany({}),
      Experience.deleteMany({}),
      Certificate.deleteMany({}),
    ]);

    // 2. Map and Insert Projects
    const formattedProjects = projectsData.map((p, index) => ({
      title: p.title,
      slug: p.slug,
      category: p.category || "Web",
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

    // 3. Map and Insert Experiences & Education
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

    // 4. Map and Insert Certificates
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

    // Record activity audit log
    const { logActivity } = await import("@/ugaas/lib/audit");
    await logActivity(undefined, {
      action: "SYSTEM_RESEED",
      category: "system",
      description: "Reseeded database with default portfolio projects, experience, and certificates",
      details: {
        projectsCount: formattedProjects.length,
        experiencesCount: formattedExperiences.length,
        certificatesCount: formattedCertificates.length,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Database reseeded successfully with mock data",
      counts: {
        projects: formattedProjects.length,
        experiences: formattedExperiences.length,
        certificates: formattedCertificates.length,
      },
    });
  } catch (error) {
    console.error("❌ [Database Reseed Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reseed database" },
      { status: 500 }
    );
  }
}

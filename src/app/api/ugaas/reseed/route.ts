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
    const [delProjects, delExperiences, delCertificates] = await Promise.all([
      Project.deleteMany({}),
      Experience.deleteMany({}),
      Certificate.deleteMany({}),
    ]);

    // 2. Map and Insert Projects
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

    // 3. Map and Insert Experiences & Education
    const formattedExperiences = [
      ...experiencesData.map((e, index) => ({
        role: e.role,
        company: e.company,
        duration: e.duration,
        badges: e.badges || [],
        highlights: e.highlights || [],
        techStack: e.techStack || [],
        type: "career" as const,
        order: index + 1,
      })),
      ...educationData.map((ed, index) => ({
        role: ed.role,
        company: ed.company,
        duration: ed.duration,
        badges: ed.badges || [],
        highlights: ed.highlights || [],
        techStack: ed.techStack || [],
        type: "education" as const,
        order: index + 10,
      })),
    ];
    await Experience.insertMany(formattedExperiences);

    // 4. Map and Insert Certificates
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
        issueDate: c.date || "2024",
        credentialUrl: c.credentialUrl || c.link || "",
        credentialId: c.credentialId || "",
        image: c.image || c.img || "/Hero3DMe.png",
        category: c.category || "Development",
        skills: c.skills || [],
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

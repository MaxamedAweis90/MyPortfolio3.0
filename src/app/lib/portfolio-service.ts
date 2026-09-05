import { connectToDatabase } from "@/ugaas/lib/db";
import { Project as ProjectModel } from "@/ugaas/models/Project";
import { ProjectCategory as ProjectCategoryModel } from "@/ugaas/models/ProjectCategory";
import { Experience as ExperienceModel } from "@/ugaas/models/Experience";
import { Certificate as CertificateModel } from "@/ugaas/models/Certificate";
import { projectsData, certificatesData } from "@/data/portfolioData";
import { experiencesData, ExperienceItem } from "@/data/experienceData";
import type { Project, Tool, Certificate } from "@/types/portfolio";

/**
 * Maps a MongoDB Project document into the public portfolio's Project type.
 */
export function mapMongoProjectToPortfolio(doc: any): Project {
  const tools: Tool[] = Array.isArray(doc.tools)
    ? doc.tools.map((t: string | Tool) =>
        typeof t === "string" ? { title: t } : t
      )
    : [];

  const longDesc: string[] = doc.fullDesc
    ? doc.fullDesc.split("\n\n").filter(Boolean)
    : doc.longDescription || (doc.desc ? [doc.desc] : []);

  const primaryImage =
    doc.image ||
    doc.appIconUrl ||
    (doc.images && doc.images[0]) ||
    "/Hero3DMe.png";

  return {
    _id: doc._id?.toString() || doc.id || doc.slug,
    title: doc.title || "Untitled Project",
    slug: doc.slug,
    category: doc.category || "Web",
    tools,
    description: doc.desc || doc.description || "",
    shortTagline: doc.desc || doc.shortTagline || "",
    longDescription: longDesc,
    images: doc.images?.length ? doc.images : [primaryImage],
    appIconUrl: doc.appIconUrl || primaryImage,
    liveProjectUrl: doc.liveUrl || doc.liveProjectUrl || "",
    liveUrl: doc.liveUrl || doc.liveProjectUrl || "",
    githubUrl: doc.githubUrl || "",
    clientUrl: doc.clientUrl || "",
    serverUrl: doc.serverUrl || "",
    apkUrl: doc.apkUrl || "",
    playStoreUrl: doc.playStoreUrl || "",
    appStoreUrl: doc.appStoreUrl || "",
    screenshots: doc.screenshots?.length ? doc.screenshots : [primaryImage],
    isFeatured: Boolean(doc.isFeatured),
    isBest: Boolean(doc.isBest ?? doc.isFeatured),
    isPopular: Boolean(doc.isPopular ?? doc.isFeatured),
    popularity: doc.popularity ?? 95,
    projectNumber: doc.projectNumber !== undefined ? Number(doc.projectNumber) : undefined,
    sortOrder: doc.sortOrder !== undefined ? Number(doc.sortOrder) : (doc.order !== undefined ? Number(doc.order) : 0),
    createdAt: doc.createdAt
      ? new Date(doc.createdAt).toISOString()
      : new Date().toISOString(),
  };
}

/**
 * Maps a MongoDB Experience document into the public portfolio's ExperienceItem type.
 */
export function mapMongoExperienceToItem(doc: any): ExperienceItem {
  const companyShort = doc.company
    ? doc.company
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 4)
    : "EXP";

  return {
    id: doc._id?.toString() || doc.id || `exp-${Math.random()}`,
    role: doc.role || "Software Engineer",
    company: doc.company || "Company",
    companyShort,
    location: doc.badges?.[0] || "Banadir, Somalia",
    period: doc.duration || "Present",
    type: doc.badges?.[1] || doc.badges?.[0] || "Career Experience",
    badgeBg: "bg-blue-500/10",
    badgeColor: "text-blue-400 border-blue-500/30",
    highlights: doc.highlights || [],
    technologies: doc.techStack || [],
  };
}

/**
 * Fetches all active projects from MongoDB Atlas with fallback to static projectsData.
 */
export async function getPublicProjects(): Promise<Project[]> {
  try {
    await connectToDatabase();
    const docs = await ProjectModel.find()
      .sort({ sortOrder: 1, order: 1, createdAt: -1 })
      .lean();

    if (Array.isArray(docs)) {
      return docs.map(mapMongoProjectToPortfolio);
    }
  } catch (error) {
    console.warn("⚠️ [Portfolio Service] MongoDB fetch failed, using fallback projectsData:", error);
    return projectsData;
  }

  return [];
}

/**
 * Fetches a single project by slug from MongoDB Atlas with fallback to static projectsData.
 */
export async function getPublicProjectBySlug(slug: string): Promise<Project | null> {
  try {
    await connectToDatabase();
    const doc = await ProjectModel.findOne({ slug }).lean();
    if (doc) {
      return mapMongoProjectToPortfolio(doc);
    }
  } catch (error) {
    console.warn(`⚠️ [Portfolio Service] MongoDB fetch for slug '${slug}' failed:`, error);
  }

  // Fallback to static data
  const fallback = projectsData.find((p) => p.slug === slug);
  return fallback || null;
}

/**
 * Fetches career experiences from MongoDB Atlas with fallback to static experiencesData.
 */
export async function getPublicExperiences(): Promise<ExperienceItem[]> {
  try {
    await connectToDatabase();
    const docs = await ExperienceModel.find({ type: "career" })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    if (docs && docs.length > 0) {
      return docs.map(mapMongoExperienceToItem);
    }
  } catch (error) {
    console.warn("⚠️ [Portfolio Service] MongoDB experiences fetch failed, using fallback:", error);
  }

  return experiencesData;
}

/**
 * Fetches certificates from MongoDB Atlas with fallback to static certificatesData.
 */
export async function getPublicCertificates(): Promise<Certificate[]> {
  try {
    await connectToDatabase();
    const docs = await CertificateModel.find()
      .sort({ createdAt: -1 })
      .lean();

    if (docs && docs.length > 0) {
      return docs.map((c: any) => ({
        _id: c._id?.toString() || c.id,
        title: c.title,
        issuer: c.issuer || "Certificate Authority",
        issuedDate: c.createdAt ? new Date(c.createdAt).getFullYear().toString() : "2024",
        category: {
          _ref: c.category || "web",
          title: c.category || "Web Development",
        },
        imageUrl: c.image || "/Hero3DMe.png",
        link: c.link || "",
        verificationUrl: c.link || "",
        verificationCode: c.code || "",
      }));
    }
  } catch (error) {
    console.warn("⚠️ [Portfolio Service] MongoDB certificates fetch failed, using fallback:", error);
  }

  return certificatesData;
}

/**
 * Fetches active project categories from MongoDB Atlas with fallback.
 */
export async function getPublicProjectCategories(): Promise<string[]> {
  try {
    await connectToDatabase();
    const docs = await ProjectCategoryModel.find()
      .sort({ order: 1, createdAt: 1 })
      .lean();

    if (docs && docs.length > 0) {
      return docs.map((d: any) => d.name);
    }

    // Fallback: check distinct project categories in DB
    const distinct = await ProjectModel.distinct("category");
    if (distinct && distinct.length > 0) {
      const filtered = distinct.filter(
        (c: any) => typeof c === "string" && c.trim() && c.toLowerCase() !== "all"
      );
      if (filtered.length > 0) return filtered;
    }
  } catch (error) {
    console.warn("⚠️ [Portfolio Service] MongoDB categories fetch failed, using fallback:", error);
  }

  return ["Web", "Mobile", "Design"];
}

import { connectToDatabase } from "@portfolio/database";
import { Project as ProjectModel } from "@portfolio/database";
import { ProjectCategory as ProjectCategoryModel } from "@portfolio/database";
import { Experience as ExperienceModel } from "@portfolio/database";
import { Certificate as CertificateModel } from "@portfolio/database";
import {
  experiencesData,
  educationData,
  certificationsData,
  type ExperienceItem,
  type CertificateItem,
} from "@/data/experienceData";
import type { Project, Tool, Certificate } from "@portfolio/types";

import { normalizeImageUrl } from "./portfolio-mappers";
export { normalizeImageUrl };

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

  const primaryImage = normalizeImageUrl(
    doc.image ||
    doc.appIconUrl ||
    (doc.images && doc.images[0]) ||
    "/Hero3DMe.png"
  );

  const images = Array.isArray(doc.images) && doc.images.length > 0
    ? doc.images.map((img: string) => normalizeImageUrl(img))
    : [primaryImage];

  const screenshots = Array.isArray(doc.screenshots) && doc.screenshots.length > 0
    ? doc.screenshots.map((s: string) => normalizeImageUrl(s))
    : [primaryImage];

  return {
    _id: doc._id?.toString() || doc.id || doc.slug,
    title: doc.title || "Untitled Project",
    slug: doc.slug,
    category: doc.category || "Web",
    tools,
    description: doc.desc || doc.description || "",
    shortTagline: doc.desc || doc.shortTagline || "",
    longDescription: longDesc,
    images,
    appIconUrl: normalizeImageUrl(doc.appIconUrl) || primaryImage,
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
 * Fetches all active projects from MongoDB Atlas.
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
    console.error("❌ [Portfolio Service] MongoDB fetch failed:", error);
  }

  return [];
}

/**
 * Fetches a single project by slug from MongoDB Atlas.
 */
export async function getPublicProjectBySlug(slug: string): Promise<Project | null> {
  try {
    await connectToDatabase();
    const doc = await ProjectModel.findOne({ slug }).lean();
    if (doc) {
      return mapMongoProjectToPortfolio(doc);
    }
  } catch (error) {
    console.error(`❌ [Portfolio Service] MongoDB fetch for slug '${slug}' failed:`, error);
  }

  return null;
}

/**
 * Fetches career experiences from MongoDB Atlas.
 */
export async function getPublicExperiences(): Promise<ExperienceItem[]> {
  try {
    await connectToDatabase();
    const docs = await ExperienceModel.find({ type: "career" })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    if (Array.isArray(docs)) {
      return docs.map(mapMongoExperienceToItem);
    }
  } catch (error) {
    console.error("❌ [Portfolio Service] MongoDB experiences fetch failed:", error);
  }

  return [];
}

/**
 * Fetches certificates from MongoDB Atlas.
 */
export async function getPublicCertificates(): Promise<Certificate[]> {
  try {
    await connectToDatabase();
    const docs = await CertificateModel.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();

    if (Array.isArray(docs)) {
      return docs.map((c: any) => ({
        _id: c._id?.toString() || c.id,
        title: c.title,
        issuer: c.issuer || "Certificate Authority",
        issuedDate: c.createdAt ? new Date(c.createdAt).getFullYear().toString() : "2024",
        category: {
          _ref: c.category || "web",
          title: c.category || "Web Development",
        },
        imageUrl: normalizeImageUrl(c.image) || "/Hero3DMe.png",
        link: c.link || "",
        verificationUrl: c.link || "",
        verificationCode: c.code || "",
      }));
    }
  } catch (error) {
    console.error("❌ [Portfolio Service] MongoDB certificates fetch failed:", error);
  }

  return [];
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

/**
 * Fetches all experience sections (career, education, certifications)
 * directly from MongoDB Atlas with fallback.
 */
export async function getPublicExperiencePageData(): Promise<{
  experiences: ExperienceItem[];
  education: any[];
  certifications: CertificateItem[];
}> {
  try {
    await connectToDatabase();
    const [careerDocs, eduDocs, certExps, certDocs] = await Promise.all([
      ExperienceModel.find({ type: "career" }).sort({ order: 1, createdAt: -1 }).lean(),
      ExperienceModel.find({ type: "education" }).sort({ order: 1, createdAt: -1 }).lean(),
      ExperienceModel.find({ type: "certification" }).sort({ order: 1, createdAt: -1 }).lean(),
      CertificateModel.find().sort({ order: 1, createdAt: -1 }).lean(),
    ]);

    const experiences: ExperienceItem[] = (careerDocs || []).map((doc: any) => ({
      id: doc.id || doc._id?.toString(),
      role: doc.role,
      company: doc.company,
      companyShort:
        doc.company
          .split(" ")
          .map((w: string) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 4) || "EXP",
      location: doc.badges?.[0] || "Banadir, Somalia",
      period: doc.duration || "Present",
      type: doc.badges?.[1] || doc.badges?.[0] || "Career Experience",
      badgeBg: "bg-blue-500/10",
      badgeColor: "text-blue-400 border-blue-500/30",
      highlights: doc.highlights || [],
      technologies: doc.techStack || [],
    }));

    const education = (eduDocs || []).map((doc: any) => ({
      degree: doc.role,
      institution: doc.company,
      period: doc.duration,
      location: doc.badges?.[0] || "Somalia",
      details: doc.highlights?.[0] || "",
      relevantCourses: doc.techStack || [],
    }));

    const allCertItems: (CertificateItem & { order?: number })[] = [];

    (certDocs || []).forEach((c: any) => {
      const rawImg = c.image || "/Hero3DMe.png";
      const normalizedImg = normalizeImageUrl(rawImg);
      allCertItems.push({
        name: c.title,
        issuer: c.issuer || "Certificate Authority",
        date: c.createdAt ? new Date(c.createdAt).getFullYear().toString() : "2024",
        image: normalizedImg,
        pdfUrl: c.pdfUrl || (c.link?.endsWith(".pdf") ? c.link : (rawImg.endsWith(".pdf") ? normalizedImg : "/resume.pdf")),
        verifyUrl: c.link || c.credentialUrl || "",
        credentialId: c.code || c.credentialId || "",
        badge: c.category || "Professional Certification",
        category: c.category || "Certification",
        order: c.order || 0,
      });
    });

    (certExps || []).forEach((e: any) => {
      const rawImg = e.image || "/Hero3DMe.png";
      const normalizedImg = normalizeImageUrl(rawImg);
      allCertItems.push({
        name: e.role,
        issuer: e.company || "Certificate Authority",
        date: e.duration || "2024",
        image: normalizedImg,
        pdfUrl: rawImg.endsWith(".pdf") ? normalizedImg : "/resume.pdf",
        verifyUrl: e.credentialUrl || "",
        credentialId: e.credentialId || "",
        badge: e.badges?.[0] || "Verified Credential",
        category: e.badges?.[0] || "Certification",
        order: e.order || 0,
      });
    });

    // Deduplicate certificates by name
    const uniqueMap = new Map();
    allCertItems.forEach((item) => {
      if (item.name && !uniqueMap.has(item.name)) {
        uniqueMap.set(item.name, item);
      }
    });

    const certifications = Array.from(uniqueMap.values()).sort(
      (a: any, b: any) => (a.order || 0) - (b.order || 0)
    );

    return {
      experiences: experiences.length ? experiences : experiencesData,
      education: education.length ? education : educationData,
      certifications: certifications.length ? certifications : certificationsData,
    };
  } catch (error) {
    console.error("❌ [Portfolio Service] Failed to load experience page data from DB:", error);
    return {
      experiences: experiencesData,
      education: educationData,
      certifications: certificationsData,
    };
  }
}


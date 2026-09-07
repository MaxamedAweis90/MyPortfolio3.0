import type { ExperienceItem } from "@/data/experienceData";
import type { Project, Tool } from "@portfolio/types";

/**
 * Pure client-safe data mapper for MongoDB Project documents.
 * Contains ZERO server/database dependencies.
 */
export function mapMongoProjectToPortfolio(doc: any): Project {
  if (!doc) return {} as Project;

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
 * Pure client-safe data mapper for MongoDB Experience documents.
 * Contains ZERO server/database dependencies.
 */
export function mapMongoExperienceToItem(doc: any): ExperienceItem {
  if (!doc) return {} as ExperienceItem;

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
    period: doc.duration || doc.period || "Present",
    type: doc.badges?.[1] || doc.badges?.[0] || doc.type || "Career Experience",
    badgeBg: doc.badgeBg || "bg-blue-500/10",
    badgeColor: doc.badgeColor || "text-blue-400 border-blue-500/30",
    highlights: doc.highlights || [],
    technologies: doc.techStack || doc.technologies || [],
  };
}

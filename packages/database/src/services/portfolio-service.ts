import { unstable_cache } from "next/cache";
import { connectToDatabase } from "../db";
import { Settings } from "../Settings";
import { Experience } from "../Experience";
import { Project } from "../Project";
import { Certificate } from "../Certificate";

/**
 * Helper to ensure lean Mongoose documents are 100% JSON-serializable
 * (converting ObjectIds and Dates to primitive strings to prevent Next.js RSC warnings).
 */
function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

/**
 * Cached database query wrapper for Portfolio Settings.
 * - Cache tag: 'portfolio-settings'
 * - TTL: 86400s (24 hours)
 */
export const getCachedSettings = unstable_cache(
  async () => {
    await connectToDatabase();
    const settingsDoc = await Settings.findOne().lean();
    return settingsDoc ? serialize(settingsDoc) : null;
  },
  ["portfolio-settings-cache"],
  {
    tags: ["portfolio-settings"],
    revalidate: 86400,
  }
);

/**
 * Cached database query wrapper for Published Experiences.
 * - Cache tag: 'portfolio-experience'
 * - Query: { isPublished: true } (including fallback for unflagged legacy documents)
 * - Sorted by: order: 1
 */
export const getCachedExperiences = unstable_cache(
  async () => {
    await connectToDatabase();
    const experiences = await Experience.find({
      $or: [{ isPublished: true }, { isPublished: { $exists: false } }],
    })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return serialize(experiences);
  },
  ["portfolio-experience-cache"],
  {
    tags: ["portfolio-experience"],
  }
);

/**
 * Cached database query wrapper for Featured Projects.
 * - Cache tag: 'portfolio-projects'
 * - Query: { isFeatured: true }
 * - Sorted by: order: 1
 */
export const getCachedProjects = unstable_cache(
  async () => {
    await connectToDatabase();
    const projects = await Project.find({ isFeatured: true })
      .sort({ order: 1, sortOrder: 1, createdAt: -1 })
      .lean();

    return serialize(projects);
  },
  ["portfolio-projects-cache"],
  {
    tags: ["portfolio-projects"],
  }
);

/**
 * Cached database query wrapper for All Projects (for full catalogue/gallery views).
 * - Cache tag: 'portfolio-projects'
 * - Sorted by: order: 1
 */
export const getCachedAllProjects = unstable_cache(
  async () => {
    await connectToDatabase();
    const projects = await Project.find()
      .sort({ order: 1, sortOrder: 1, createdAt: -1 })
      .lean();

    return serialize(projects);
  },
  ["portfolio-all-projects-cache"],
  {
    tags: ["portfolio-projects"],
  }
);

/**
 * Cached database query wrapper for Certificates.
 * - Cache tag: 'portfolio-certificates'
 * - Sorted by: order: 1
 */
export const getCachedCertificates = unstable_cache(
  async () => {
    await connectToDatabase();
    const certificates = await Certificate.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return serialize(certificates);
  },
  ["portfolio-certificates-cache"],
  {
    tags: ["portfolio-certificates"],
  }
);

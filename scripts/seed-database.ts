import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";

// 1. Load environment variables from .env.local and .env
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { Project } from "../src/ugaas/models/Project";
import { Experience } from "../src/ugaas/models/Experience";
import { Certificate } from "../src/ugaas/models/Certificate";
import { projectsData, certificatesData } from "../src/app/data/portfolioData";
import {
  experiencesData,
  educationData,
  certificationsData,
} from "../src/app/data/experienceData";

async function seedDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error(
      "❌ [Seed Error] MONGODB_URI is not defined. Please check your .env.local file."
    );
    process.exit(1);
  }

  console.log("🌱 [Seed] Starting MongoDB database migration...");
  console.log("⏳ [Seed] Connecting to MongoDB Atlas...");

  try {
    await mongoose.connect(uri);
    console.log("✅ [Seed] Connected to database:", mongoose.connection.name);

    // 2. Clear existing collections
    console.log("🧹 [Seed] Clearing existing collections...");
    const [delProjects, delExperiences, delCertificates] = await Promise.all([
      Project.deleteMany({}),
      Experience.deleteMany({}),
      Certificate.deleteMany({}),
    ]);
    console.log(
      `🗑️  [Seed] Cleared: ${delProjects.deletedCount} projects, ${delExperiences.deletedCount} experiences, ${delCertificates.deletedCount} certificates.`
    );

    // 3. Map and Insert Projects
    console.log("📦 [Seed] Importing projects from portfolioData.ts...");
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

    const insertedProjects = await Project.insertMany(formattedProjects);
    console.log(`✅ [Seed] Successfully imported ${insertedProjects.length} projects.`);

    // 4. Map and Insert Certificates
    console.log("📜 [Seed] Importing certificates from portfolioData.ts...");
    const formattedCertificates = certificatesData.map((c, index) => ({
      title: c.title,
      issuer: c.issuer || "Tech Hub",
      code: c.verificationCode || "",
      link: c.verificationUrl || c.link || "",
      image: c.imageUrl || "/myProfile.png",
      category: c.category?.title || "Certification",
      order: index + 1,
    }));

    const insertedCertificates = await Certificate.insertMany(formattedCertificates);
    console.log(`✅ [Seed] Successfully imported ${insertedCertificates.length} certificates.`);

    // 5. Map and Insert Experiences (Career, Education, Certifications)
    console.log("💼 [Seed] Importing experiences, education, and certifications from experienceData.ts...");
    
    // Career items
    const careerDocs = experiencesData.map((e, index) => ({
      role: e.role,
      company: e.company,
      duration: e.period,
      badges: [e.type, e.companyShort].filter(Boolean),
      highlights: e.highlights || [],
      techStack: e.technologies || [],
      type: "career" as const,
      order: index + 1,
    }));

    // Education items
    const educationDocs = educationData.map((ed, index) => ({
      role: ed.degree,
      company: ed.institution,
      duration: ed.period,
      badges: [ed.location].filter(Boolean),
      highlights: ed.details ? [ed.details] : [],
      techStack: [],
      type: "education" as const,
      order: careerDocs.length + index + 1,
    }));

    // Certifications items
    const certificationDocs = certificationsData.map((cd, index) => ({
      role: cd.name,
      company: cd.issuer,
      duration: cd.date,
      badges: [],
      highlights: [],
      techStack: [],
      type: "certification" as const,
      order: careerDocs.length + educationDocs.length + index + 1,
    }));

    const allExperienceDocs = [
      ...careerDocs,
      ...educationDocs,
      ...certificationDocs,
    ];

    const insertedExperiences = await Experience.insertMany(allExperienceDocs);
    console.log(
      `✅ [Seed] Successfully imported ${insertedExperiences.length} total experience records (` +
      `${careerDocs.length} careers, ${educationDocs.length} education, ${certificationDocs.length} certifications).`
    );

    // 6. Summary Report
    console.log("\n================ MIGRATION SUMMARY ================");
    console.log(`📁 Projects imported:      ${insertedProjects.length}`);
    console.log(`📜 Certificates imported:  ${insertedCertificates.length}`);
    console.log(`💼 Experiences imported:   ${insertedExperiences.length}`);
    console.log("===================================================\n");
    console.log("🎉 [Seed] Database seeding completed successfully!");

  } catch (error) {
    console.error("❌ [Seed Error] An error occurred during database seeding:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 [Seed] Disconnected from MongoDB.");
    process.exit(0);
  }
}

seedDatabase();

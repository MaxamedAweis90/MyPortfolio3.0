import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { put } from "@vercel/blob";

// 1. Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { Project, Certificate, Settings } from "../packages/database/src";

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing in .env.local");
  process.exit(1);
}

if (!BLOB_TOKEN) {
  console.error("❌ BLOB_READ_WRITE_TOKEN is missing in .env.local");
  process.exit(1);
}

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".pdf":
      return "application/pdf";
    default:
      return "application/octet-stream";
  }
}

// Map to cache uploaded files so we don't re-upload duplicate references
const uploadedCache = new Map<string, string>();

async function uploadLocalPathToBlob(rawPath: string): Promise<string> {
  if (!rawPath) return rawPath;
  if (rawPath.startsWith("http://") || rawPath.startsWith("https://")) {
    // If it's an old private blob URL, convert to /api/blob
    if (rawPath.includes(".private.blob.vercel-storage.com/")) {
      const parts = rawPath.split(".private.blob.vercel-storage.com/");
      return `/api/blob/${parts[1]}`;
    }
    return rawPath;
  }

  if (uploadedCache.has(rawPath)) {
    return uploadedCache.get(rawPath)!;
  }

  // Clean relative path: e.g. "/uploads/banners/..." -> "uploads/banners/..."
  const cleanRelative = rawPath.replace(/^\/+/, "");

  // Candidate paths on disk
  const searchCandidates = [
    path.resolve(process.cwd(), "apps", "web", "public", cleanRelative),
    path.resolve(process.cwd(), "apps", "admin", "public", cleanRelative),
    path.resolve(process.cwd(), "public", cleanRelative),
  ];

  let localFilePath: string | null = null;
  for (const candidate of searchCandidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      localFilePath = candidate;
      break;
    }
  }

  if (!localFilePath) {
    console.warn(`⚠️ [File Not Found on Disk]: ${rawPath}`);
    return rawPath;
  }

  try {
    const fileBuffer = fs.readFileSync(localFilePath);
    const contentType = getMimeType(localFilePath);
    const blobPathname = cleanRelative; // e.g. uploads/banners/filename.png

    console.log(`📤 Uploading to Vercel Blob (engaweis-blob): ${blobPathname} (${(fileBuffer.length / 1024).toFixed(1)} KB)...`);
    
    const blob = await put(blobPathname, fileBuffer, {
      access: "private",
      addRandomSuffix: false,
      token: BLOB_TOKEN,
      contentType,
      allowOverwrite: true,
    });

    const servedUrl = `/api/blob/${cleanRelative}`;
    console.log(`✅ [Blob Success]: ${rawPath} -> ${blob.url}\n   Public Proxy URL: ${servedUrl}`);
    uploadedCache.set(rawPath, servedUrl);
    return servedUrl;
  } catch (error) {
    console.error(`❌ [Blob Upload Failed] for ${rawPath}:`, error);
    throw error;
  }
}

function getAllUploadFiles(dir: string, baseDir: string = dir): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === ".gitkeep") continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllUploadFiles(fullPath, baseDir));
    } else if (stat.isFile()) {
      const relPath = path.relative(baseDir, fullPath).replace(/\\/g, "/");
      results.push(relPath);
    }
  }
  return results;
}

async function runMigration() {
  console.log("🚀 [Migration] Starting Vercel Blob Migration for Portfolio...");
  console.log("⏳ Connecting to MongoDB Atlas...");
  await mongoose.connect(MONGODB_URI!);
  console.log("✅ Connected to MongoDB Atlas\n");

  // --- Step 1: Pre-upload all local files in apps/web/public/uploads ---
  const uploadsDir = path.resolve(process.cwd(), "apps", "web", "public", "uploads");
  const allUploads = getAllUploadFiles(uploadsDir);
  console.log(`📦 Found ${allUploads.length} files in local public/uploads directory. Uploading all to engaweis-blob...`);

  for (const relFile of allUploads) {
    const virtualPath = `/uploads/${relFile}`;
    await uploadLocalPathToBlob(virtualPath);
  }

  // --- Step 2: Migrate Projects ---
  const projects = await Project.find({});
  console.log(`\n📂 Found ${projects.length} projects in database.`);

  for (const project of projects) {
    let modified = false;
    console.log(`\n🔍 Checking Project: "${project.title}"`);

    // Banner image
    if (project.image) {
      const newUrl = await uploadLocalPathToBlob(project.image);
      if (newUrl !== project.image) {
        project.image = newUrl;
        modified = true;
      }
    }

    // App Icon
    if (project.appIconUrl) {
      const newUrl = await uploadLocalPathToBlob(project.appIconUrl);
      if (newUrl !== project.appIconUrl) {
        project.appIconUrl = newUrl;
        modified = true;
      }
    }

    // Desktop/Carousel images
    if (Array.isArray(project.images) && project.images.length > 0) {
      const updatedImages: string[] = [];
      for (const img of project.images) {
        if (img) {
          const newUrl = await uploadLocalPathToBlob(img);
          updatedImages.push(newUrl);
          if (newUrl !== img) modified = true;
        }
      }
      project.images = updatedImages;
    }

    // Screenshots
    if (Array.isArray(project.screenshots) && project.screenshots.length > 0) {
      const updatedScreenshots: string[] = [];
      for (const ss of project.screenshots) {
        if (ss) {
          const newUrl = await uploadLocalPathToBlob(ss);
          updatedScreenshots.push(newUrl);
          if (newUrl !== ss) modified = true;
        }
      }
      project.screenshots = updatedScreenshots;
    }

    if (modified) {
      await project.save();
      console.log(`💾 Saved updated Project: "${project.title}"`);
    } else {
      console.log(`✨ Project "${project.title}" already up to date.`);
    }
  }

  // --- Step 3: Migrate Certificates ---
  const certificates = await Certificate.find({});
  console.log(`\n📜 Found ${certificates.length} certificates in database.`);

  for (const cert of certificates) {
    let modified = false;
    if (cert.image) {
      const newUrl = await uploadLocalPathToBlob(cert.image);
      if (newUrl !== cert.image) {
        cert.image = newUrl;
        modified = true;
      }
    }

    if (modified) {
      await cert.save();
      console.log(`💾 Saved updated Certificate: "${cert.title}"`);
    }
  }

  // --- Step 4: Migrate Settings ---
  const settingsList = await Settings.find({});
  for (const setting of settingsList) {
    let modified = false;
    if (setting.avatarUrl) {
      const newUrl = await uploadLocalPathToBlob(setting.avatarUrl);
      if (newUrl !== setting.avatarUrl) {
        setting.avatarUrl = newUrl;
        modified = true;
      }
    }
    if (setting.resumeUrl) {
      const newUrl = await uploadLocalPathToBlob(setting.resumeUrl);
      if (newUrl !== setting.resumeUrl) {
        setting.resumeUrl = newUrl;
        modified = true;
      }
    }
    if (modified) {
      await setting.save();
      console.log("💾 Saved updated Settings.");
    }
  }

  console.log("\n🎉 [Migration Completed Successfully!]");
  console.log(`Total unique files uploaded to Vercel Blob (engaweis-blob): ${uploadedCache.size}`);
  for (const [local, remote] of uploadedCache.entries()) {
    console.log(` - ${local} -> ${remote}`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

runMigration().catch((err) => {
  console.error("❌ Migration fatal error:", err);
  process.exit(1);
});

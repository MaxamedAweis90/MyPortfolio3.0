import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import path from "path";
import fs from "fs/promises";

export const dynamic = "force-dynamic";

// Maximum 15MB file limit
const MAX_FILE_SIZE = 15 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  // Images
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
  // Documents / Resumes
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/octet-stream",
  "text/plain",
]);

const ALLOWED_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
  "svg",
  "avif",
  "pdf",
  "doc",
  "docx",
  "txt",
]);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "resumes";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file was uploaded." },
        { status: 400 }
      );
    }

    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";

    if (!ALLOWED_MIME_TYPES.has(file.type) && !ALLOWED_EXTENSIONS.has(fileExtension)) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported file type (${file.type || fileExtension}). Allowed types: PDF, DOC, DOCX, PNG, JPG, WebP, SVG.`,
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "File size exceeds the 15MB limit.",
        },
        { status: 400 }
      );
    }

    // Sanitize filename
    const originalName = file.name || "upload";
    const sanitizedBase = originalName
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, "-")
      .replace(/-+/g, "-");
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const filename = `${folder}/${uniqueSuffix}-${sanitizedBase}`;

    // 1. Check if Vercel Blob Token is configured
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

    if (blobToken) {
      try {
        const blob = await put(filename, file, {
          access: "public",
          addRandomSuffix: false,
          token: blobToken,
        });

        return NextResponse.json({
          success: true,
          url: blob.url,
          storage: "vercel-blob",
          size: file.size,
          contentType: file.type,
        });
      } catch (blobError) {
        console.warn("⚠️ [Upload] Vercel Blob upload failed, trying local fallback:", blobError);
        // If Vercel Blob fails (e.g. invalid token), we gracefully fallback to local disk storage
      }
    }

    // 2. Local fallback storage (public/uploads/) for local development without Vercel Blob configured yet
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    await fs.mkdir(uploadDir, { recursive: true });

    const localFileName = `${uniqueSuffix}-${sanitizedBase}`;
    const localFilePath = path.join(uploadDir, localFileName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(localFilePath, buffer);

    const publicUrl = `/uploads/${folder}/${localFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      storage: "local-fallback",
      message: blobToken
        ? "Saved locally as fallback."
        : "Saved locally. Add BLOB_READ_WRITE_TOKEN to .env.local to use Vercel Blob.",
      size: file.size,
      contentType: file.type,
    });
  } catch (error) {
    console.error("❌ [Upload Route Error]:", error);
    const message = error instanceof Error ? error.message : "Failed to upload file";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

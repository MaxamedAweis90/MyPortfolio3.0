import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import path from "path";
import fs from "fs/promises";

export const dynamic = "force-dynamic";

// Maximum 10MB file limit
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
]);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "projects";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file was uploaded." },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported file type (${file.type}). Please upload PNG, JPG, WebP, SVG, or GIF.`,
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "File size exceeds the 10MB limit.",
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

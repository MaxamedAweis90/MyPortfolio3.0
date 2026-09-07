import { NextResponse } from "next/server";
import { get } from "@vercel/blob";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await context.params;
    if (!pathSegments || pathSegments.length === 0) {
      return new NextResponse("Blob pathname is required", { status: 400 });
    }

    const rawPathname = pathSegments.join("/");
    const pathname = rawPathname.replace(/^\/+/, "");

    const token = process.env.BLOB_READ_WRITE_TOKEN;

    // 1. Fetch from Vercel Blob private storage using server token
    if (token) {
      try {
        const result = await get(pathname, {
          access: "private",
          token,
        });

        if (result && result.statusCode === 200) {
          const contentType = result.blob.contentType || "application/octet-stream";
          return new NextResponse(result.stream, {
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "public, max-age=31536000, immutable",
              ...(result.blob.etag ? { ETag: result.blob.etag } : {}),
            },
          });
        }
      } catch (blobErr) {
        console.warn(`[Blob Proxy] Vercel Blob get failed for "${pathname}":`, blobErr);
      }
    }

    // 2. Fallback to local filesystem only during local development
    if (process.env.NODE_ENV === "development") {
      try {
        const path = await import("path");
        const fs = await import("fs/promises");
        const fsSync = await import("fs");

        const localCandidates = [
          path.join(process.cwd(), "public", pathname),
          path.join(process.cwd(), "public", "uploads", pathname.replace(/^uploads\//, "")),
          path.join(process.cwd(), "..", "..", "apps", "admin", "public", pathname),
        ];

        for (const candidate of localCandidates) {
          if (fsSync.existsSync(candidate) && fsSync.statSync(candidate).isFile()) {
            const fileBuffer = await fs.readFile(candidate);
            const ext = path.extname(candidate).toLowerCase();
            let mime = "application/octet-stream";
            if (ext === ".png") mime = "image/png";
            else if (ext === ".jpg" || ext === ".jpeg") mime = "image/jpeg";
            else if (ext === ".webp") mime = "image/webp";
            else if (ext === ".svg") mime = "image/svg+xml";
            else if (ext === ".pdf") mime = "application/pdf";

            return new NextResponse(fileBuffer, {
              headers: {
                "Content-Type": mime,
                "Cache-Control": "public, max-age=31536000, immutable",
              },
            });
          }
        }
      } catch {
        // ignore dev filesystem error
      }
    }

    return new NextResponse("File Not Found", { status: 404 });
  } catch (error) {
    console.error("[Blob Proxy Route Error]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

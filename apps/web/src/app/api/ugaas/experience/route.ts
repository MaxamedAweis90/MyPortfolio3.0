import { NextResponse } from "next/server";
import { getPublicExperiencePageData } from "@/lib/portfolio-service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const data = await getPublicExperiencePageData();
    return NextResponse.json(
      {
        success: true,
        experiences: data.experiences,
        education: data.education,
        certificates: data.certifications,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load experience records" },
      { status: 500 }
    );
  }
}

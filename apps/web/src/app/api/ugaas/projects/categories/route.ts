import { NextResponse } from "next/server";
import { getPublicProjectCategories } from "@/lib/portfolio-service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const categories = await getPublicProjectCategories();
    return NextResponse.json({
      success: true,
      categories: categories.map((c) => ({ name: c })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load categories" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { connectToDatabase } from "@/ugaas/lib/db";
import { ProjectCategory } from "@/ugaas/models/ProjectCategory";
import { Project } from "@/ugaas/models/Project";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function escapeRegex(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

// GET /api/ugaas/projects/categories
export async function GET() {
  try {
    await connectToDatabase();

    let categories = await ProjectCategory.find()
      .sort({ order: 1, createdAt: 1 })
      .lean();

    // Auto-seed only if collection has NEVER been seeded
    if (!categories || categories.length === 0) {
      const distinctProjectCats = await Project.distinct("category");
      const initialSet = new Set<string>(["Web", "Mobile", "Design"]);

      if (Array.isArray(distinctProjectCats)) {
        distinctProjectCats.forEach((c) => {
          if (c && typeof c === "string" && c.trim() && c.toLowerCase() !== "all") {
            initialSet.add(c.trim());
          }
        });
      }

      const seedData = Array.from(initialSet).map((name, index) => ({
        name,
        slug: slugify(name),
        order: index + 1,
      }));

      await ProjectCategory.insertMany(seedData);
      categories = await ProjectCategory.find()
        .sort({ order: 1, createdAt: 1 })
        .lean();
    }

    // Attach live project counts to each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat: any) => {
        const count = await Project.countDocuments({
          category: { $regex: new RegExp(`^\\s*${escapeRegex(cat.name)}\\s*$`, "i") },
        });

        return {
          id: cat._id.toString(),
          _id: cat._id.toString(),
          name: cat.name,
          slug: cat.slug,
          order: cat.order || 0,
          projectCount: count,
          createdAt: cat.createdAt,
          updatedAt: cat.updatedAt,
        };
      })
    );

    return NextResponse.json(
      {
        success: true,
        categories: categoriesWithCount,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error("❌ [Categories GET Error]:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

// POST /api/ugaas/projects/categories
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawName = body?.name;

    if (!rawName || typeof rawName !== "string" || !rawName.trim()) {
      return NextResponse.json(
        { success: false, error: "Category name is required." },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const trimmedName = rawName.trim();
    if (trimmedName.toLowerCase() === "all") {
      return NextResponse.json(
        { success: false, error: "'All' is a reserved category keyword." },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    await connectToDatabase();

    const existing = await ProjectCategory.findOne({
      name: { $regex: new RegExp(`^\\s*${escapeRegex(trimmedName)}\\s*$`, "i") },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: `Category "${trimmedName}" already exists.` },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const slug = slugify(trimmedName);
    const totalCount = await ProjectCategory.countDocuments();

    const created = await ProjectCategory.create({
      name: trimmedName,
      slug,
      order: totalCount + 1,
    });

    // Revalidate public routes
    try {
      revalidatePath("/");
      revalidatePath("/work");
    } catch {}

    return NextResponse.json(
      {
        success: true,
        category: {
          id: created._id.toString(),
          _id: created._id.toString(),
          name: created.name,
          slug: created.slug,
          order: created.order,
          projectCount: 0,
        },
        message: `Category "${trimmedName}" created successfully.`,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error("❌ [Categories POST Error]:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

// PUT /api/ugaas/projects/categories
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, oldName, name } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "New category name is required." },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const newName = name.trim();
    if (newName.toLowerCase() === "all") {
      return NextResponse.json(
        { success: false, error: "'All' is a reserved category keyword." },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    await connectToDatabase();

    let categoryDoc = null;
    if (id && mongoose.Types.ObjectId.isValid(id)) {
      categoryDoc = await ProjectCategory.findById(id);
    }
    if (!categoryDoc && oldName) {
      categoryDoc = await ProjectCategory.findOne({
        name: { $regex: new RegExp(`^\\s*${escapeRegex(oldName.trim())}\\s*$`, "i") },
      });
    }
    if (!categoryDoc && id) {
      categoryDoc = await ProjectCategory.findOne({
        $or: [
          { name: { $regex: new RegExp(`^\\s*${escapeRegex(id.trim())}\\s*$`, "i") } },
          { slug: slugify(id) },
        ],
      });
    }

    if (!categoryDoc) {
      return NextResponse.json(
        { success: false, error: "Category not found." },
        { status: 404, headers: NO_CACHE_HEADERS }
      );
    }

    const previousName = categoryDoc.name;

    // Check if new name already exists on another category
    const duplicate = await ProjectCategory.findOne({
      _id: { $ne: categoryDoc._id },
      name: { $regex: new RegExp(`^\\s*${escapeRegex(newName)}\\s*$`, "i") },
    });

    if (duplicate) {
      return NextResponse.json(
        { success: false, error: `Category "${newName}" already exists.` },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    categoryDoc.name = newName;
    categoryDoc.slug = slugify(newName);
    await categoryDoc.save();

    // Cascade update to all projects currently using previous name
    await Project.updateMany(
      { category: { $regex: new RegExp(`^\\s*${escapeRegex(previousName)}\\s*$`, "i") } },
      { category: newName }
    );

    try {
      revalidatePath("/");
      revalidatePath("/work");
    } catch {}

    const projectCount = await Project.countDocuments({
      category: { $regex: new RegExp(`^\\s*${escapeRegex(newName)}\\s*$`, "i") },
    });

    return NextResponse.json(
      {
        success: true,
        category: {
          id: categoryDoc._id.toString(),
          _id: categoryDoc._id.toString(),
          name: categoryDoc.name,
          slug: categoryDoc.slug,
          order: categoryDoc.order,
          projectCount,
        },
        message: `Category updated from "${previousName}" to "${newName}".`,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error("❌ [Categories PUT Error]:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

// DELETE /api/ugaas/projects/categories
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");
    let name = searchParams.get("name");
    let reassignTo = searchParams.get("reassignTo");

    // Support JSON body as alternative
    if (!id && !name) {
      try {
        const body = await request.json();
        id = body?.id;
        name = body?.name;
        if (body?.reassignTo) reassignTo = body.reassignTo;
      } catch {}
    }

    await connectToDatabase();

    let categoryDoc = null;
    if (id && mongoose.Types.ObjectId.isValid(id)) {
      categoryDoc = await ProjectCategory.findById(id);
    }
    if (!categoryDoc && name) {
      categoryDoc = await ProjectCategory.findOne({
        name: { $regex: new RegExp(`^\\s*${escapeRegex(name.trim())}\\s*$`, "i") },
      });
    }
    if (!categoryDoc && id) {
      categoryDoc = await ProjectCategory.findOne({
        $or: [
          { name: { $regex: new RegExp(`^\\s*${escapeRegex(id.trim())}\\s*$`, "i") } },
          { slug: slugify(id) },
        ],
      });
    }

    if (!categoryDoc) {
      return NextResponse.json(
        { success: false, error: "Category not found in database." },
        { status: 404, headers: NO_CACHE_HEADERS }
      );
    }

    const totalRemaining = await ProjectCategory.countDocuments();
    if (totalRemaining <= 1) {
      return NextResponse.json(
        { success: false, error: "Cannot delete the only remaining category." },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const categoryNameToDelete = categoryDoc.name;

    // Determine safe fallback category to reassign tagged projects to
    const otherCategory = await ProjectCategory.findOne({
      _id: { $ne: categoryDoc._id },
    });

    const fallbackCategory =
      reassignTo &&
      reassignTo.trim() &&
      reassignTo.trim().toLowerCase() !== categoryNameToDelete.toLowerCase()
        ? reassignTo.trim()
        : otherCategory?.name || "General";

    // 1. Delete the category document
    await ProjectCategory.findByIdAndDelete(categoryDoc._id);

    // 2. Reassign projects that used this category
    await Project.updateMany(
      {
        category: {
          $regex: new RegExp(`^\\s*${escapeRegex(categoryNameToDelete)}\\s*$`, "i"),
        },
      },
      { category: fallbackCategory }
    );

    // 3. Revalidate public cache
    try {
      revalidatePath("/");
      revalidatePath("/work");
    } catch {}

    return NextResponse.json(
      {
        success: true,
        message: `Category "${categoryNameToDelete}" deleted. Associated projects reassigned to "${fallbackCategory}".`,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error("❌ [Categories DELETE Error]:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

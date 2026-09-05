import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { connectToDatabase } from "@/ugaas/lib/db";
import { Project } from "@/ugaas/models/Project";

export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Items array is required for reordering" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const bulkOps = items.map(
      (item: { id: string; sortOrder: number; projectNumber?: number }) => {
        const isObjectId = mongoose.Types.ObjectId.isValid(item.id);
        const query = isObjectId
          ? { $or: [{ _id: new mongoose.Types.ObjectId(item.id) }, { _id: item.id }] }
          : { slug: item.id };
        const newOrder = Number(item.sortOrder) || 1;
        const newNum =
          Number(item.projectNumber !== undefined ? item.projectNumber : item.sortOrder) ||
          newOrder;

        return {
          updateOne: {
            filter: query,
            update: {
              $set: {
                sortOrder: newOrder,
                order: newOrder,
                projectNumber: newNum,
              },
            },
          },
        };
      }
    );

    await Project.bulkWrite(bulkOps);

    try {
      revalidatePath("/ugaas/projects");
      revalidatePath("/");
      revalidatePath("/work");
    } catch {}

    return NextResponse.json(
      {
        success: true,
        message: "Projects display order updated successfully.",
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("❌ [Project Reorder Error]:", error);
    const message =
      error instanceof Error ? error.message : "Failed to reorder projects";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

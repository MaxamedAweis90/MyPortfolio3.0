import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { connectToDatabase } from "@/ugaas/lib/db";
import { Experience } from "@/ugaas/models/Experience";
import { Certificate } from "@/ugaas/models/Certificate";

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

    const experienceBulkOps: any[] = [];
    const certificateBulkOps: any[] = [];

    items.forEach((item: { id: string; order: number }) => {
      if (!item.id) return;
      const isObjectId = mongoose.Types.ObjectId.isValid(item.id);
      const query = isObjectId
        ? { _id: new mongoose.Types.ObjectId(item.id) }
        : { _id: item.id };
      const newOrder = Number(item.order) || 0;

      const op = {
        updateOne: {
          filter: query,
          update: {
            $set: {
              order: newOrder,
            },
          },
        },
      };

      experienceBulkOps.push(op);
      certificateBulkOps.push(op);
    });

    if (experienceBulkOps.length > 0) {
      await Experience.bulkWrite(experienceBulkOps);
    }
    if (certificateBulkOps.length > 0) {
      await Certificate.bulkWrite(certificateBulkOps);
    }

    try {
      revalidatePath("/");
      revalidatePath("/experience");
      revalidatePath("/about");
      revalidatePath("/ugaas/experience");
      revalidatePath("/ugaas/certificates");
    } catch {}

    return NextResponse.json(
      {
        success: true,
        message: "Timeline order updated successfully.",
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("❌ [Experience Reorder Error]:", error);
    const message =
      error instanceof Error ? error.message : "Failed to reorder items";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

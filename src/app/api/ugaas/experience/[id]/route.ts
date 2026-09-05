import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/ugaas/lib/db";
import { Experience } from "@/ugaas/models/Experience";
import { Certificate } from "@/ugaas/models/Certificate";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { _id: id };
    
    let record: any = await Experience.findOne(query).lean();

    if (!record) {
      const cert = await Certificate.findOne(query).lean();
      if (cert) {
        record = {
          ...cert,
          id: (cert as any)._id.toString(),
          role: (cert as any).title,
          company: (cert as any).issuer,
          duration: (cert as any).issueDate || "2024",
          badges: [(cert as any).category || "Certification"].filter(Boolean),
          image: (cert as any).image || "",
          credentialUrl: (cert as any).link || "",
          credentialId: (cert as any).code || "",
          type: "certification",
        };
      }
    }

    if (!record) {
      return NextResponse.json(
        { success: false, error: "Record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      experience: {
        ...record,
        id: (record as any)._id.toString(),
      },
    });
  } catch (error) {
    console.error("❌ [Experience Get Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch record" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    await connectToDatabase();

    const {
      role,
      company,
      duration,
      badges,
      highlights,
      techStack,
      image,
      credentialUrl,
      credentialId,
      type,
      order,
    } = body;

    const updateData: any = {};
    if (role !== undefined) updateData.role = role;
    if (company !== undefined) updateData.company = company;
    if (duration !== undefined) updateData.duration = duration;
    if (badges !== undefined) {
      updateData.badges = Array.isArray(badges) ? badges : [badges].filter(Boolean);
    }
    if (highlights !== undefined) {
      updateData.highlights = Array.isArray(highlights)
        ? highlights.filter(Boolean)
        : typeof highlights === "string"
        ? highlights.split("\n").filter(Boolean)
        : [];
    }
    if (techStack !== undefined) {
      updateData.techStack = Array.isArray(techStack)
        ? techStack.filter(Boolean)
        : typeof techStack === "string"
        ? techStack.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [];
    }
    if (image !== undefined) updateData.image = image;
    if (credentialUrl !== undefined) updateData.credentialUrl = credentialUrl;
    if (credentialId !== undefined) updateData.credentialId = credentialId;
    if (type !== undefined) updateData.type = type;
    if (order !== undefined) updateData.order = Number(order);

    let updated: any = await Experience.findByIdAndUpdate(id, updateData, {
      new: true,
    }).lean();

    // If not in Experience, check and update in Certificate
    if (!updated) {
      const certUpdateData: any = {};
      if (role !== undefined) certUpdateData.title = role;
      if (company !== undefined) certUpdateData.issuer = company;
      if (credentialId !== undefined) certUpdateData.code = credentialId;
      if (credentialUrl !== undefined) certUpdateData.link = credentialUrl;
      if (image !== undefined) certUpdateData.image = image;
      if (badges !== undefined) certUpdateData.category = Array.isArray(badges) ? badges[0] : badges;
      if (order !== undefined) certUpdateData.order = Number(order);

      const updatedCert: any = await Certificate.findByIdAndUpdate(id, certUpdateData, {
        new: true,
      }).lean();

      if (updatedCert) {
        updated = {
          ...updatedCert,
          id: updatedCert._id.toString(),
          role: updatedCert.title,
          company: updatedCert.issuer,
          duration: "2024",
          badges: [updatedCert.category],
          image: updatedCert.image,
          credentialUrl: updatedCert.link,
          credentialId: updatedCert.code,
          type: "certification" as const,
        };
      }
    }

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Record not found" },
        { status: 404 }
      );
    }

    // Record activity audit log
    const { logActivity } = await import("@/ugaas/lib/audit");
    await logActivity(request, {
      action: "EXPERIENCE_UPDATE",
      category: "experience",
      description: `Updated experience record: "${(updated as any).role || (updated as any).title}"`,
      resourceId: (updated as any)._id.toString(),
      resourceName: `${(updated as any).role || (updated as any).title} - ${(updated as any).company || (updated as any).issuer}`,
      details: {
        updatedFields: Object.keys(updateData),
        type: (updated as any).type,
      },
    });

    try {
      revalidatePath("/");
      revalidatePath("/experience");
      revalidatePath("/about");
      revalidatePath("/ugaas/certificates");
      revalidatePath("/ugaas/experience");
    } catch (revErr) {
      console.warn("Revalidation warning:", revErr);
    }

    return NextResponse.json({
      success: true,
      experience: {
        ...updated,
        id: (updated as any)._id.toString(),
      },
    });
  } catch (error) {
    console.error("❌ [Experience Update Error]:", error);
    const message = error instanceof Error ? error.message : "Failed to update record";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: new mongoose.Types.ObjectId(id) } : { _id: id };

    let deleted: any = await Experience.findOneAndDelete(query);

    // If not found in Experience collection, check in Certificate collection
    if (!deleted) {
      deleted = await Certificate.findOneAndDelete(query);
    }

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Record not found" },
        { status: 404 }
      );
    }

    // Clean up any potential duplicate or mirrored entries across collections with same title/role
    const itemName = deleted.role || deleted.title;
    if (itemName) {
      if (deleted.type === "certification" || !deleted.type) {
        await Certificate.deleteMany({ title: itemName });
        await Experience.deleteMany({ role: itemName, type: "certification" });
      }
    }

    // Record activity audit log
    const { logActivity } = await import("@/ugaas/lib/audit");
    await logActivity(request, {
      action: "EXPERIENCE_DELETE",
      category: "experience",
      description: `Deleted record: "${deleted.role || deleted.title}" at "${deleted.company || deleted.issuer}"`,
      resourceId: deleted._id.toString(),
      resourceName: `${deleted.role || deleted.title} - ${deleted.company || deleted.issuer}`,
      details: {
        type: deleted.type || "certification",
      },
    });

    try {
      revalidatePath("/");
      revalidatePath("/experience");
      revalidatePath("/about");
      revalidatePath("/ugaas/certificates");
      revalidatePath("/ugaas/experience");
    } catch (revErr) {
      console.warn("Revalidation warning:", revErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Record deleted successfully",
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("❌ [Experience Delete Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete record" },
      { status: 500 }
    );
  }
}

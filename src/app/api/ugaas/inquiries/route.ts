import { NextResponse } from "next/server";
import { connectToDatabase } from "@/ugaas/lib/db";
import { Inquiry } from "@/ugaas/models/Inquiry";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const query = searchParams.get("q");

    await connectToDatabase();

    const filter: any = {};
    if (status && status !== "all") {
      filter.status = status;
    }

    if (query) {
      const regex = new RegExp(query, "i");
      filter.$or = [
        { name: regex },
        { email: regex },
        { projectName: regex },
        { message: regex },
        { projectType: regex },
      ];
    }

    const inquiries = await Inquiry.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    const sanitized = inquiries.map((item: any) => ({
      ...item,
      id: item._id.toString(),
      _id: item._id.toString(),
    }));

    return NextResponse.json({ success: true, inquiries: sanitized });
  } catch (error) {
    console.error("❌ [Inquiries Fetch Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      projectName = "General Project Request",
      name,
      email,
      phone = "",
      projectType = "Full-Stack Development",
      budget = "Negotiable",
      deadline = "Flexible",
      message,
    } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newInquiry = await Inquiry.create({
      projectName,
      name,
      email,
      phone,
      projectType,
      budget,
      deadline,
      message,
      status: "unread",
    });

    return NextResponse.json(
      {
        success: true,
        inquiry: {
          ...newInquiry.toObject(),
          id: newInquiry._id.toString(),
          _id: newInquiry._id.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ [Inquiry Create Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create inquiry" },
      { status: 500 }
    );
  }
}

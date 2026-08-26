import { NextResponse } from "next/server";
import { connectToDatabase } from "@/ugaas/lib/db";
import { Project } from "@/ugaas/models/Project";
import { Inquiry } from "@/ugaas/models/Inquiry";
import { Experience } from "@/ugaas/models/Experience";
import { Certificate } from "@/ugaas/models/Certificate";
import { TOOL_ICONS } from "@/components/toolIcons";
import { projectsData } from "@/data/portfolioData";
import { experiencesData } from "@/data/experienceData";

export async function GET() {
  try {
    const mongoose = await connectToDatabase();

    const [
      dbProjectCount,
      totalInquiries,
      unreadInquiries,
      recentInquiriesDocs,
      dbExperienceCount,
      dbCertificateCount,
    ] = await Promise.all([
      Project.countDocuments().catch(() => 0),
      Inquiry.countDocuments().catch(() => 0),
      Inquiry.countDocuments({ status: "unread" }).catch(() => 0),
      Inquiry.find().sort({ createdAt: -1 }).limit(5).lean().catch(() => []),
      Experience.countDocuments().catch(() => 0),
      Certificate.countDocuments().catch(() => 0),
    ]);

    const totalProjects = dbProjectCount > 0 ? dbProjectCount : projectsData.length;
    const experienceMilestones =
      dbExperienceCount + dbCertificateCount > 0
        ? dbExperienceCount + dbCertificateCount
        : experiencesData.length + 6;

    const activeTechStack = Object.keys(TOOL_ICONS).length || 48;

    // Convert _id to string for clean serialization
    const recentInquiries = recentInquiriesDocs.map((item: any) => ({
      id: item._id.toString(),
      projectName: item.projectName || "General Inquiry",
      name: item.name || "Anonymous",
      email: item.email || "",
      phone: item.phone || "",
      projectType: item.projectType || "General",
      budget: item.budget || "—",
      deadline: item.deadline || "—",
      message: item.message || "",
      status: item.status || "unread",
      createdAt: item.createdAt || new Date(),
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalProjects,
        inquiries: {
          total: totalInquiries,
          unread: unreadInquiries,
          read: Math.max(0, totalInquiries - unreadInquiries),
          recent: recentInquiries,
        },
        experienceMilestones,
        activeTechStack,
        dbStatus: {
          connected: mongoose.connection.readyState === 1,
          database: mongoose.connection.name || "myportfolio",
          host: mongoose.connection.host || "MongoDB Atlas (ugaas)",
          readyState: mongoose.connection.readyState,
        },
      },
    });
  } catch (error) {
    console.error("❌ [Overview API Error]:", error);
    // Fallback response with static counts if database is unreachable
    return NextResponse.json({
      success: false,
      stats: {
        totalProjects: projectsData.length || 12,
        inquiries: {
          total: 0,
          unread: 0,
          read: 0,
          recent: [],
        },
        experienceMilestones: experiencesData.length + 6 || 14,
        activeTechStack: Object.keys(TOOL_ICONS).length || 48,
        dbStatus: {
          connected: false,
          database: "myportfolio",
          host: "Offline / Connecting",
          readyState: 0,
        },
      },
    });
  }
}

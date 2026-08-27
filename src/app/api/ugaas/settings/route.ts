import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/ugaas/lib/db";
import { Settings } from "@/ugaas/models/Settings";

export async function GET() {
  try {
    await connectToDatabase();

    let settings = await Settings.findOne().lean();

    if (!settings) {
      // Create default settings if not exists
      const created = await Settings.create({
        fullName: "Mohamed Aweis",
        headline: "Full-Stack Software Engineer & Mobile Developer",
        email: "aweis90@example.com",
        phone: "+252 61 000 0000",
        location: "Mogadishu, Somalia",
        bio: "Passionate engineer crafting scalable web applications, mobile experiences, and modern cloud architectures.",
        avatarUrl: "/myProfile.png",
        resumeUrl: "/resume.pdf",
        githubUrl: "https://github.com/MaxamedAweis90",
        linkedinUrl: "https://linkedin.com/in/maxamedaweis90",
        twitterUrl: "https://x.com/maxamedaweis90",
        discordTag: "aweis90",
        portfolioUrl: "https://aweis.dev",
        appsShortcut: "Ctrl+K",
        terminalShortcut: "Ctrl+`",
        defaultSidebarCollapsed: false,
        enableNotifications: true,
      });
      settings = created.toObject();
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch settings",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create(body);
    } else {
      Object.assign(settings, body);
      await settings.save();
    }

    // Record activity audit log
    const { logActivity } = await import("@/ugaas/lib/audit");
    await logActivity(req, {
      action: "SETTINGS_UPDATE",
      category: "settings",
      description: "Updated developer profile and system settings",
      details: {
        updatedKeys: Object.keys(body),
        maxConcurrentSessions: settings.maxConcurrentSessions,
      },
    });

    return NextResponse.json({
      success: true,
      settings,
      message: "Settings updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update settings",
      },
      { status: 500 }
    );
  }
}

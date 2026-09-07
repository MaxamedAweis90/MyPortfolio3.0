"use server";

import { connectToDatabase, Inquiry } from "@portfolio/database";
import { Resend } from "resend";

export interface InquiryInput {
  projectName?: string;
  name: string;
  email: string;
  phone?: string;
  projectType?: string;
  budget?: string;
  deadline?: string;
  message: string;
  sent_time?: string;
}

// Optional email templates for Resend if environment keys are present
const ownerTemplate = (data: InquiryInput) => `
  <div style="font-family:sans-serif;padding:24px;background:#f9fafb;border-radius:8px;">
    <h2 style="color:#0B82EC;margin-top:0;">New Project Request: ${data.projectName || "General"}</h2>
    <table style="width:100%;font-size:15px;line-height:1.6;color:#1f2937;">
      <tr><td><strong>Name:</strong></td><td>${data.name}</td></tr>
      <tr><td><strong>Email:</strong></td><td>${data.email}</td></tr>
      <tr><td><strong>Phone:</strong></td><td>${data.phone || "—"}</td></tr>
      <tr><td><strong>Project Type:</strong></td><td>${data.projectType || "General"}</td></tr>
      <tr><td><strong>Budget:</strong></td><td>${data.budget || "—"}</td></tr>
      <tr><td><strong>Deadline:</strong></td><td>${data.deadline || "—"}</td></tr>
      <tr><td><strong>Sent:</strong></td><td>${data.sent_time || new Date().toISOString()}</td></tr>
    </table>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">
    <p style="color:#4b5563;white-space:pre-wrap;">${data.message}</p>
  </div>
`;

/**
 * Server Action to submit public project proposals and contact inquiries.
 * Saves directly into MongoDB Inquiry collection via @portfolio/database.
 */
export async function submitInquiry(formData: FormData | InquiryInput) {
  try {
    let payload: InquiryInput;

    if (formData instanceof FormData) {
      payload = {
        projectName: (formData.get("projectName") as string) || (formData.get("projectType") as string) || "Project Proposal",
        name: (formData.get("name") as string) || "",
        email: (formData.get("email") as string) || "",
        phone: (formData.get("phone") as string) || "",
        projectType: (formData.get("projectType") as string) || "General",
        budget: (formData.get("budget") as string) || "",
        deadline: (formData.get("deadline") as string) || "",
        message: (formData.get("message") as string) || "",
        sent_time: (formData.get("sent_time") as string) || new Date().toISOString(),
      };
    } else {
      payload = formData;
    }

    if (!payload.name?.trim() || !payload.email?.trim() || !payload.message?.trim()) {
      return { success: false, error: "Name, email, and project message are required." };
    }

    await connectToDatabase();

    const inquiry = await Inquiry.create({
      projectName: payload.projectName?.trim() || `${payload.projectType || "General"} Project Request`,
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone?.trim() || "",
      projectType: payload.projectType?.trim() || "General",
      budget: payload.budget?.trim() || "Not specified",
      deadline: payload.deadline?.trim() || "Flexible",
      message: payload.message.trim(),
      status: "unread",
    });

    // Send notifications if Resend credentials exist
    const { RESEND_API_KEY, EMAIL_RECEIVER, EMAIL_SENDER } = process.env;
    if (RESEND_API_KEY && EMAIL_RECEIVER && EMAIL_SENDER) {
      try {
        const resend = new Resend(RESEND_API_KEY);
        await resend.emails.send({
          from: EMAIL_SENDER,
          to: EMAIL_RECEIVER,
          subject: `New Project Request: ${payload.projectName || "General"}`,
          html: ownerTemplate(payload),
        });
      } catch (emailErr) {
        console.warn("⚠️ [Inquiry Action] Email dispatch warning:", emailErr);
      }
    }

    return {
      success: true,
      inquiryId: inquiry._id.toString(),
      message: "Proposal sent successfully!",
    };
  } catch (error: any) {
    console.error("❌ [Inquiry Action] Submission failed:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred while saving your inquiry.",
    };
  }
}

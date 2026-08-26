import { NextResponse } from "next/server";
import { Resend } from "resend";
import { connectToDatabase } from "@/ugaas/lib/db";
import { Inquiry } from "@/ugaas/models/Inquiry";

type ProjectRequestPayload = {
  projectName: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budget?: string;
  deadline?: string;
  message: string;
  sent_time: string;
};

// Brand colours & shared styles
const primary   = "#0B82EC";
const darkText  = "#1f2937";
const lightText = "#4b5563";
const cardBg    = "#ffffff";
const pageBg    = "#f3f4f6";
const border    = "#e5e7eb";
const radius    = "10px";

const baseStyles = `
  font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
  background:${pageBg}; margin:0; padding:40px 0;
  -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale;
`;

const cardStyles = `
  max-width:600px; margin:0 auto; background:${cardBg};
  border:1px solid ${border}; border-radius:${radius};
  padding:32px; box-shadow:0 4px 10px rgba(0,0,0,.06);
`;

// Professional owner notification template
const ownerTemplate = ({
  projectName,
  name,
  email,
  phone,
  projectType,
  budget,
  deadline,
  sent_time,
  message,
}: ProjectRequestPayload) => `
  <body style="${baseStyles}">
    <div style="${cardStyles}">
      <h2 style="color:${primary};margin-top:0;">New Project Request: ${projectName}</h2>
      <table style="width:100%;font-size:15px;line-height:1.5;color:${darkText};border-collapse:collapse;">
        <tr><td><strong>Name:</strong></td><td>${name}</td></tr>
        <tr><td><strong>Email:</strong></td><td>${email}</td></tr>
        <tr><td><strong>Phone:</strong></td><td>${phone}</td></tr>
        <tr><td><strong>Project Type:</strong></td><td>${projectType}</td></tr>
        <tr><td><strong>Budget:</strong></td><td>${budget || "—"}</td></tr>
        <tr><td><strong>Deadline:</strong></td><td>${deadline || "—"}</td></tr>
        <tr><td><strong>Sent:</strong></td><td>${sent_time}</td></tr>
      </table>
      <hr style="border:none;border-top:1px solid ${border};margin:24px 0;">
      <p style="color:${lightText};white-space:pre-wrap;">${message}</p>
    </div>
  </body>
`;

// Customer auto‑reply template
const customerTemplate = ({
  name,
  projectName,
}: Pick<ProjectRequestPayload, "name" | "projectName">) => `
  <body style="${baseStyles}">
    <div style="${cardStyles};text-align:center;">
      <h1 style="color:${primary};margin-top:0;">Thank you, ${name}!</h1>
      <p style="font-size:16px;color:${darkText};">
        We’ve received your project request<br><em>${projectName}</em>.
      </p>
      <p style="font-size:15px;color:${lightText};">
        Our team will get back to you within the next <strong>24 hours</strong>.
      </p>
      <p style="margin-top:32px;font-weight:600;color:${darkText};">— Engaweis Studio</p>
    </div>
  </body>
`;

export async function POST(request: Request) {
  console.log("🟢 [project-request] POST invoked");

  let data: ProjectRequestPayload;
  try {
    data = (await request.json()) as ProjectRequestPayload;
    console.log("Payload:", data);
  } catch (err) {
    console.error("🚫 Invalid JSON:", err);
    return NextResponse.json({ success:false, error:"Invalid JSON payload" }, { status:400 });
  }

  const { projectName, name, email, phone, projectType, budget, deadline, message, sent_time } = data;

  // 1️⃣ Save to MongoDB Inquiry collection
  try {
    await connectToDatabase();
    await Inquiry.create({
      projectName: projectName || "General Inquiry",
      name,
      email,
      phone,
      projectType: projectType || "General",
      budget: budget || "Not specified",
      deadline: deadline || "Flexible",
      message,
      status: "unread",
    });
    console.log("✅ [Inquiry] Recorded into database.");
  } catch (dbErr) {
    console.error("⚠️ [Inquiry Save Warning] Could not save to DB:", dbErr);
  }

  // 2️⃣ Optional Resend email delivery if keys are configured
  const { RESEND_API_KEY, EMAIL_RECEIVER, EMAIL_SENDER } = process.env;
  if (RESEND_API_KEY && EMAIL_RECEIVER && EMAIL_SENDER) {
    try {
      const resend = new Resend(RESEND_API_KEY);
      // Owner email
      await resend.emails.send({
        from: EMAIL_SENDER,
        to: EMAIL_RECEIVER,
        subject: `New Project Request: ${projectName}`,
        html: ownerTemplate({ projectName, name, email, phone, projectType, budget, deadline, sent_time, message }),
      });

      // Customer auto-reply
      await resend.emails.send({
        from: EMAIL_SENDER,
        to: email,
        subject: "We received your project request 🎉",
        html: customerTemplate({ name, projectName }),
      });
      console.log("✉️ Emails dispatched successfully.");
    } catch (emailErr) {
      console.warn("⚠️ Email delivery warning:", emailErr);
    }
  }

  return NextResponse.json({ success: true }, { status: 200 });
}

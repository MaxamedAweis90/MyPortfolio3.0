import { NextResponse } from "next/server";
import { Resend } from "resend";

// Ensure required env variables exist
const { RESEND_API_KEY, EMAIL_RECEIVER, EMAIL_SENDER } = process.env;
if (!RESEND_API_KEY || !EMAIL_RECEIVER || !EMAIL_SENDER) {
  console.error("❌ Missing env vars!", { RESEND_API_KEY, EMAIL_RECEIVER, EMAIL_SENDER });
  throw new Error(
    "Missing required environment variables: RESEND_API_KEY, EMAIL_RECEIVER or EMAIL_SENDER"
  );
}

const resend = new Resend(RESEND_API_KEY);

// Brand colours & shared styles
const primary   = "#e11d48";  // red-600
const darkText  = "#1f2937";  // gray-800
const lightText = "#4b5563";  // gray-600
const cardBg    = "#ffffff";
const pageBg    = "#f3f4f6";  // gray-100
const border    = "#e5e7eb";  // gray-200
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
const ownerTemplate = ({ projectName, name, email, phone, projectType, budget, deadline, sent_time, message }) => `
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
const customerTemplate = ({ name, projectName }) => `
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

export async function POST(request) {
  console.log("🟢 [project-request] POST invoked");

  let data;
  try {
    data = await request.json();
    console.log("Payload:", data);
  } catch (err) {
    console.error("🚫 Invalid JSON:", err);
    return NextResponse.json({ success:false, error:"Invalid JSON payload" }, { status:400 });
  }

  const { projectName, name, email, phone, projectType, budget, deadline, message, sent_time } = data;

  try {
    // 1️⃣ Send notification to site owner
    const ownerResp = await resend.emails.send({
      from: EMAIL_SENDER,
      to: EMAIL_RECEIVER,
      subject: `New Project Request: ${projectName}`,
      html: ownerTemplate({ projectName, name, email, phone, projectType, budget, deadline, sent_time, message }),
    });
    console.log("✉️ Owner email sent, ID:", ownerResp.id);

    // 2️⃣ Send auto‑reply to customer
    const customerResp = await resend.emails.send({
      from: EMAIL_SENDER,
      to: email,
      subject: "We received your project request 🎉",
      html: customerTemplate({ name, projectName }),
    });
    console.log("✉️ Customer auto‑reply sent, ID:", customerResp.id);

    return NextResponse.json(
      { success:true, ownerId:ownerResp.id, customerId:customerResp.id },
      { status:200 }
    );
  } catch (error) {
    console.error("❌ Error sending emails:", error);
    return NextResponse.json(
      { success:false, error:error.message || "Failed to send email(s)" },
      { status:500 }
    );
  }
}

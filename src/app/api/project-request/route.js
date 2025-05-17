import { NextResponse } from "next/server";
import { Resend } from "resend";

// Ensure required env variables exist
const { RESEND_API_KEY, EMAIL_RECEIVER, EMAIL_SENDER } = process.env;
if (!RESEND_API_KEY || !EMAIL_RECEIVER || !EMAIL_SENDER) {
  console.error("❌ Missing env vars!", { RESEND_API_KEY, EMAIL_RECEIVER, EMAIL_SENDER });
  throw new Error("Missing required environment variables: RESEND_API_KEY, EMAIL_RECEIVER or EMAIL_SENDER");
}

const resend = new Resend(RESEND_API_KEY);

export async function POST(request) {
  console.log("🟢 [project-request] POST invoked");

  let data;
  try {
    data = await request.json();
    console.log("Payload:", data);
  } catch (err) {
    console.error("🚫 Invalid JSON:", err);
    return NextResponse.json(
      { success: false, error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  const {
    projectName,
    name,
    email,
    phone,
    projectType,
    budget,
    deadline,
    message,
    sent_time,
  } = data;

  try {
    const resp = await resend.emails.send({
      from: `${EMAIL_SENDER}`,
      to: EMAIL_RECEIVER,
      subject: `New Project Request: ${projectName}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Project Type:</strong> ${projectType}</p>
        <p><strong>Estimated Budget:</strong> ${budget}</p>
        <p><strong>Deadline:</strong> ${deadline}</p>
        <p><strong>Time Sent:</strong> ${sent_time}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    });

    console.log("✉️ Resend response ID:", resp.id);
    return NextResponse.json({ success: true, id: resp.id }, { status: 200 });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to send email" },
      { status: 500 }
    );
  }
}

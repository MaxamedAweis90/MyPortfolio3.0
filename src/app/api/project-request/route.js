import { Resend } from "resend";

// Optional: Ensure required env variables exist
if (!process.env.RESEND_API_KEY || !process.env.EMAIL_RECEIVER) {
  throw new Error("Missing required environment variables: RESEND_API_KEY or EMAIL_RECEIVER");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    // Updated to accept all project request fields
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
    } = await req.json();

    await resend.emails.send({
      // Replace with a verified sender email address registered in your Resend account!
      from: "Verified Sender <onboarding@yourdomain.com>",
      to: process.env.EMAIL_RECEIVER,
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

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send email" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
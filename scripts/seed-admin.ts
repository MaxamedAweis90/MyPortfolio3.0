import path from "path";
import dotenv from "dotenv";

// 1. Explicitly load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || "maxamedaweys90@gmail.com";
  const password = process.env.ADMIN_PASSWORD || "Admin@ugaas2026";
  const name = process.env.ADMIN_NAME || "Mohamed Aweys (Eng_Aweis)";

  console.log("🔐 [Admin Seed] Starting admin provisioning...");
  console.log(`📧 Target Email: ${email}`);
  console.log(`👤 Target Name:  ${name}`);

  // Dynamically import auth after dotenv has loaded the environment
  const { auth } = await import("../src/ugaas/lib/auth");

  try {
    const res = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    if (res && res.user) {
      console.log("✅ Admin user provisioned successfully.");
      console.log(`👤 User ID: ${res.user.id}`);
      console.log(`📧 Email:   ${res.user.email}`);
    } else {
      console.log("ℹ️ [Admin Seed] Provisioning result:", res);
    }
  } catch (error: any) {
    const errorMessage = error?.body?.message || error?.message || "";
    if (
      errorMessage.toLowerCase().includes("already exists") ||
      errorMessage.toLowerCase().includes("duplicate") ||
      error?.status === 400
    ) {
      console.log("ℹ️ Admin account already registered.");
    } else {
      console.error("❌ [Admin Seed Error] Failed to provision admin account:", error);
      process.exit(1);
    }
  }

  process.exit(0);
}

seedAdmin();

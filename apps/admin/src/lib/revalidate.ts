/**
 * On-Demand Cache Invalidation Client for Ugaas Admin
 * 
 * Sends secure cache invalidation webhooks to apps/web whenever CRUD mutations occur.
 */
export async function triggerRevalidate(tag: string): Promise<{ success: boolean; message?: string }> {
  try {
    const webAppUrl = process.env.WEB_APP_URL || "http://localhost:3000";
    const secret = process.env.REVALIDATION_SECRET || "ugaas-revalidate-secret-key";

    const endpoint = `${webAppUrl.replace(/\/$/, "")}/api/revalidate`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-secret": secret,
      },
      body: JSON.stringify({ tag }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.warn(`⚠️ [triggerRevalidate] Failed to revalidate tag '${tag}': ${response.status} ${errorText}`);
      return { success: false, message: `Status: ${response.status}` };
    }

    console.log(`✅ [triggerRevalidate] Revalidation webhook sent successfully for tag: '${tag}'`);
    return { success: true };
  } catch (error: any) {
    // Gracefully report failure without blocking admin mutations
    console.warn(`⚠️ [triggerRevalidate] Network error notifying web app for tag '${tag}':`, error.message);
    return { success: false, message: error.message };
  }
}

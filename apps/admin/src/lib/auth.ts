import path from "path";
import dotenv from "dotenv";

// Pre-load environment variables for standalone script execution (e.g. CLI seed scripts)
if (typeof process !== "undefined" && process.cwd) {
  try {
    dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
    dotenv.config({ path: path.resolve(process.cwd(), ".env") });
  } catch {}
}

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { client } from "@portfolio/database";

const db = client.db("myportfolio");

const resolveBaseURL = (): string => {
  if (process.env.BETTER_AUTH_URL && !process.env.BETTER_AUTH_URL.includes("localhost")) {
    return process.env.BETTER_AUTH_URL;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  return process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
};

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "f6c8d1e3a5b7c9e0f2d4a6b8c0e2f4a6b8c0e2f4a6b8c0e2f4a6b8c0e2f4a6b8",
  baseURL: resolveBaseURL(),
  trustedOrigins: async (request) => {
    const origins = [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://*.vercel.app",
      "https://*.engaweis.dev",
      "https://engaweis.dev",
      "https://www.engaweis.dev",
      "https://ugaas.vercel.app",
      "https://ugaas.engaweis.dev",
      ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
      ...(process.env.NEXT_PUBLIC_APP_URL ? [process.env.NEXT_PUBLIC_APP_URL] : []),
      ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
      ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
        : []),
    ];

    if (request) {
      const origin = request.headers.get("origin");
      if (origin) origins.push(origin);
      const host = request.headers.get("host");
      if (host) {
        origins.push(`https://${host}`);
        origins.push(`http://${host}`);
      }
      const forwardedHost = request.headers.get("x-forwarded-host");
      const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
      if (forwardedHost) {
        origins.push(`${forwardedProto}://${forwardedHost}`);
      }
    }

    return Array.from(new Set(origins.filter(Boolean)));
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  plugins: [nextCookies()],
});

export type Auth = typeof auth;
export default auth;

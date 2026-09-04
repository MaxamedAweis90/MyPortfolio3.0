import fs from "fs";
import path from "path";

// Clean up files and directories not belonging to portfolio (/app) and CMS (/ugaas)
const cleanupTargets = [
  // Stale Pages & Aliases
  path.join(process.cwd(), "pages"),
  path.join(process.cwd(), "src", "pages"),
  path.join(process.cwd(), "src", "components"),
  // Redundant shims & legacy routes
  path.join(process.cwd(), "src", "app", "admin"),
  path.join(process.cwd(), "src", "app", "api", "admin"),
  path.join(process.cwd(), "src", "app", "api", "sanityLoadTools"),
  path.join(process.cwd(), "src", "app", "models"),
  // Foreign e-commerce cart Page Object Model
  path.join(process.cwd(), "tests", "pages", "CartPage.ts"),
  // Empty test stubs
  path.join(process.cwd(), "tests", "auth.spec.ts"),
  path.join(process.cwd(), "tests", "dynamic-ui.spec.ts"),
  path.join(process.cwd(), "tests", "example.spec.ts"),
  path.join(process.cwd(), "tests", "navigation.spec.ts"),
  // Root debris
  path.join(process.cwd(), "env.ts"),
  path.join(process.cwd(), "repomix-output.xml"),
];

for (const target of cleanupTargets) {
  try {
    if (fs.existsSync(target)) {
      fs.rmSync(target, { recursive: true, force: true });
    }
  } catch {
    // Ignore cleanup error if already removed
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 2592000,
  },
};

export default nextConfig;

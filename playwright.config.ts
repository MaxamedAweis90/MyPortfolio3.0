import { defineConfig, devices } from "@playwright/test";

/**
 * Simple, Fast Chromium-Only Playwright Configuration
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never" }], ["list"]],

  timeout: 45000,
  expect: {
    timeout: 10000,
  },

  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    navigationTimeout: 35000,
    actionTimeout: 15000,
  },

  /* Desktop and Mobile Devices */
  projects: [
    {
      name: "Desktop Chrome",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "Mobile Chrome (Android)",
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "Mobile Safari (iOS)",
      use: { ...devices["iPhone 14"] },
    },
  ],

  /* Automatically start Next.js dev server if not already running */
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});

import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test.describe("Backend Ugaas Admin & Auth Suite", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("UI: should render terminal login interface with light mode default", async () => {
    await expect(loginPage.commandInput).toBeAttached();
    const currentTheme = await loginPage.getDocumentTheme();
    expect(currentTheme).toBe("light");
  });

  test("Error Path: should handle invalid commands with appropriate error feedback", async () => {
    await loginPage.executeCommand("unknown_cmd_test");
    const errorOutput = loginPage.getOutputTextLocator(/command not found|unknown command|type "help"/i);
    await expect(errorOutput.first()).toBeVisible();
  });

  test("Guidelines: should display available commands on help", async () => {
    await loginPage.executeCommand("help");
    const helpOutput = loginPage.getOutputTextLocator(/available commands|cd ugaas|help/i);
    await expect(helpOutput.first()).toBeVisible();
  });

  test("Auth Progression & Validation: should progress stages and reject invalid email", async () => {
    // Stage 1: cd into ugaas directory
    await loginPage.executeCommand("cd ugaas");
    await expect(loginPage.getOutputTextLocator(/ugaas/i).first()).toBeVisible();

    // Stage 2: initialize login
    await loginPage.executeCommand("npm login");
    await expect(loginPage.getOutputTextLocator(/email|enter admin email/i).first()).toBeVisible();

    // Stage 3: Error path - invalid email format
    await loginPage.enterEmail("not-an-email");
    await expect(loginPage.getOutputTextLocator(/invalid email|must be/i).first()).toBeVisible();
  });

  test("Theme Toggle: should toggle terminal theme in login gateway", async ({ page }) => {
    await loginPage.toggleTheme();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "mytheme");

    await loginPage.toggleTheme();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("Gateway Security: unauthenticated access to /ugaas should redirect to login", async ({ page }) => {
    await page.goto("/ugaas");
    // Verify redirection to login terminal
    await expect(page).toHaveURL(/.*\/ugaas\/login/);
  });
});

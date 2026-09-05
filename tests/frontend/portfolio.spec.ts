import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { CommandPalettePage } from "../pages/CommandPalettePage";

test.describe("Frontend Portfolio Test Suite", () => {
  let homePage: HomePage;
  let commandPalette: CommandPalettePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    commandPalette = new CommandPalettePage(page);
    await homePage.goto();
  });

  test("UI: should render homepage with hero, navigation and light mode default", async ({ page }) => {
    // Assert page metadata and hero visibility
    await expect(page).toHaveTitle(/Mohamed Aweys/i);
    await expect(homePage.heroHeading).toBeVisible();

    // Verify system defaults to light mode
    const defaultTheme = await homePage.getDocumentTheme();
    expect(defaultTheme).toBe("light");
  });

  test("UI & Navigation: should navigate to portfolio sub-pages seamlessly", async ({ page }) => {
    // Navigate to Work page
    await page.goto("/work");
    await expect(page).toHaveURL(/.*\/work/);
    await expect(page.locator("h1, h2").first()).toBeVisible();

    // Navigate to About page
    await page.goto("/about");
    await expect(page).toHaveURL(/.*\/about/);
  });

  test("Dynamic UI: should trigger Command Palette modal and filter routes by prefix", async () => {
    // Open Palette with Ctrl+P / Cmd+P
    await commandPalette.openViaShortcut();
    await expect(commandPalette.searchInput).toBeVisible();

    // Type query
    await commandPalette.searchRoute("about");
    await expect(commandPalette.matchingRoutesHeader).toBeVisible();

    // Verify /about is suggested first
    const aboutOption = commandPalette.getRouteOption("About Mohamed");
    await expect(aboutOption).toBeVisible();
    await expect(aboutOption.getByText("/about")).toBeVisible();

    // Close via ESC
    await commandPalette.closeByEsc();
    await expect(commandPalette.searchInput).not.toBeVisible();
  });

  test("Theme Toggle: should flip data-theme smoothly without UI disruption", async ({ page }) => {
    // Toggle to Dark
    await homePage.toggleTheme();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "mytheme");

    // Toggle back to Light
    await homePage.toggleTheme();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("Console Errors Check: should load frontend with zero uncaught errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    expect(errors).toHaveLength(0);
  });
});

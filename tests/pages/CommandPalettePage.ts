import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Page Object Model for the Route Command Palette / Quick Open Modal
 */
export class CommandPalettePage extends BasePage {
  readonly searchInput: Locator;
  readonly modalContainer: Locator;
  readonly matchingRoutesHeader: Locator;
  readonly clearButton: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByPlaceholder(/type a route name/i);
    this.modalContainer = page.locator("div.fixed.z-\\[99999\\]");
    this.matchingRoutesHeader = page.getByText(/matching routes/i);
    this.clearButton = page.getByRole("button", { name: /clear search input/i });
  }

  /**
   * Open the command palette using keyboard shortcut (Control+P / Meta+P)
   */
  async openViaShortcut(): Promise<void> {
    const isMac = process.platform === "darwin";
    const modifier = isMac ? "Meta" : "Control";
    await this.page.keyboard.press(`${modifier}+KeyP`);
    await this.searchInput.waitFor({ state: "visible" });
  }

  /**
   * Search for a route by typing into the command palette
   */
  async searchRoute(query: string): Promise<void> {
    await this.searchInput.fill(query);
  }

  /**
   * Navigate through suggestions using arrow keys
   */
  async navigateSuggestions(direction: "up" | "down"): Promise<void> {
    const key = direction === "down" ? "ArrowDown" : "ArrowUp";
    await this.page.keyboard.press(key);
  }

  /**
   * Select and trigger current route via Enter
   */
  async selectCurrentRoute(): Promise<void> {
    await this.page.keyboard.press("Enter");
  }

  /**
   * Close palette using the Escape key
   */
  async closeByEsc(): Promise<void> {
    await this.page.keyboard.press("Escape");
  }

  /**
   * Get locator for a specific route option in the list
   */
  getRouteOption(title: string | RegExp): Locator {
    return this.page.getByRole("button").filter({ hasText: title });
  }
}

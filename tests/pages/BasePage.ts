import { Page } from "@playwright/test";

/**
 * Base Page Object Model class
 * Provides shared utilities and browser interaction helpers.
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates to a specific path relative to baseURL
   */
  async navigateTo(path: string = "/"): Promise<void> {
    await this.page.goto(path);
    await this.page.waitForLoadState("domcontentloaded");
  }

  /**
   * Presses a keyboard key or shortcut combination
   */
  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /**
   * Retrieves the current page URL
   */
  async getUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Retrieves the active document theme attribute
   */
  async getDocumentTheme(): Promise<string | null> {
    return this.page.evaluate(() =>
      document.documentElement.getAttribute("data-theme")
    );
  }
}

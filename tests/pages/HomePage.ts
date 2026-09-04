import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Page Object Model for Portfolio Home Page
 */
export class HomePage extends BasePage {
  readonly navbar: Locator;
  readonly themeToggleBtn: Locator;
  readonly heroHeading: Locator;
  readonly contactSection: Locator;

  constructor(page: Page) {
    super(page);
    this.navbar = page.getByRole("navigation");
    this.themeToggleBtn = page.getByRole("button", { name: /toggle theme|switch to/i }).first();
    this.heroHeading = page.locator("h1").first();
    this.contactSection = page.locator("#contact");
  }

  /**
   * Navigate to the home landing page
   */
  async goto(): Promise<void> {
    await this.navigateTo("/");
  }

  /**
   * Click navigation link by name
   */
  async clickNavLink(linkName: string): Promise<void> {
    const navLink = this.page.getByRole("link", { name: new RegExp(linkName, "i") }).first();
    await navLink.click();
  }

  /**
   * Toggle theme between light and dark
   */
  async toggleTheme(): Promise<void> {
    await this.themeToggleBtn.click();
  }
}

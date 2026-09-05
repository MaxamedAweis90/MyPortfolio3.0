import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Page Object Model for the Ugaas Terminal Authentication Gateway
 */
export class LoginPage extends BasePage {
  readonly terminalContainer: Locator;
  readonly commandInput: Locator;
  readonly submitButton: Locator;
  readonly themeToggleButton: Locator;
  readonly terminalLines: Locator;

  constructor(page: Page) {
    super(page);
    this.terminalContainer = page.locator("div.font-mono");
    this.commandInput = page.locator("textarea").first();
    this.submitButton = page.getByRole("button", { name: /execute|submit/i });
    this.themeToggleButton = page.getByRole("button", { name: /toggle theme/i });
    this.terminalLines = page.locator("div.whitespace-pre-wrap");
  }

  /**
   * Navigate to Ugaas Terminal Login page
   */
  async goto(): Promise<void> {
    await this.navigateTo("/ugaas/login");
    await this.commandInput.waitFor({ state: "attached" });
  }

  /**
   * Type and execute a terminal command
   */
  async executeCommand(command: string): Promise<void> {
    await this.commandInput.fill(command);
    await this.commandInput.press("Enter");
  }

  /**
   * Enter email during authentication stage
   */
  async enterEmail(email: string): Promise<void> {
    await this.executeCommand(email);
  }

  /**
   * Enter password during authentication stage
   */
  async enterPassword(password: string): Promise<void> {
    await this.executeCommand(password);
  }

  /**
   * Toggle theme between light and dark
   */
  async toggleTheme(): Promise<void> {
    await this.themeToggleButton.click();
  }

  /**
   * Get locator for specific terminal output text
   */
  getOutputTextLocator(text: string | RegExp): Locator {
    return this.page.locator("div.whitespace-pre-wrap, p, span").filter({ hasText: text });
  }
}

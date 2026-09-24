import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly quickAdminBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input#email');
    this.passwordInput = page.locator('input#password');
    this.submitButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.text-red-600.bg-red-50');
    this.quickAdminBtn = page.getByRole('button', { name: /Admin/i });
  }

  async goto() {
    await this.page.goto('/login');
    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.emailInput).toBeVisible({ timeout: 20000 });
  }

  async login(email: string, pass: string) {
    await this.emailInput.click();
    await this.emailInput.fill(email);
    await this.passwordInput.click();
    await this.passwordInput.fill(pass);
    await expect(this.emailInput).toHaveValue(email);
    await expect(this.passwordInput).toHaveValue(pass);
    await this.submitButton.click();
  }

  async quickLoginAdmin() {
    await this.quickAdminBtn.click();
  }

  async expectErrorMessage(message: string) {
    await expect(this.errorMessage).toBeVisible({ timeout: 10000 });
    await expect(this.errorMessage).toContainText(message);
  }

  async expectSuccessfulLogin() {
    await expect(this.page).toHaveURL(/\/admin/, { timeout: 20000 });
  }
}

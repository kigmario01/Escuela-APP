import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly sidebarNav: Locator;
  readonly userMenuButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebarNav = page.locator('nav');
    this.userMenuButton = page.locator('[data-slot="dropdown-menu-trigger"]');
    this.logoutButton = page.locator('[data-slot="dropdown-menu-item"]:has-text("Cerrar sesión")');
  }

  async navigateTo(menuItemName: string) {
    const link = this.sidebarNav.getByRole('link', { name: menuItemName });
    await link.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async logout() {
    await this.userMenuButton.click();
    await this.logoutButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.logoutButton.click();
    await expect(this.page).toHaveURL(/\/login/);
  }

  async expectKpisOrContentVisible() {
    await expect(this.page).toHaveURL(/\/admin/);
    await expect(this.page.locator('body')).not.toBeEmpty();
  }
}

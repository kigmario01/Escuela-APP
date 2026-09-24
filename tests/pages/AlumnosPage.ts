import { Page, Locator, expect } from '@playwright/test';

export class AlumnosPage {
  readonly page: Page;
  readonly newStudentButton: Locator;
  readonly modalDialog: Locator;
  readonly nombreInput: Locator;
  readonly apellidoInput: Locator;
  readonly emailInput: Locator;
  readonly matriculaInput: Locator;
  readonly submitButton: Locator;
  readonly dataTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newStudentButton = page.getByRole('button', { name: /Nuevo Alumno/i });
    this.modalDialog = page.locator('[role="dialog"]');
    this.nombreInput = page.locator('form input[name="nombre"]');
    this.apellidoInput = page.locator('form input[name="apellido"]');
    this.emailInput = page.locator('form input[name="email"]');
    this.matriculaInput = page.locator('form input[name="matricula"]');
    this.submitButton = page.locator('form button[type="submit"]');
    this.dataTable = page.locator('table');
  }

  async goto() {
    await this.page.goto('/admin/alumnos');
    await expect(this.page.locator('h1:has-text("Alumnos")')).toBeVisible({ timeout: 15000 });
  }

  async openNewStudentModal() {
    await this.newStudentButton.click();
    await expect(this.modalDialog).toBeVisible({ timeout: 10000 });
  }

  async submitEmptyForm() {
    await this.submitButton.click();
  }

  async expectValidationError(message = 'Obligatorio') {
    const errorMsg = this.modalDialog.locator(`text=${message}`);
    await expect(errorMsg.first()).toBeVisible({ timeout: 5000 });
  }

  async fillForm(data: { nombre: string; apellido: string; email: string; matricula: string }) {
    await this.nombreInput.fill(data.nombre);
    await this.apellidoInput.fill(data.apellido);
    await this.emailInput.fill(data.email);
    await this.matriculaInput.fill(data.matricula);
  }

  async submitForm() {
    await this.submitButton.click();
    await this.modalDialog.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  }

  async expectStudentInTable(nombre: string) {
    await expect(this.page.locator(`table tbody td:has-text("${nombre}")`)).toBeVisible({ timeout: 15000 });
  }
}

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('📊 Comprobación de Módulos del Sistema', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin@escuela.com', 'admin123');
    await loginPage.expectSuccessfulLogin();
  });

  test('Recorrido por todos los módulos del panel de administración', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    // 1. Módulo Dashboard
    await dashboardPage.expectKpisOrContentVisible();

    // 2. Módulo Alumnos
    await dashboardPage.navigateTo('Alumnos');
    await expect(page).toHaveURL(/\/admin\/alumnos/);
    await expect(page.locator('h1')).toContainText('Alumnos');

    // 3. Módulo Maestros
    await dashboardPage.navigateTo('Maestros');
    await expect(page).toHaveURL(/\/admin\/maestros/);
    await expect(page.locator('h1')).toContainText('Maestros');

    // 4. Módulo Materias
    await dashboardPage.navigateTo('Materias');
    await expect(page).toHaveURL(/\/admin\/materias/);
    await expect(page.locator('h1')).toContainText('Materias');

    // 5. Módulo Grupos
    await dashboardPage.navigateTo('Grupos');
    await expect(page).toHaveURL(/\/admin\/grupos/);
    await expect(page.locator('h1')).toContainText('Grupos');

    // 6. Módulo Reportes
    await dashboardPage.navigateTo('Reportes');
    await expect(page).toHaveURL(/\/admin\/reportes/);
    await expect(page.locator('h1')).toContainText('Reportes');
  });

  test('Cierre de sesión seguro desde el menú de usuario', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.logout();
    await expect(page).toHaveURL(/\/login/);
  });
});

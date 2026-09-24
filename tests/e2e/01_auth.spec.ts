import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Módulo de Autenticación - Casos Exitosos', () => {
  test('🌐 Abre la página de login y 🔐 autentica con usuario de prueba', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // 1. Abrir la página
    await loginPage.goto();

    // 2. Iniciar sesión con usuario de prueba
    await loginPage.login('admin@escuela.com', 'admin123');

    // 3. Comprobar que redirige exitosamente al panel de administración
    await loginPage.expectSuccessfulLogin();

    // 4. Comprobar que los elementos de navegación están presentes
    await expect(page.locator('text=EscuelaApp').first()).toBeVisible();
  });

  test('🔐 Autenticación rápida usando botón Demo Admin', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Clic en botón de acceso rápido
    await loginPage.quickLoginAdmin();

    // Comprobar redirección esperada
    await loginPage.expectSuccessfulLogin();
  });
});

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('📸 Demostración de Captura Automática ante Fallos', () => {
  test('📸 Captura manual bajo demanda en cualquier momento', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    // Tomar captura deliberada y guardarla
    await page.screenshot({ path: 'test-results/captura-login.png', fullPage: true });
    await expect(loginPage.emailInput).toBeVisible();
  });

  test('📸 @failure-demo Simulación de fallo para activar captura automática', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Intentamos buscar un elemento inexistente para forzar el fallo
    // Playwright detectará el fallo y tomará una captura automática (.png)
    // que se adjuntará al reporte interactivo HTML.
    await expect(page.locator('text=EsteTextoNoExisteParaDemostrarCapturaAutomatica')).toBeVisible({
      timeout: 3000,
    });
  });
});

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Pruebas de Errores Intencionales - Seguridad y Validaciones', () => {
  test('❌ Intento con contraseña incorrecta debe mostrar error de credenciales', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Intentar inicio con contraseña errónea intencional
    await loginPage.login('admin@escuela.com', 'password_totalmente_incorrecta_999');

    // Comprobar que no avanza al panel y muestra el mensaje de error esperado
    await loginPage.expectErrorMessage('Credenciales incorrectas');
    await expect(page).toHaveURL(/\/login/);
  });

  test('❌ Intento con usuario inexistente debe ser rechazado', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Usuario inventado que no existe en la base de datos
    await loginPage.login('noexiste_usuario@escuela.com', 'clave123');

    // Comprobar mensaje de error
    await loginPage.expectErrorMessage('Credenciales incorrectas');
    await expect(page).toHaveURL(/\/login/);
  });
});

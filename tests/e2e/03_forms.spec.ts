import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AlumnosPage } from '../pages/AlumnosPage';

test.describe('Interacción de Formularios y Validación de Resultados', () => {
  test.beforeEach(async ({ page }) => {
    // Iniciar sesión previo a la prueba de formulario
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin@escuela.com', 'admin123');
    await loginPage.expectSuccessfulLogin();
  });

  test('🖱️ Clics en botones, 📝 Llenado de formulario y ✅ Comprobación de resultados', async ({ page }) => {
    const alumnosPage = new AlumnosPage(page);

    // 1. Navegar a la página de Alumnos
    await alumnosPage.goto();

    // 2. Hacer clic en el botón "Nuevo Alumno" para abrir el modal
    await alumnosPage.openNewStudentModal();

    // 3. Probar error intencional: enviar formulario vacío para verificar validaciones
    await alumnosPage.submitEmptyForm();
    await alumnosPage.expectValidationError('Obligatorio');

    // 4. Llenar el formulario con datos de prueba únicos
    const timestamp = Date.now().toString().slice(-4);
    const testAlumno = {
      nombre: `Carlos_${timestamp}`,
      apellido: `Perez_${timestamp}`,
      email: `carlos.${timestamp}@escuela.com`,
      matricula: `MAT-${timestamp}`,
    };

    await alumnosPage.fillForm(testAlumno);

    // 5. Enviar el formulario
    await alumnosPage.submitForm();

    // 6. Comprobar que el resultado esperado aparece en la tabla
    await alumnosPage.expectStudentInTable(testAlumno.nombre);
  });
});

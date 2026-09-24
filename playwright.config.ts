import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración de Playwright para EscuelaApp / E2E Automation Suite
 * Cumple con:
 * - Captura automática de pantallas en caso de fallo (screenshot: 'only-on-failure')
 * - Generador de reporte HTML interactivo (reporter: 'html')
 * - Auto-inicio del servidor web Next.js local si no está corriendo
 */
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 45 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  fullyParallel: false,
  workers: 1, // 1 worker para mantener estado consistente en base de datos local
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    // Captura automática de pantalla en caso de fallo
    screenshot: 'only-on-failure',
    // Grabación de video y trace para depuración ante fallos
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 15 * 1000,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
  ],

  // Iniciar automáticamente el servidor si no está activo
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});

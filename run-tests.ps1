# Script de Ejecución Rápida para Pruebas E2E con Playwright
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "      SISTEMA DE PRUEBAS AUTOMATIZADAS E2E           " -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "1. Ejecutar pruebas en modo visual (Navegador visible - HEADED)" -ForegroundColor Yellow
Write-Host "2. Ejecutar pruebas en segundo plano (Modo rápido - HEADLESS)" -ForegroundColor Green
Write-Host "3. Demostración de Captura Automática ante Fallo" -ForegroundColor Magenta
Write-Host "4. Abrir Reporte de Pruebas HTML Interactivo" -ForegroundColor Blue
Write-Host "5. Abrir Playwright UI interactivo" -ForegroundColor DarkCyan
Write-Host "Q. Salir"
Write-Host "-----------------------------------------------------"

$opcion = Read-Host "Selecciona una opción (1-5 o Q) [Predeterminado: 1]"
if ([string]::IsNullOrWhiteSpace($opcion)) { $opcion = "1" }

switch ($opcion) {
    "1" {
        Write-Host "`n🚀 Ejecutando pruebas en modo visual..." -ForegroundColor Yellow
        npm run test:e2e:headed
    }
    "2" {
        Write-Host "`n⚡ Ejecutando pruebas en segundo plano..." -ForegroundColor Green
        npm run test:e2e
    }
    "3" {
        Write-Host "`n📸 Ejecutando prueba de fallo intencional para verificar capturas..." -ForegroundColor Magenta
        npm run test:e2e:failure-demo
        Write-Host "`nAbriendo reporte con la captura del fallo..." -ForegroundColor Yellow
        npm run test:report
    }
    "4" {
        Write-Host "`n📋 Abriendo reporte HTML..." -ForegroundColor Blue
        npm run test:report
    }
    "5" {
        Write-Host "`n🖥️ Abriendo Playwright UI..." -ForegroundColor DarkCyan
        npm run test:e2e:ui
    }
    default {
        Write-Host "Operación finalizada." -ForegroundColor Gray
    }
}

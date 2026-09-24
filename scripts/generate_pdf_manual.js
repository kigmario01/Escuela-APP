const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const CAPTURAS_DIR = path.join(__dirname, '..', 'docs', 'capturas');
const PDF_OUTPUT = path.join(__dirname, '..', 'docs', 'MANUAL_DE_USUARIO_ESCUELAAPP.pdf');
const HTML_OUTPUT = path.join(__dirname, '..', 'docs', 'MANUAL_DE_USUARIO_ESCUELAAPP.html');

async function ensureSampleData() {
  console.log('--- Asegurando datos demostrativos para capturas ---');
  const passHash = await bcrypt.hash('escuela2024', 10);

  // 1. Maestro Demo
  let maestroUser = await prisma.usuario.findUnique({ where: { email: 'maestro.demo@escuela.com' } });
  if (!maestroUser) {
    maestroUser = await prisma.usuario.create({
      data: {
        email: 'maestro.demo@escuela.com',
        password: passHash,
        nombre: 'Roberto',
        apellido: 'Hernández',
        rol: 'MAESTRO',
        maestro: { create: { especialidad: 'Matemáticas y Ciencias' } }
      }
    });
    console.log('Creado Maestro Demo');
  }

  // 2. Grupo Demo
  let grupo = await prisma.grupo.findFirst({ where: { nombre: '1°A' } });
  if (!grupo) {
    grupo = await prisma.grupo.create({
      data: { nombre: '1°A', grado: 1, turno: 'MATUTINO' }
    });
    console.log('Creado Grupo Demo');
  }

  // 3. Materia Demo
  let materia = await prisma.materia.findFirst({ where: { clave: 'MAT01' } });
  if (!materia) {
    materia = await prisma.materia.create({
      data: { nombre: 'Matemáticas I', clave: 'MAT01', descripcion: 'Álgebra y Razonamiento Lógico' }
    });
    console.log('Creada Materia Demo');
  }

  // 4. Asignación
  const maestro = await prisma.maestro.findUnique({ where: { usuarioId: maestroUser.id } });
  let asignacion = await prisma.materiaGrupo.findFirst({
    where: { materiaId: materia.id, grupoId: grupo.id, maestroId: maestro.id }
  });
  if (!asignacion) {
    asignacion = await prisma.materiaGrupo.create({
      data: { materiaId: materia.id, grupoId: grupo.id, maestroId: maestro.id }
    });
    console.log('Creada Asignación Demo');
  }

  // 5. Alumno Demo
  let alumnoUser = await prisma.usuario.findUnique({ where: { email: 'alumno.demo@escuela.com' } });
  if (!alumnoUser) {
    alumnoUser = await prisma.usuario.create({
      data: {
        email: 'alumno.demo@escuela.com',
        password: passHash,
        nombre: 'Sofía',
        apellido: 'Martínez',
        rol: 'ALUMNO',
        alumno: {
          create: {
            matricula: 'ALU-2024-001',
            grupoId: grupo.id
          }
        }
      }
    });
    console.log('Creado Alumno Demo');
  }

  const alumno = await prisma.alumno.findUnique({ where: { usuarioId: alumnoUser.id } });

  // 6. Calificaciones de ejemplo
  const calif = await prisma.calificacion.findFirst({ where: { alumnoId: alumno.id } });
  if (!calif) {
    await prisma.calificacion.createMany({
      data: [
        { alumnoId: alumno.id, materiaGrupoId: asignacion.id, parcial: 1, calificacion: 9.5, observaciones: 'Excelente desempeño' },
        { alumnoId: alumno.id, materiaGrupoId: asignacion.id, parcial: 2, calificacion: 9.0, observaciones: 'Muy participativa' },
        { alumnoId: alumno.id, materiaGrupoId: asignacion.id, parcial: 3, calificacion: 10.0, observaciones: 'Proyecto destacado' }
      ]
    });
    console.log('Calificaciones creadas');
  }

  // 7. Asistencia de ejemplo
  const asis = await prisma.asistencia.findFirst({ where: { alumnoId: alumno.id } });
  if (!asis) {
    await prisma.asistencia.createMany({
      data: [
        { alumnoId: alumno.id, materiaGrupoId: asignacion.id, fecha: new Date(), estado: 'PRESENTE' }
      ]
    });
    console.log('Asistencias creadas');
  }

  // 8. Horario de ejemplo
  const hor = await prisma.horario.findFirst({ where: { materiaGrupoId: asignacion.id } });
  if (!hor) {
    await prisma.horario.createMany({
      data: [
        { materiaGrupoId: asignacion.id, diaSemana: 'LUNES', horaInicio: '08:00', horaFin: '09:30', salon: 'Aula 101' },
        { materiaGrupoId: asignacion.id, diaSemana: 'MIERCOLES', horaInicio: '08:00', horaFin: '09:30', salon: 'Aula 101' },
        { materiaGrupoId: asignacion.id, diaSemana: 'VIERNES', horaInicio: '10:00', horaFin: '11:30', salon: 'Lab Cómputo' }
      ]
    });
    console.log('Horarios creados');
  }

  // 9. Aviso de ejemplo
  const adminUser = await prisma.usuario.findUnique({ where: { email: 'admin@escuela.com' } });
  if (adminUser) {
    const av = await prisma.aviso.findFirst();
    if (!av) {
      await prisma.aviso.create({
        data: {
          titulo: 'Bienvenida al Ciclo Escolar 2024-2025',
          contenido: 'Estimada comunidad escolar: Les damos una cordial bienvenida al nuevo ciclo escolar. Consulta tus horarios y avisos a través de este portal.',
          tipo: 'GENERAL',
          usuarioId: adminUser.id
        }
      });
      console.log('Aviso creado');
    }
  }
}

async function takeScreenshots() {
  if (!fs.existsSync(CAPTURAS_DIR)) {
    fs.mkdirSync(CAPTURAS_DIR, { recursive: true });
  }

  const chromePath = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

  console.log('Lanzando navegador Chromium...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    defaultViewport: { width: 1280, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  async function snap(filename, delay = 600) {
    await new Promise(r => setTimeout(r, delay));
    const filePath = path.join(CAPTURAS_DIR, filename);
    await page.screenshot({ path: filePath });
    console.log(`✓ Captura guardada: ${filename}`);
  }

  // 1. Landing Page
  console.log('Capturando Landing Page...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await snap('01_landing_institucional.png');

  // 2. Login Page
  console.log('Capturando Login...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
  await snap('02_portal_login.png');

  // Función auxiliar de Login con borrado de cookies previo
  async function login(email, password) {
    const cookies = await page.cookies();
    if (cookies.length > 0) {
      await page.deleteCookie(...cookies);
    }
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    await page.waitForSelector('#email');
    await page.$eval('#email', (el) => el.value = '');
    await page.type('#email', email);
    await page.$eval('#password', (el) => el.value = '');
    await page.type('#password', password);
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
    await new Promise(r => setTimeout(r, 1200));
  }

  // --- CAPTURAS ADMIN ---
  console.log('Iniciando sesión como Administrador...');
  await login('admin@escuela.com', 'admin123');

  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle2' });
  await snap('03_admin_dashboard.png');

  await page.goto('http://localhost:3000/admin/alumnos', { waitUntil: 'networkidle2' });
  await snap('04_admin_alumnos.png');

  await page.goto('http://localhost:3000/admin/maestros', { waitUntil: 'networkidle2' });
  await snap('05_admin_maestros.png');

  await page.goto('http://localhost:3000/admin/materias', { waitUntil: 'networkidle2' });
  await snap('06_admin_materias.png');

  await page.goto('http://localhost:3000/admin/grupos', { waitUntil: 'networkidle2' });
  await snap('07_admin_grupos.png');

  await page.goto('http://localhost:3000/admin/asignaciones', { waitUntil: 'networkidle2' });
  await snap('08_admin_asignaciones.png');

  await page.goto('http://localhost:3000/admin/horarios', { waitUntil: 'networkidle2' });
  await snap('09_admin_horarios.png');

  await page.goto('http://localhost:3000/admin/importar', { waitUntil: 'networkidle2' });
  await snap('10_admin_importar.png');

  await page.goto('http://localhost:3000/admin/reportes', { waitUntil: 'networkidle2' });
  await snap('11_admin_reportes.png');

  await page.goto('http://localhost:3000/admin/perfil', { waitUntil: 'networkidle2' });
  await snap('12_admin_perfil.png');

  // --- CAPTURAS MAESTRO ---
  console.log('Iniciando sesión como Maestro...');
  await login('maestro.demo@escuela.com', 'escuela2024');

  await page.goto('http://localhost:3000/maestro', { waitUntil: 'networkidle2' });
  await snap('13_maestro_dashboard.png');

  await page.goto('http://localhost:3000/maestro/asistencia', { waitUntil: 'networkidle2' });
  await snap('14_maestro_asistencia.png');

  await page.goto('http://localhost:3000/maestro/calificaciones', { waitUntil: 'networkidle2' });
  await snap('15_maestro_calificaciones.png');

  await page.goto('http://localhost:3000/maestro/horario', { waitUntil: 'networkidle2' });
  await snap('16_maestro_horario.png');

  await page.goto('http://localhost:3000/maestro/avisos', { waitUntil: 'networkidle2' });
  await snap('17_maestro_avisos.png');

  // --- CAPTURAS ALUMNO ---
  console.log('Iniciando sesión como Alumno...');
  await login('alumno.demo@escuela.com', 'escuela2024');

  await page.goto('http://localhost:3000/alumno', { waitUntil: 'networkidle2' });
  await snap('18_alumno_dashboard.png');

  await page.goto('http://localhost:3000/alumno/boleta', { waitUntil: 'networkidle2' });
  await snap('19_alumno_boleta.png');

  await page.goto('http://localhost:3000/alumno/asistencia', { waitUntil: 'networkidle2' });
  await snap('20_alumno_asistencia.png');

  await page.goto('http://localhost:3000/alumno/horario', { waitUntil: 'networkidle2' });
  await snap('21_alumno_horario.png');

  await page.goto('http://localhost:3000/alumno/avisos', { waitUntil: 'networkidle2' });
  await snap('22_alumno_avisos.png');

  await browser.close();
  console.log('Todas las capturas se tomaron correctamente.');
}

function imageToBase64(filename) {
  const filePath = path.join(CAPTURAS_DIR, filename);
  if (fs.existsSync(filePath)) {
    const bitmap = fs.readFileSync(filePath);
    return `data:image/png;base64,${bitmap.toString('base64')}`;
  }
  return '';
}

async function generateHtmlAndPdf() {
  console.log('Generando documento HTML estructurado con capturas...');

  const imgLanding = imageToBase64('01_landing_institucional.png');
  const imgLogin = imageToBase64('02_portal_login.png');
  const imgAdminDash = imageToBase64('03_admin_dashboard.png');
  const imgAdminAlumnos = imageToBase64('04_admin_alumnos.png');
  const imgAdminMaestros = imageToBase64('05_admin_maestros.png');
  const imgAdminMaterias = imageToBase64('06_admin_materias.png');
  const imgAdminGrupos = imageToBase64('07_admin_grupos.png');
  const imgAdminAsignaciones = imageToBase64('08_admin_asignaciones.png');
  const imgAdminHorarios = imageToBase64('09_admin_horarios.png');
  const imgAdminImportar = imageToBase64('10_admin_importar.png');
  const imgAdminReportes = imageToBase64('11_admin_reportes.png');
  const imgAdminPerfil = imageToBase64('12_admin_perfil.png');
  const imgMaestroDash = imageToBase64('13_maestro_dashboard.png');
  const imgMaestroAsistencia = imageToBase64('14_maestro_asistencia.png');
  const imgMaestroCalif = imageToBase64('15_maestro_calificaciones.png');
  const imgMaestroHorario = imageToBase64('16_maestro_horario.png');
  const imgMaestroAvisos = imageToBase64('17_maestro_avisos.png');
  const imgAlumnoDash = imageToBase64('18_alumno_dashboard.png');
  const imgAlumnoBoleta = imageToBase64('19_alumno_boleta.png');
  const imgAlumnoAsis = imageToBase64('20_alumno_asistencia.png');
  const imgAlumnoHorario = imageToBase64('21_alumno_horario.png');
  const imgAlumnoAvisos = imageToBase64('22_alumno_avisos.png');

  const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Manual de Usuario — EscuelaApp</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    
    * { box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
      color: #1e293b;
      background: #ffffff;
      line-height: 1.6;
      font-size: 13px;
    }

    @page {
      size: A4;
      margin: 15mm 15mm 20mm 15mm;
    }

    .page-break {
      page-break-before: always;
    }

    /* PORTADA */
    .cover {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 95vh;
      text-align: center;
      padding: 40px;
      border: 3px solid #2563eb;
      border-radius: 16px;
      background: linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%);
    }
    .cover-badge {
      background: #2563eb;
      color: white;
      font-size: 11px;
      font-weight: 700;
      padding: 6px 16px;
      border-radius: 50px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 24px;
    }
    .cover h1 {
      font-size: 34px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 12px 0;
      line-height: 1.2;
    }
    .cover-subtitle {
      font-size: 16px;
      color: #475569;
      max-width: 550px;
      margin: 0 0 30px 0;
    }
    .cover-meta {
      margin-top: 40px;
      padding-top: 24px;
      border-top: 1px solid #cbd5e1;
      width: 100%;
      max-width: 450px;
      display: flex;
      justify-content: space-around;
      font-size: 12px;
      color: #64748b;
    }

    /* ÍNDICE */
    .toc {
      padding: 20px 0;
    }
    .toc h2 {
      font-size: 22px;
      color: #0f172a;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 8px;
    }
    .toc-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px dotted #cbd5e1;
      font-size: 13px;
    }
    .toc-item.level-1 {
      font-weight: 700;
      color: #1e3a8a;
      margin-top: 10px;
    }
    .toc-item.level-2 {
      padding-left: 18px;
      color: #334155;
    }

    /* CONTENIDO */
    h2.chapter-title {
      font-size: 22px;
      font-weight: 800;
      color: #1e3a8a;
      border-left: 6px solid #2563eb;
      padding-left: 12px;
      margin: 24px 0 16px 0;
    }
    h3.section-title {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      margin: 20px 0 8px 0;
    }

    p { margin: 8px 0; text-align: justify; }

    /* CAPTURAS */
    .screenshot-container {
      margin: 14px 0 20px 0;
      text-align: center;
      background: #f8fafc;
      padding: 8px;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .screenshot-container img {
      width: 100%;
      max-height: 480px;
      object-fit: contain;
      border-radius: 6px;
      border: 1px solid #cbd5e1;
    }
    .caption {
      font-size: 11px;
      color: #64748b;
      margin-top: 6px;
      font-style: italic;
    }

    /* ALERTAS / CALLOUTS */
    .callout {
      background: #eff6ff;
      border-left: 4px solid #2563eb;
      padding: 10px 14px;
      border-radius: 0 8px 8px 0;
      margin: 12px 0;
      font-size: 12px;
    }
    .callout.tip {
      background: #f0fdf4;
      border-left-color: #16a34a;
      color: #166534;
    }
    .callout.warning {
      background: #fffbeb;
      border-left-color: #d97706;
      color: #92400e;
    }

    /* TABLAS */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
      font-size: 12px;
    }
    table.data-table th, table.data-table td {
      border: 1px solid #cbd5e1;
      padding: 7px 10px;
      text-align: left;
    }
    table.data-table th {
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 600;
    }

    /* PASOS */
    ol.steps {
      padding-left: 20px;
      margin: 8px 0;
    }
    ol.steps li {
      margin-bottom: 6px;
    }
  </style>
</head>
<body>

  <!-- 1. PORTADA -->
  <div class="cover">
    <div class="cover-badge">Documento Oficial de Operación</div>
    <h1>MANUAL DE USUARIO INTEGRAL</h1>
    <div class="cover-subtitle">Sistema de Gestión Escolar — EscuelaApp<br>Plataforma para Administradores, Docentes y Estudiantes</div>
    
    <div style="font-size: 40px; margin: 20px 0;">🏫 💻 📊</div>

    <div class="cover-meta">
      <div><strong>Institución:</strong><br>Colegio San Martín</div>
      <div><strong>Versión:</strong><br>1.0 (Producción)</div>
      <div><strong>Fecha:</strong><br>${new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
    </div>
  </div>

  <!-- 2. ÍNDICE -->
  <div class="page-break"></div>
  <div class="toc">
    <h2>Índice General de Contenidos</h2>
    <div class="toc-item level-1"><span>1. Introducción y Plataforma Institucional</span><span>Pág. 3</span></div>
    <div class="toc-item level-2"><span>1.1 Descripción General del Sistema</span><span>Pág. 3</span></div>
    <div class="toc-item level-2"><span>1.2 Landing Page Pública de la Escuela</span><span>Pág. 3</span></div>

    <div class="toc-item level-1"><span>2. Control de Acceso y Gestión de Perfil</span><span>Pág. 4</span></div>
    <div class="toc-item level-2"><span>2.1 Inicio de Sesión y Credenciales</span><span>Pág. 4</span></div>
    <div class="toc-item level-2"><span>2.2 Mi Perfil y Actualización de Fotografía</span><span>Pág. 5</span></div>

    <div class="toc-item level-1"><span>3. Manual del Administrador (Directivos)</span><span>Pág. 6</span></div>
    <div class="toc-item level-2"><span>3.1 Panel de Control y Métricas Escolares</span><span>Pág. 6</span></div>
    <div class="toc-item level-2"><span>3.2 Catálogo de Grupos y Materias</span><span>Pág. 7</span></div>
    <div class="toc-item level-2"><span>3.3 Gestión de Alumnos y Fotos de Perfil</span><span>Pág. 8</span></div>
    <div class="toc-item level-2"><span>3.4 Directorio Docente y Especialidades</span><span>Pág. 9</span></div>
    <div class="toc-item level-2"><span>3.5 Asignaciones Académicas (Maestro-Materia-Grupo)</span><span>Pág. 10</span></div>
    <div class="toc-item level-2"><span>3.6 Programación de Horarios Semanales</span><span>Pág. 11</span></div>
    <div class="toc-item level-2"><span>3.7 Importación Masiva desde Excel</span><span>Pág. 12</span></div>
    <div class="toc-item level-2"><span>3.8 Estadísticas y Exportación a CSV</span><span>Pág. 13</span></div>

    <div class="toc-item level-1"><span>4. Manual del Docente (Maestros)</span><span>Pág. 14</span></div>
    <div class="toc-item level-2"><span>4.1 Panel de Bienvenida del Maestro</span><span>Pág. 14</span></div>
    <div class="toc-item level-2"><span>4.2 Toma Diaria de Asistencia Escolar</span><span>Pág. 15</span></div>
    <div class="toc-item level-2"><span>4.3 Captura de Calificaciones por Parcial</span><span>Pág. 16</span></div>
    <div class="toc-item level-2"><span>4.4 Horario Semanal y Emisión de Avisos</span><span>Pág. 17</span></div>

    <div class="toc-item level-1"><span>5. Manual del Estudiante (Alumnos)</span><span>Pág. 18</span></div>
    <div class="toc-item level-2"><span>5.1 Portal de Alumnos y Boleta Digital</span><span>Pág. 18</span></div>
    <div class="toc-item level-2"><span>5.2 Historial de Asistencias y Horario de Clases</span><span>Pág. 19</span></div>
    <div class="toc-item level-2"><span>5.3 Buzón de Avisos y Notificaciones</span><span>Pág. 20</span></div>

    <div class="toc-item level-1"><span>6. Anexo: Formatos Oficiales de Importación Excel</span><span>Pág. 21</span></div>
  </div>

  <!-- 3. CAPÍTULO 1 -->
  <div class="page-break"></div>
  <h2 class="chapter-title">1. Introducción y Plataforma Institucional</h2>
  
  <h3 class="section-title">1.1 Descripción General del Sistema</h3>
  <p>
    <strong>EscuelaApp</strong> es una solución integral basada en web diseñada para modernizar la gestión escolar, la captura de calificaciones, el pase de lista y la comunicación entre directivos, docentes, estudiantes y padres de familia.
  </p>

  <h3 class="section-title">1.2 Landing Page Pública de la Escuela</h3>
  <p>
    La página de inicio de la institución (disponible en la raíz del dominio) presenta la misión, valores, oferta académica y vías de contacto del plantel. Cuenta con botones destacados de <strong>"Acceso al Portal"</strong> para ingresar al sistema seguro.
  </p>
  <div class="screenshot-container">
    <img src="${imgLanding}" alt="Landing Page">
    <div class="caption">Figura 1.1: Landing page institucional de la escuela.</div>
  </div>

  <!-- 4. CAPÍTULO 2 -->
  <div class="page-break"></div>
  <h2 class="chapter-title">2. Control de Acceso y Gestión de Perfil</h2>

  <h3 class="section-title">2.1 Inicio de Sesión y Credenciales</h3>
  <p>
    Para ingresar, dirígete a <code>/login</code> o haz clic en <strong>"Acceso al Portal"</strong>. Ingresa tu correo electrónico y contraseña asignada.
  </p>
  <div class="callout tip">
    <strong>💡 Accesos de Demostración:</strong> La pantalla cuenta con botones de acceso rápido que permiten probar los tres roles del sistema en un solo clic.
  </div>
  <div class="screenshot-container">
    <img src="${imgLogin}" alt="Pantalla de Login">
    <div class="caption">Figura 2.1: Pantalla de inicio de sesión con selección de roles.</div>
  </div>

  <h3 class="section-title">2.2 Mi Perfil y Actualización de Fotografía</h3>
  <p>
    Cada usuario (sea Administrador, Docente o Alumno) puede acceder a <strong>"Mi Perfil"</strong> en el menú lateral para actualizar sus datos personales, cambiar su contraseña o subir su fotografía escolar oficial (formatos admitidos: JPG, PNG, WEBP de hasta 5MB).
  </p>
  <div class="screenshot-container">
    <img src="${imgAdminPerfil}" alt="Mi Perfil">
    <div class="caption">Figura 2.2: Pantalla de perfil personal con botón de carga de fotografía.</div>
  </div>

  <!-- 5. CAPÍTULO 3 -->
  <div class="page-break"></div>
  <h2 class="chapter-title">3. Manual del Administrador (Directivos)</h2>

  <h3 class="section-title">3.1 Panel de Control y Métricas Escolares</h3>
  <p>
    Al iniciar sesión como Administrador, se despliega el Dashboard con las métricas principales en tiempo real: Total de Alumnos matriculados, Docentes activos, Grupos escolares y porcentaje de Asistencia del día.
  </p>
  <div class="screenshot-container">
    <img src="${imgAdminDash}" alt="Dashboard Admin">
    <div class="caption">Figura 3.1: Dashboard principal del Administrador.</div>
  </div>

  <div class="page-break"></div>
  <h3 class="section-title">3.2 Catálogo de Grupos y Materias</h3>
  <p>
    El primer paso de configuración consiste en dar de alta los <strong>Grupos</strong> (ej. 1°A, 2°B con su turno matutino o vespertino) y el catálogo de <strong>Materias</strong> (con su clave única y descripción). Ambas secciones cuentan con formularios modales para agregar, editar o eliminar registros.
  </p>
  <div class="screenshot-container">
    <img src="${imgAdminGrupos}" alt="Grupos Escolares">
    <div class="caption">Figura 3.2: Gestión de Grupos Escolares.</div>
  </div>
  <div class="screenshot-container">
    <img src="${imgAdminMaterias}" alt="Materias">
    <div class="caption">Figura 3.3: Catálogo de Asignaturas y Materias.</div>
  </div>

  <div class="page-break"></div>
  <h3 class="section-title">3.3 Gestión de Alumnos y Fotos de Perfil</h3>
  <p>
    El módulo de <strong>Alumnos</strong> permite registrar estudiantes de forma individual o masiva. La tabla incluye búsqueda en tiempo real, paginación y miniaturas de fotos de perfil.
  </p>
  <div class="callout">
    <strong>📷 Función de Administrador:</strong> Haciendo clic en el icono de cámara en la columna de Acciones, el administrador puede modificar o asignar la foto de perfil de cualquier alumno.
  </div>
  <div class="screenshot-container">
    <img src="${imgAdminAlumnos}" alt="Directorio de Alumnos">
    <div class="caption">Figura 3.4: Directorio de Alumnos con botón de cambio de fotografía y edición.</div>
  </div>

  <div class="page-break"></div>
  <h3 class="section-title">3.4 Directorio Docente y Especialidades</h3>
  <p>
    En la sección <strong>Maestros</strong>, se administra el cuerpo docente del plantel. Al igual que con los alumnos, el administrador puede actualizar las fotografías de los profesores, editar sus datos y definir sus especialidades académicas.
  </p>
  <div class="screenshot-container">
    <img src="${imgAdminMaestros}" alt="Directorio de Maestros">
    <div class="caption">Figura 3.5: Directorio Docente con herramientas de administración de foto.</div>
  </div>

  <div class="page-break"></div>
  <h3 class="section-title">3.5 Asignaciones Académicas (Maestro-Materia-Grupo)</h3>
  <p>
    En la sección <strong>Asignaciones</strong>, se vincula qué profesor imparte qué asignatura a qué grupo específico. Esta configuración es el núcleo de la plataforma, ya que habilita automáticamente las listas de asistencia y las actas de calificación de los maestros.
  </p>
  <div class="screenshot-container">
    <img src="${imgAdminAsignaciones}" alt="Asignaciones Académicas">
    <div class="caption">Figura 3.6: Módulo de vinculación académica docente-materia-grupo.</div>
  </div>

  <div class="page-break"></div>
  <h3 class="section-title">3.6 Programación de Horarios Semanales</h3>
  <p>
    En el módulo de <strong>Horarios</strong>, el directivo programa las horas de clase de cada asignatura asignada seleccionando el día de la semana, la hora de inicio, la hora de término y el aula o laboratorio correspondiente.
  </p>
  <div class="screenshot-container">
    <img src="${imgAdminHorarios}" alt="Programación de Horarios">
    <div class="caption">Figura 3.7: Tabla de Horarios de Clase programados.</div>
  </div>

  <div class="page-break"></div>
  <h3 class="section-title">3.7 Importación Masiva desde Excel</h3>
  <p>
    Para evitar la captura manual de cientos de estudiantes o materias, EscuelaApp incluye un potente importador masivo en <strong>Importar Datos</strong>:
  </p>
  <ol class="steps">
    <li>Selecciona la entidad a importar: <em>Alumnos, Maestros, Materias o Grupos</em>.</li>
    <li>Haz clic en <strong>"Descargar Plantilla Excel"</strong> para obtener el archivo con el encabezado exacto.</li>
    <li>Llena tus datos en Excel y sube el archivo arrastrándolo a la caja de carga.</li>
    <li>El sistema creará automáticamente los usuarios con contraseña inicial por defecto (<code>escuela2024</code>).</li>
  </ol>
  <div class="screenshot-container">
    <img src="${imgAdminImportar}" alt="Importar Excel">
    <div class="caption">Figura 3.8: Módulo de importación masiva y descarga de plantillas.</div>
  </div>

  <div class="page-break"></div>
  <h3 class="section-title">3.8 Estadísticas y Exportación a CSV</h3>
  <p>
    En la sección de <strong>Reportes</strong>, la dirección puede evaluar el comportamiento escolar a través de gráficas interactivas de asistencia mensual y distribución de promedios. Cuenta con el botón de <strong>"Exportar CSV"</strong> para generar archivos compatibles con Excel.
  </p>
  <div class="screenshot-container">
    <img src="${imgAdminReportes}" alt="Reportes y Estadísticas">
    <div class="caption">Figura 3.9: Gráficas analíticas y botón de descarga CSV.</div>
  </div>

  <!-- 6. CAPÍTULO 4 -->
  <div class="page-break"></div>
  <h2 class="chapter-title">4. Manual del Docente (Maestros)</h2>

  <h3 class="section-title">4.1 Panel de Bienvenida del Maestro</h3>
  <p>
    Al ingresar con su cuenta de docente, el maestro visualiza su panel personalizado con sus asignaturas asignadas, sus clases de la jornada y los pendientes de evaluación.
  </p>
  <div class="screenshot-container">
    <img src="${imgMaestroDash}" alt="Dashboard Maestro">
    <div class="caption">Figura 4.1: Panel de inicio del personal docente.</div>
  </div>

  <h3 class="section-title">4.2 Toma Diaria de Asistencia Escolar</h3>
  <p>
    En <strong>Tomar Asistencia</strong>, el maestro selecciona el grupo y materia correspondiente para pasar lista rápidamente marcando los estados: <em>Presente, Ausente, Retardo o Justificado</em> con guardado masivo.
  </p>
  <div class="screenshot-container">
    <img src="${imgMaestroAsistencia}" alt="Toma de Asistencia">
    <div class="caption">Figura 4.2: Interfaz para el registro de asistencias escolares.</div>
  </div>

  <div class="page-break"></div>
  <h3 class="section-title">4.3 Captura de Calificaciones por Parcial</h3>
  <p>
    En <strong>Calificaciones</strong>, el docente captura las evaluaciones de sus alumnos divididas por periodo parcial (1, 2 y 3) con espacio para notas cualitativas u observaciones pedagógicas.
  </p>
  <div class="screenshot-container">
    <img src="${imgMaestroCalif}" alt="Captura de Calificaciones">
    <div class="caption">Figura 4.3: Registro de evaluaciones y calificaciones.</div>
  </div>

  <h3 class="section-title">4.4 Horario Semanal y Emisión de Avisos</h3>
  <p>
    Los maestros pueden consultar su cuadrícula semanal de clases y publicar comunicados directamente a los alumnos de sus grupos.
  </p>
  <div class="screenshot-container">
    <img src="${imgMaestroHorario}" alt="Horario Maestro">
    <div class="caption">Figura 4.4: Horario de clases del docente.</div>
  </div>

  <!-- 7. CAPÍTULO 5 -->
  <div class="page-break"></div>
  <h2 class="chapter-title">5. Manual del Estudiante (Alumnos)</h2>

  <h3 class="section-title">5.1 Portal de Alumnos y Boleta Digital</h3>
  <p>
    Los estudiantes cuentan con un portal intuitivo donde pueden consultar su rendimiento académico. En <strong>Mi Boleta</strong>, el alumno visualiza sus calificaciones desglosadas por parcial, promedio por asignatura y promedio general acumulado, con la opción de <strong>Imprimir Boleta Oficial</strong>.
  </p>
  <div class="screenshot-container">
    <img src="${imgAlumnoBoleta}" alt="Boleta Digital del Alumno">
    <div class="caption">Figura 5.1: Boleta digital de calificaciones con cálculo automático de promedios.</div>
  </div>

  <div class="page-break"></div>
  <h3 class="section-title">5.2 Historial de Asistencias y Horario de Clases</h3>
  <p>
    El alumno puede dar seguimiento a sus asistencias y faltas por materia, así como revisar su horario de clases semanal con aulas asignadas.
  </p>
  <div class="screenshot-container">
    <img src="${imgAlumnoAsis}" alt="Asistencia del Alumno">
    <div class="caption">Figura 5.2: Historial de asistencia y faltas del alumno.</div>
  </div>
  <div class="screenshot-container">
    <img src="${imgAlumnoHorario}" alt="Horario del Alumno">
    <div class="caption">Figura 5.3: Horario semanal del estudiante.</div>
  </div>

  <div class="page-break"></div>
  <h3 class="section-title">5.3 Buzón de Avisos y Notificaciones</h3>
  <p>
    En la sección <strong>Avisos</strong>, el estudiante consulta comunicados institucionales y de sus profesores, pudiendo marcarlos como leídos una vez revisados.
  </p>
  <div class="screenshot-container">
    <img src="${imgAlumnoAvisos}" alt="Avisos del Alumno">
    <div class="caption">Figura 5.4: Buzón de avisos y notificaciones escolares.</div>
  </div>

  <!-- 8. ANEXO -->
  <div class="page-break"></div>
  <h2 class="chapter-title">6. Anexo: Formatos Oficiales de Importación Excel</h2>
  <p>
    Para asegurar una importación exitosa, los archivos <code>.xlsx</code> o <code>.csv</code> deben contener exactamente los siguientes nombres de columna en la primera fila:
  </p>

  <h3 class="section-title">Plantilla de Alumnos</h3>
  <table class="data-table">
    <thead>
      <tr>
        <th>nombre</th>
        <th>apellido</th>
        <th>email</th>
        <th>matricula</th>
        <th>grupo</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Carlos</td>
        <td>Gómez</td>
        <td>carlos.gomez@escuela.com</td>
        <td>ALU-2024-010</td>
        <td>1°A</td>
      </tr>
    </tbody>
  </table>

  <h3 class="section-title">Plantilla de Maestros</h3>
  <table class="data-table">
    <thead>
      <tr>
        <th>nombre</th>
        <th>apellido</th>
        <th>email</th>
        <th>especialidad</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Mariana</td>
        <td>López</td>
        <td>mariana.lopez@escuela.com</td>
        <td>Historia y Geografía</td>
      </tr>
    </tbody>
  </table>

  <h3 class="section-title">Plantilla de Materias</h3>
  <table class="data-table">
    <thead>
      <tr>
        <th>nombre</th>
        <th>clave</th>
        <th>descripcion</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Física General</td>
        <td>FIS01</td>
        <td>Mecánica clásica y termodinámica</td>
      </tr>
    </tbody>
  </table>

  <h3 class="section-title">Plantilla de Grupos</h3>
  <table class="data-table">
    <thead>
      <tr>
        <th>nombre</th>
        <th>grado</th>
        <th>turno</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>2°B</td>
        <td>2</td>
        <td>MATUTINO</td>
      </tr>
    </tbody>
  </table>

  <div class="callout warning" style="margin-top: 24px;">
    <strong>⚠️ Nota de Seguridad:</strong> Todos los usuarios importados se crean automáticamente con la contraseña inicial <code>escuela2024</code>. Cada usuario debe cambiarla desde "Mi Perfil" al ingresar por primera vez.
  </div>

</body>
</html>`;

  fs.writeFileSync(HTML_OUTPUT, htmlContent, 'utf-8');
  console.log(`✓ Archivo HTML guardado en: ${HTML_OUTPUT}`);

  // Generar PDF usando Puppeteer
  const chromePath = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

  console.log('Compilando documento PDF con Puppeteer...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: PDF_OUTPUT,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '15mm',
      bottom: '18mm',
      left: '15mm',
      right: '15mm'
    },
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: '<div style="font-size: 9px; text-align: center; width: 100%; color: #94a3b8; font-family: sans-serif;">Colegio San Martín — Manual de Usuario EscuelaApp — Página <span class="pageNumber"></span> de <span class="totalPages"></span></div>'
  });

  await browser.close();
  console.log(`🎉 ¡PDF generado con éxito en: ${PDF_OUTPUT}`);
}

async function main() {
  try {
    await ensureSampleData();
    await takeScreenshots();
    await generateHtmlAndPdf();
    console.log('=== Proceso completo finalizado exitosamente ===');
  } catch (err) {
    console.error('Error durante la generación:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();

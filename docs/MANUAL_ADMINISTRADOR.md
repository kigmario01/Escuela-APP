# 👑 Manual del Administrador

Bienvenido al manual del administrador de EscuelaApp. Aquí encontrarás paso a paso cómo gestionar toda la plataforma.

## Acceso al Sistema
1. Abre tu navegador web y dirígete a la página principal de EscuelaApp.
2. Ingresa tus credenciales de administrador (Email y contraseña). Por defecto: `admin@escuela.com` / `admin123`.
3. Haz clic en **Ingresar**.

---

## Paso 1: Configuración Inicial (Grupos y Materias)
Antes de agregar usuarios, debes crear el entorno escolar.

*   **Para crear Grupos:**
    1. Ve a la sección **Grupos** en el menú lateral.
    2. Haz clic en "Nuevo Grupo".
    3. Ingresa el Nombre (Ej. "1-A"), Grado y Turno. Guarda los cambios.
*   **Para crear Materias:**
    1. Ve a **Materias**.
    2. Haz clic en "Nueva Materia".
    3. Ingresa el Nombre, Clave (Ej. "MAT01") y una breve descripción.

---

## Paso 2: Registro de Maestros y Alumnos

> [!TIP]
> Puedes registrarlos individualmente o usar la importación masiva. Para masiva, consulta la [Guía de Importación Excel](./GUIA_IMPORTACION_EXCEL.md).

*   **Para registrar individualmente:**
    1. Ve a la sección de **Maestros** o **Alumnos**.
    2. Haz clic en el botón de agregar ("Nuevo Maestro" o "Nuevo Alumno").
    3. Llena los datos requeridos (Nombre, correo, etc.). Al crear un alumno, debes asignarlo a uno de los **Grupos** creados en el Paso 1.

---

## Paso 3: Asignaciones (Materia + Grupo + Maestro)
Una vez que tienes maestros, grupos y materias, debes conectarlos.

1. Ve a **Asignaciones Académicas**.
2. Haz clic en "Nueva Asignación".
3. Selecciona:
   *   El **Maestro** que impartirá la clase.
   *   La **Materia** que se enseñará.
   *   El **Grupo** al que se le enseñará.
4. Guarda la asignación.

---

## Paso 4: Configurar Horarios
Una vez hecha la asignación, debes definir en qué momentos de la semana se impartirá la clase.

1. Ve a **Horarios**.
2. Selecciona un Grupo o un Maestro para ver su cuadrícula semanal.
3. Haz clic en "Agregar Clase".
4. Selecciona la asignación (Ej. "Matemáticas - 1-A"), el Día de la semana, Hora de inicio y Hora de fin.

---

## Paso 5: Gestión de Fotos de Perfil
*   **Tu propia foto:** Ve a "Mi Perfil" en la esquina superior derecha y usa el botón de subir imagen para cambiar tu foto.
*   **Fotos de otros usuarios:** En la lista de Maestros o Alumnos, puedes editar el perfil de un usuario haciendo clic en el icono de cámara junto a su avatar para subir una foto representativa.

---

## Paso 6: Avisos Generales
Puedes enviar avisos urgentes o comunicados a toda la escuela o grupos específicos.

1. Ve a **Avisos**.
2. Haz clic en "Nuevo Aviso".
3. Escribe el Título y el Contenido.
4. Selecciona los destinatarios (Todos los alumnos, o selecciona grupos específicos).
5. Publicar.

---

## Paso 7: Métricas y Exportación de Reportes
*   **Dashboard:** Al iniciar sesión, verás un panel con métricas clave (Total de alumnos, asistencia promedio diaria, etc.).
*   **Exportar datos:** En la sección **Reportes**, puedes hacer clic en "Exportar a CSV" para obtener listas de alumnos, calificaciones generales o reportes de asistencia para abrirlos en Excel.

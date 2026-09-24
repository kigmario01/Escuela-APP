# 🏗️ Arquitectura y API de EscuelaApp

Este documento describe la arquitectura de la base de datos de EscuelaApp y detalla todos los endpoints de la API REST que sirven a la aplicación.

## 🗄️ Modelos de Base de Datos (Prisma)

El esquema de base de datos consta de 12 modelos principales conectados a través de relaciones:

1.  **Usuario**: Modelo central de autenticación y autorización (Admin, Maestro, Alumno).
2.  **Maestro**: Perfil extendido del usuario con rol Maestro. Relacionado con Grupos y Materias asignadas.
3.  **Alumno**: Perfil extendido del usuario con rol Alumno. Pertenece a un Grupo.
4.  **Grupo**: Agrupación de alumnos (Ej. "1° A"). Relacionado con Materias (MateriaGrupo) y Alumnos.
5.  **Materia**: Asignaturas escolares (Ej. "Matemáticas").
6.  **MateriaGrupo**: Relación muchos-a-muchos entre Grupo, Materia y Maestro asignado.
7.  **Asistencia**: Registro de asistencias de alumnos por fecha y clase (Presente, Ausente, etc.).
8.  **Calificacion**: Calificaciones por alumno, materia y periodo (Parcial 1, 2, 3).
9.  **Horario**: Definición del horario semanal (Día, hora inicio, hora fin) para una MateriaGrupo.
10. **Aviso**: Anuncios publicados por Administradores o Maestros.
11. **AvisoDestinatario**: Relación que especifica qué grupo(s) deben ver un Aviso.
12. **AvisoLeido**: Registro para rastrear si un Alumno ha leído un aviso específico.

### Relaciones Entidad-Relación (ER)
*   `Usuario` (1) ↔ (1) `Maestro` / `Alumno`
*   `Grupo` (1) ↔ (N) `Alumno`
*   `MateriaGrupo` vincula una `Materia`, un `Grupo` y un `Maestro`.
*   Las `Asistencia` y `Calificacion` están vinculadas directamente al `Alumno` y a la `MateriaGrupo`.

---

## 🔌 Referencia de la API REST

Todos los endpoints (excepto `/api/auth`) requieren una sesión activa válida manejada por NextAuth.

### Autenticación (`/api/auth/*`)
Manejado automáticamente por NextAuth.js (Login, Logout, Sesión).

### Perfil y Subidas (`/api/perfil/*`)
*   `GET /api/perfil` - Obtener datos del perfil del usuario autenticado.
*   `PUT /api/perfil` - Actualizar información básica (teléfono, biografía).
*   `POST /api/upload/foto` - Subir/actualizar foto de perfil (FormData).

### Alumnos (`/api/alumnos/*`)
*   `GET /api/alumnos` - Listar todos los alumnos (soporta `?grupoId=X`).
*   `POST /api/alumnos` - Crear un nuevo alumno.
*   `GET /api/alumnos/[id]` - Obtener detalles de un alumno.
*   `PUT /api/alumnos/[id]` - Actualizar un alumno.
*   `DELETE /api/alumnos/[id]` - Eliminar un alumno.

### Maestros (`/api/maestros/*`)
*   `GET /api/maestros` - Listar todos los maestros.
*   `POST /api/maestros` - Crear un nuevo maestro.
*   `PUT /api/maestros/[id]` - Actualizar maestro.
*   `DELETE /api/maestros/[id]` - Eliminar maestro.

### Materias y Grupos (`/api/materias/*`, `/api/grupos/*`)
*   `GET /api/materias` - Listar materias del catálogo.
*   `POST /api/materias` - Crear nueva materia.
*   `GET /api/grupos` - Listar grupos (Ej. "1-A").
*   `POST /api/grupos` - Crear nuevo grupo.

### Asignaciones Escolares (`/api/asignaciones/*`)
*   `POST /api/asignaciones` - Asignar (Materia + Grupo + Maestro).
*   `DELETE /api/asignaciones/[id]` - Eliminar asignación.

### Horarios (`/api/horarios/*`)
*   `GET /api/horarios?grupoId=[id]` - Obtener el horario de un grupo.
*   `GET /api/horarios?maestroId=[id]` - Obtener el horario de un maestro.
*   `POST /api/horarios` - Crear una franja horaria.

### Asistencia y Calificaciones (`/api/asistencia/*`, `/api/calificaciones/*`)
*   `GET /api/asistencia?materiaGrupoId=[id]&fecha=[date]` - Obtener asistencias de una clase en una fecha.
*   `POST /api/asistencia` - Guardar o actualizar registro de asistencia en lote.
*   `GET /api/calificaciones?materiaGrupoId=[id]` - Listar calificaciones de un grupo en una materia.
*   `POST /api/calificaciones` - Guardar/actualizar calificación de un alumno.

### Boleta Digital (`/api/boleta/*`)
*   `GET /api/boleta?alumnoId=[id]` - Obtiene todas las calificaciones finales y faltas de un alumno agrupadas para el reporte.

### Avisos (`/api/avisos/*`)
*   `GET /api/avisos` - Listar avisos (filtrado según el rol del usuario).
*   `POST /api/avisos` - Publicar un nuevo aviso.
*   `POST /api/avisos/[id]/leer` - Marcar aviso como leído (para Alumnos).

### Importación y Exportación (`/api/import/*`, `/api/export/*`)
*   `POST /api/import/alumnos` - Carga masiva de alumnos vía archivo Excel/CSV.
*   `POST /api/import/maestros` - Carga masiva de maestros vía archivo Excel/CSV.
*   `GET /api/export/reportes` - Exportar datos del sistema en formato CSV para reportes administrativos.

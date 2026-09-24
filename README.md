# 🏫 EscuelaApp

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

EscuelaApp es un sistema de gestión escolar moderno e intuitivo diseñado para facilitar la administración, el seguimiento académico y la comunicación entre administradores, maestros y alumnos.

## 🚀 Tecnologías

*   **Framework Frontend/Backend:** Next.js 16 (App Router)
*   **ORM de Base de Datos:** Prisma 5
*   **Estilos:** Tailwind CSS
*   **Autenticación:** NextAuth.js
*   **Iconos:** Lucide Icons
*   **Base de Datos:** SQLite (desarrollo) / PostgreSQL (producción listo)

## 📁 Estructura del Proyecto

```text
escuela-app/
├── prisma/             # Esquema de base de datos y migraciones
├── public/             # Archivos estáticos e imágenes
├── src/
│   ├── app/            # Rutas de la aplicación (Next.js App Router)
│   │   ├── api/        # Endpoints REST API
│   │   ├── admin/      # Dashboard y vistas de administrador
│   │   ├── maestro/    # Vistas de maestro
│   │   ├── alumno/     # Vistas de alumno
│   │   └── auth/       # Rutas de autenticación
│   ├── components/     # Componentes UI reutilizables
│   └── lib/            # Utilidades, configuración de Prisma y servicios
└── docs/               # Documentación y manuales de usuario
```

## 🛠️ Instalación y Configuración Local

1.  **Clonar el repositorio y entrar a la carpeta:**
    ```bash
    git clone <repositorio>
    cd escuela-app
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crear un archivo `.env` en la raíz del proyecto y agregar:
    ```env
    DATABASE_URL="file:./dev.db"
    NEXTAUTH_SECRET="tu_secreto_seguro"
    NEXTAUTH_URL="http://localhost:3000"
    ```

4.  **Generar la base de datos y sincronizar Prisma:**
    ```bash
    npx prisma db push
    npx prisma generate
    ```

5.  **Poblar datos iniciales (Seed):**
    Ejecutar el script para crear el administrador y datos de prueba.
    ```bash
    npm run seed
    ```

6.  **Iniciar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

## 🔐 Credenciales por Defecto

Después de ejecutar el seed, puedes iniciar sesión con las siguientes credenciales:

*   **Email:** `admin@escuela.com`
*   **Contraseña:** `admin123`
*   **Rol:** Administrador

## 🐳 Despliegue con Docker

La aplicación está completamente dockerizada con compilación multi-stage optimizada.

### 1. Levantar con Docker Compose
```bash
docker compose up -d --build
```

### 2. Acceder al sistema
Abre tu navegador en: **`http://localhost:3000`**

### 3. Detener la aplicación
```bash
docker compose down
```

> [!NOTE]
> Los datos de la escuela (base de datos y fotos de perfil) se almacenan de forma persistente en los volúmenes de Docker `escuela_data` y `escuela_uploads`.

---

## 📚 Documentación

Revisa la carpeta `docs/` para ver manuales detallados y la arquitectura de la aplicación:

*   📕 **[Manual de Usuario en PDF](./docs/MANUAL_DE_USUARIO_ESCUELAAPP.pdf)** (Con 22 capturas de pantalla)
*   [Arquitectura y API REST](./docs/ARQUITECTURA_Y_API.md)
*   [Manual del Administrador](./docs/MANUAL_ADMINISTRADOR.md)
*   [Manual del Maestro](./docs/MANUAL_MAESTRO.md)
*   [Manual del Alumno](./docs/MANUAL_ALUMNO.md)
*   [Guía de Importación desde Excel](./docs/GUIA_IMPORTACION_EXCEL.md)

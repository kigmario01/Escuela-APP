# 📊 Guía de Importación Masiva (Excel/CSV)

Esta guía explica cómo los **Administradores** pueden cargar rápidamente decenas de usuarios o registros usando archivos de Excel (`.xlsx`) o `.csv`.

## Reglas Generales
*   La primera fila de tu archivo Excel SIEMPRE debe ser el **encabezado** (los nombres de las columnas exactamente como se indican abajo).
*   Evita dejar filas en blanco entre los datos.
*   Guarda tu archivo como CSV o XLSX antes de subirlo al sistema.

---

## 1. Importar Alumnos

El sistema requiere que los grupos ya existan antes de importar a los alumnos para poder asignarlos correctamente.

### Estructura de Columnas (Plantilla de Alumnos)

| nombre | apellido | email | matricula | grupo |
| :--- | :--- | :--- | :--- | :--- |
| Juan | Pérez | juan@escuela.com | 2023001 | 1-A |
| María | López | maria@escuela.com | 2023002 | 1-B |

> [!WARNING]
> La columna `grupo` debe coincidir **exactamente** con el nombre de un grupo existente en el sistema (Ej. si creaste "1° A", no pongas "1A" en el Excel).

---

## 2. Importar Maestros

### Estructura de Columnas (Plantilla de Maestros)

| nombre | apellido | email | especialidad |
| :--- | :--- | :--- | :--- |
| Carlos | Ruiz | carlos.r@escuela.com | Matemáticas |
| Ana | Gómez | ana.g@escuela.com | Ciencias |

---

## 3. Importar Materias

### Estructura de Columnas (Plantilla de Materias)

| nombre | clave | descripcion |
| :--- | :--- | :--- |
| Matemáticas I | MAT01 | Álgebra básica y aritmética |
| Historia de México | HIS01 | Historia desde época prehispánica |

---

## 4. Importar Grupos

### Estructura de Columnas (Plantilla de Grupos)

| nombre | grado | turno |
| :--- | :--- | :--- |
| 1-A | 1 | Matutino |
| 2-B | 2 | Vespertino |

---

## 🚀 Proceso de Carga Paso a Paso

1. Inicia sesión como **Administrador**.
2. Ve a la sección **Importar/Exportar Datos** en el panel lateral.
3. Selecciona qué tipo de datos vas a subir (Alumnos, Maestros, etc.) en el menú desplegable.
4. Haz clic en el área de carga o arrastra tu archivo `.xlsx` / `.csv` ahí.
5. El sistema mostrará una vista previa de los datos encontrados. Revisa que no haya errores.
6. Haz clic en **"Procesar Importación"**.

### 🔐 Sobre las Contraseñas de Usuarios Importados

Cuando importas Alumnos o Maestros, el sistema crea sus cuentas automáticamente. Como no especificaste una contraseña en el Excel, el sistema asignará una **contraseña por defecto**:

*   **Para Alumnos:** La contraseña por defecto será su misma **matrícula**.
*   **Para Maestros:** La contraseña por defecto será `maestro123`.

Se recomienda que se les pida cambiar su contraseña al iniciar sesión por primera vez.

---

## 🛠️ Solución de Problemas Comunes

*   **Error: "El email ya existe"**: Estás intentando subir un usuario con un correo que ya está registrado en la base de datos. Los emails deben ser únicos.
*   **Error: "Grupo no encontrado"**: Ocurre al importar alumnos. Revisa que los nombres en la columna `grupo` de tu Excel sean idénticos a los nombres de los grupos ya registrados en la plataforma.
*   **Acentos y Ñ:** Si subes un archivo `.csv` y ves caracteres raros en vez de acentos, asegúrate de guardar el CSV con codificación **UTF-8** desde Excel.

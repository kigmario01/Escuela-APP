import { z } from "zod";

export const UsuarioSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  nombre: z.string().min(2),
  apellido: z.string().min(2),
  rol: z.enum(['ADMIN', 'MAESTRO', 'ALUMNO']).optional(),
  activo: z.boolean().optional(),
});

export const AlumnoSchema = z.object({
  usuario: UsuarioSchema,
  matricula: z.string().min(3),
  grupoId: z.string().optional(),
});

export const MaestroSchema = z.object({
  usuario: UsuarioSchema,
  especialidad: z.string().optional(),
});

export const GrupoSchema = z.object({
  nombre: z.string().min(1),
  grado: z.number().int().positive(),
  turno: z.string().min(1),
});

export const MateriaSchema = z.object({
  nombre: z.string().min(1),
  descripcion: z.string().optional(),
  clave: z.string().min(1),
});

export const AsistenciaSchema = z.object({
  alumnoId: z.string(),
  materiaGrupoId: z.string(),
  fecha: z.string().datetime(), // ISO string
  estado: z.enum(['PRESENTE', 'AUSENTE', 'RETARDO', 'JUSTIFICADO']),
});

export const CalificacionSchema = z.object({
  alumnoId: z.string(),
  materiaGrupoId: z.string(),
  parcial: z.number().int().min(1).max(3),
  calificacion: z.number().min(0).max(10),
  observaciones: z.string().optional(),
});

export const HorarioSchema = z.object({
  materiaGrupoId: z.string(),
  diaSemana: z.string(),
  horaInicio: z.string(),
  horaFin: z.string(),
  salon: z.string().optional(),
});

export const AvisoSchema = z.object({
  titulo: z.string().min(1),
  contenido: z.string().min(1),
  tipo: z.enum(['GENERAL', 'GRUPO', 'PERSONAL']),
  destinatarios: z.array(z.string()).optional(), // Array of grupoIds for TipoAviso.GRUPO
});

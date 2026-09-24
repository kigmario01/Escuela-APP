export const Rol = {
  ADMIN: 'ADMIN',
  MAESTRO: 'MAESTRO',
  ALUMNO: 'ALUMNO'
} as const;
export type Rol = keyof typeof Rol;

export const EstadoAsistencia = {
  PRESENTE: 'PRESENTE',
  AUSENTE: 'AUSENTE',
  RETARDO: 'RETARDO',
  JUSTIFICADO: 'JUSTIFICADO'
} as const;
export type EstadoAsistencia = keyof typeof EstadoAsistencia;

export const TipoAviso = {
  GENERAL: 'GENERAL',
  GRUPO: 'GRUPO',
  PERSONAL: 'PERSONAL'
} as const;
export type TipoAviso = keyof typeof TipoAviso;
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      rol: Rol;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    rol: Rol;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    rol: Rol;
  }
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}

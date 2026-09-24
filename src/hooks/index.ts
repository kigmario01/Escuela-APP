"use client";

import { useState, useEffect } from "react";

function useFetchData(endpoint: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error("Error al cargar datos");
      const json = await res.json();
      setData(Array.isArray(json) ? json : json.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [endpoint]);

  return { data, loading, error, refetch };
}

export function useAlumnos() {
  const res = useFetchData("/api/alumnos");
  return { ...res, alumnos: res.data };
}

export function useMaestros() {
  const res = useFetchData("/api/maestros");
  return { ...res, maestros: res.data };
}

export function useMaterias() {
  const res = useFetchData("/api/materias");
  return { ...res, materias: res.data };
}

export function useGrupos() {
  const res = useFetchData("/api/grupos");
  return { ...res, grupos: res.data };
}

export function useAvisos() {
  const res = useFetchData("/api/avisos");
  return { ...res, avisos: res.data };
}

export function useAsistencia() {
  const res = useFetchData("/api/asistencia");
  return { ...res, asistencia: res.data };
}

export function useCalificaciones() {
  const res = useFetchData("/api/calificaciones");
  return { ...res, calificaciones: res.data };
}

export function useHorarios() {
  const res = useFetchData("/api/horarios");
  return { ...res, horarios: res.data };
}

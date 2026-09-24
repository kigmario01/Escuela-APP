"use client";
import { useState, useEffect } from 'react';

export function useAlumnos() {
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlumnos = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/alumnos');
      if (!res.ok) throw new Error('Error al cargar alumnos');
      const json = await res.json();
      setAlumnos(Array.isArray(json) ? json : json.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumnos();
  }, []);

  return { alumnos, data: alumnos, loading, error, fetchAlumnos };
}

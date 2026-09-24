"use client";
import React, { useEffect, useState } from 'react';

export default function MaestroDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/dashboard').then(r => r.json()).then(d => setData(d));
  }, []);

  if (!data) return <div className="p-6">Cargando...</div>;
  if (!data.totalAlumnos) return <div className="p-6">Sin datos aún. Comienza importando datos.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Maestro</h1>
      <p>Bienvenido. Tus grupos y alumnos están listos.</p>
    </div>
  );
}

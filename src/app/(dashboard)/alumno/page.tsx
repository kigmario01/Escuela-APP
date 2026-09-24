"use client";
import React, { useEffect, useState } from 'react';

export default function AlumnoDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/dashboard').then(r => r.json()).then(d => setData(d));
  }, []);

  if (!data) return <div className="p-6">Cargando...</div>;
  if (!data.promedioGeneral) return <div className="p-6">Sin datos registrados.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mi Dashboard</h1>
      <p>Promedio General: {data.promedioGeneral}</p>
      <p>Asistencia: {data.asistenciaPorcentaje}%</p>
    </div>
  );
}

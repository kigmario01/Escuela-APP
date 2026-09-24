"use client";
import React, { useEffect, useState } from 'react';
import { KPICard } from '@/components/charts/KPICard';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/dashboard').then(r => r.json()).then(d => setData(d));
  }, []);

  if (!data) return <div className="p-6">Cargando...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Administrador</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Alumnos" value={data.totalAlumnos || 0} />
        <KPICard title="Total Maestros" value={data.totalMaestros || 0} />
        <KPICard title="Grupos Activos" value={data.gruposActivos || 0} />
        <KPICard title="Asistencia de Hoy" value={`${data.asistenciaHoy || 0}%`} />
      </div>
    </div>
  );
}

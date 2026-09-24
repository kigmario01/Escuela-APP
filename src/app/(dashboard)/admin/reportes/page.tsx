"use client";
import React from 'react';
import { AsistenciaChart } from '@/components/charts/AsistenciaChart';
import { CalificacionesChart } from '@/components/charts/CalificacionesChart';

export default function ReportesPage() {
  const handleExport = async (type: string) => {
    window.location.href = `/api/export?type=${type}`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reportes y Estadísticas</h1>
        <button onClick={() => handleExport('reporte')} className="bg-green-600 text-white px-4 py-2 rounded">Exportar CSV</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-4">Asistencia Mensual</h2>
          <AsistenciaChart />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-4">Promedios por Materia</h2>
          <CalificacionesChart />
        </div>
      </div>
    </div>
  );
}

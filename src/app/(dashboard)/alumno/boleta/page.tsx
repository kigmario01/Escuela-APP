"use client";
import React, { useState, useEffect } from "react";

export default function BoletaPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/boleta");
        const json = await res.json();
        setData(json.data || json || null);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Cargando boleta...</div>;
  }

  if (!data || !data.calificaciones || data.calificaciones.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-lg shadow-sm border m-6">
        Sin calificaciones registradas aún
      </div>
    );
  }

  const { alumno, calificaciones, promedioGeneral } = data;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6 no-print">
        <h1 className="text-2xl font-bold text-slate-800">Boleta de Calificaciones</h1>
        <button 
          onClick={() => window.print()} 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Imprimir Boleta
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm print:shadow-none print:border-none">
        <div className="border-b pb-4 mb-6">
          <h2 className="text-xl font-bold text-blue-800 mb-2">EscuelaApp</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><span className="font-semibold text-slate-500">Alumno:</span> {alumno?.nombre} {alumno?.apellido}</p>
              <p><span className="font-semibold text-slate-500">Matrícula:</span> {alumno?.matricula}</p>
            </div>
            <div>
              <p><span className="font-semibold text-slate-500">Grupo:</span> {alumno?.grupo?.nombre || "No asignado"}</p>
              <p><span className="font-semibold text-slate-500">Fecha:</span> {new Date().toLocaleDateString('es-MX')}</p>
            </div>
          </div>
        </div>

        <table className="w-full text-sm text-left border-collapse mb-6">
          <thead className="bg-blue-50 text-blue-900 border-b-2 border-blue-200">
            <tr>
              <th className="px-4 py-3 border-r border-blue-100">Materia</th>
              <th className="px-4 py-3 border-r border-blue-100 text-center w-24">Parcial 1</th>
              <th className="px-4 py-3 border-r border-blue-100 text-center w-24">Parcial 2</th>
              <th className="px-4 py-3 border-r border-blue-100 text-center w-24">Parcial 3</th>
              <th className="px-4 py-3 text-center w-24 font-bold">Promedio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {calificaciones.map((c: any, i: number) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-4 py-3 border-r">{c.materia}</td>
                <td className="px-4 py-3 border-r text-center">{c.p1 !== null ? c.p1 : "-"}</td>
                <td className="px-4 py-3 border-r text-center">{c.p2 !== null ? c.p2 : "-"}</td>
                <td className="px-4 py-3 border-r text-center">{c.p3 !== null ? c.p3 : "-"}</td>
                <td className="px-4 py-3 text-center font-semibold bg-slate-50">{c.promedio !== null ? c.promedio : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="bg-blue-600 text-white p-4 rounded-lg shadow-md text-center min-w-[200px]">
            <p className="text-sm opacity-80 mb-1">Promedio General</p>
            <p className="text-3xl font-bold">{promedioGeneral}</p>
          </div>
        </div>
        
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            .no-print { display: none !important; }
            body { background-color: white; }
          }
        `}} />
      </div>
    </div>
  );
}

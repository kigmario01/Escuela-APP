"use client";
import React, { useState } from 'react';

export default function ImportarPage() {
  const [tipo, setTipo] = useState("alumnos");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`/api/import?type=${tipo}`, { method: 'POST', body: formData });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ error: "Error al importar" });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Importar Datos desde Excel</h1>
      <div className="bg-white p-6 rounded shadow max-w-lg">
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Tipo de datos</label>
          <select value={tipo} onChange={e => setTipo(e.target.value)} className="border p-2 w-full rounded">
            <option value="alumnos">Alumnos</option>
            <option value="maestros">Maestros</option>
            <option value="materias">Materias</option>
            <option value="grupos">Grupos</option>
          </select>
        </div>
        <div className="mb-4">
          <button onClick={() => window.location.href = `/api/import/template?type=${tipo}`} className="text-blue-600 underline">
            Descargar Plantilla
          </button>
        </div>
        <div className="mb-4 border-2 border-dashed p-6 text-center rounded">
          <input type="file" accept=".xlsx" onChange={e => setFile(e.target.files?.[0] || null)} />
        </div>
        <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-2 rounded w-full">Importar Datos</button>
        
        {result && (
          <div className="mt-4 p-4 bg-slate-100 rounded">
            {result.error ? (
              <p className="text-red-500">{result.error}</p>
            ) : (
              <p>{result.creados || 0} registros creados, {result.omitidos || 0} omitidos, {result.errores || 0} errores.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

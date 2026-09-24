"use client";
import React, { useState, useEffect } from 'react';

export default function AvisosAlumno() {
  const [avisos, setAvisos] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/avisos').then(r => r.json()).then(d => setAvisos(d.data || d || []));
  }, []);

  const marcarLeido = async (id: string) => {
    await fetch(`/api/avisos/${id}/leer`, { method: 'POST' });
    setAvisos(avisos.map((a: any) => a.id === id ? { ...a, leido: true } : a));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mis Avisos</h1>
      {avisos.length === 0 ? <p>Sin datos aún.</p> : (
        <div className="space-y-4">
          {avisos.map((a: any) => (
            <div key={a.id} className={`p-4 border rounded shadow ${a.leido ? 'bg-slate-50' : 'bg-white'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-bold text-lg">{a.titulo} {!a.leido && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded ml-2">Nuevo</span>}</h2>
                  <p className="mt-2">{a.contenido}</p>
                </div>
                {!a.leido && (
                  <button onClick={() => marcarLeido(a.id)} className="bg-slate-200 hover:bg-slate-300 px-3 py-1 rounded text-sm">
                    Marcar como leído
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

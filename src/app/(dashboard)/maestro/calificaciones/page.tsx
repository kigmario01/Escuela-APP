"use client";
import React, { useState, useEffect } from 'react';

export default function CalificacionesMaestro() {
  const [grupos, setGrupos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [selectedGrupo, setSelectedGrupo] = useState("");
  const [selectedMateria, setSelectedMateria] = useState("");
  const [parcial, setParcial] = useState("1");
  const [calificaciones, setCalificaciones] = useState<any>({});

  useEffect(() => {
    fetch('/api/grupos').then(r => r.json()).then(d => setGrupos(d.data || d || []));
    fetch('/api/materias').then(r => r.json()).then(d => setMaterias(d.data || d || []));
  }, []);

  useEffect(() => {
    if (selectedGrupo) {
      fetch(`/api/alumnos?grupoId=${selectedGrupo}`).then(r => r.json()).then(d => {
        setAlumnos(d.data || d || []);
        const initial: any = {};
        (d.data || d || []).forEach((a: any) => initial[a.id] = { valor: 0, obs: '' });
        setCalificaciones(initial);
      });
    }
  }, [selectedGrupo]);

  const handleGuardar = async () => {
    await fetch('/api/calificaciones', {
      method: 'POST',
      body: JSON.stringify({ grupoId: selectedGrupo, materiaId: selectedMateria, parcial, registros: calificaciones }),
      headers: { 'Content-Type': 'application/json' }
    });
    alert('Calificaciones guardadas');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Registrar Calificaciones</h1>
      <div className="flex space-x-4 mb-6">
        <select value={selectedGrupo} onChange={e => setSelectedGrupo(e.target.value)} className="border p-2 rounded">
          <option value="">Seleccionar Grupo</option>
          {grupos.map((g: any) => <option key={g.id} value={g.id}>{g.nombre}</option>)}
        </select>
        <select value={selectedMateria} onChange={e => setSelectedMateria(e.target.value)} className="border p-2 rounded">
          <option value="">Seleccionar Materia</option>
          {materias.map((m: any) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
        </select>
        <select value={parcial} onChange={e => setParcial(e.target.value)} className="border p-2 rounded">
          <option value="1">Parcial 1</option><option value="2">Parcial 2</option><option value="3">Parcial 3</option>
        </select>
      </div>

      {alumnos.length > 0 && (
        <div className="bg-white rounded shadow p-4">
          <table className="w-full">
            <thead><tr><th className="text-left">Alumno</th><th className="text-left">Calificación (0-10)</th><th className="text-left">Observaciones</th></tr></thead>
            <tbody>
              {alumnos.map((a: any) => (
                <tr key={a.id} className="border-t">
                  <td className="py-2">{a.nombre} {a.apellido}</td>
                  <td>
                    <input type="number" min="0" max="10" value={calificaciones[a.id]?.valor} onChange={e => setCalificaciones({...calificaciones, [a.id]: {...calificaciones[a.id], valor: Number(e.target.value)}})} className="border p-1 w-20 rounded" />
                  </td>
                  <td>
                    <input type="text" value={calificaciones[a.id]?.obs} onChange={e => setCalificaciones({...calificaciones, [a.id]: {...calificaciones[a.id], obs: e.target.value}})} className="border p-1 w-full rounded" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleGuardar} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Guardar Calificaciones</button>
        </div>
      )}
    </div>
  );
}

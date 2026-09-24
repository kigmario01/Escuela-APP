"use client";
import React, { useState, useEffect } from 'react';

export default function AsistenciaMaestro() {
  const [grupos, setGrupos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [selectedGrupo, setSelectedGrupo] = useState("");
  const [selectedMateria, setSelectedMateria] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [asistencia, setAsistencia] = useState<any>({});

  useEffect(() => {
    fetch('/api/grupos').then(r => r.json()).then(d => setGrupos(d.data || d || []));
    fetch('/api/materias').then(r => r.json()).then(d => setMaterias(d.data || d || []));
  }, []);

  useEffect(() => {
    if (selectedGrupo) {
      fetch(`/api/alumnos?grupoId=${selectedGrupo}`).then(r => r.json()).then(d => {
        setAlumnos(d.data || d || []);
        const initial: any = {};
        (d.data || d || []).forEach((a: any) => initial[a.id] = 'Presente');
        setAsistencia(initial);
      });
    }
  }, [selectedGrupo]);

  const handleGuardar = async () => {
    await fetch('/api/asistencia', {
      method: 'POST',
      body: JSON.stringify({ grupoId: selectedGrupo, materiaId: selectedMateria, fecha, registros: asistencia }),
      headers: { 'Content-Type': 'application/json' }
    });
    alert('Asistencia guardada');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tomar Asistencia</h1>
      <div className="flex space-x-4 mb-6">
        <select value={selectedGrupo} onChange={e => setSelectedGrupo(e.target.value)} className="border p-2 rounded">
          <option value="">Seleccionar Grupo</option>
          {grupos.map((g: any) => <option key={g.id} value={g.id}>{g.nombre}</option>)}
        </select>
        <select value={selectedMateria} onChange={e => setSelectedMateria(e.target.value)} className="border p-2 rounded">
          <option value="">Seleccionar Materia</option>
          {materias.map((m: any) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
        </select>
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="border p-2 rounded" />
      </div>

      {alumnos.length > 0 && (
        <div className="bg-white rounded shadow p-4">
          <table className="w-full">
            <thead><tr><th className="text-left">Alumno</th><th className="text-left">Estado</th></tr></thead>
            <tbody>
              {alumnos.map((a: any) => (
                <tr key={a.id} className="border-t">
                  <td className="py-2">{a.nombre} {a.apellido}</td>
                  <td>
                    {['Presente', 'Ausente', 'Retardo', 'Justificado'].map(est => (
                      <label key={est} className="mr-4">
                        <input type="radio" name={`estado-${a.id}`} value={est} checked={asistencia[a.id] === est} onChange={() => setAsistencia({...asistencia, [a.id]: est})} className="mr-1" />
                        {est}
                      </label>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleGuardar} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Guardar Asistencia</button>
        </div>
      )}
    </div>
  );
}

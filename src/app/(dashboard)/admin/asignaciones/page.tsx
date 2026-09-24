"use client";
import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/tables/DataTable";
import { Trash2 } from "lucide-react";

export default function AsignacionesPage() {
  const [materias, setMaterias] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [maestros, setMaestros] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    materiaId: "",
    grupoId: "",
    maestroId: ""
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [matRes, gruRes, maeRes, asigRes] = await Promise.all([
        fetch("/api/materias").then(r => r.json()),
        fetch("/api/grupos").then(r => r.json()),
        fetch("/api/maestros").then(r => r.json()),
        fetch("/api/asignaciones").then(r => r.json())
      ]);
      setMaterias(matRes.data || matRes || []);
      setGrupos(gruRes.data || gruRes || []);
      setMaestros(maeRes.data || maeRes || []);
      setAsignaciones(asigRes.data || asigRes || []);
    } catch (e) {
      console.error(e);
      setMessage({ type: "error", text: "Error al cargar datos" });
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.materiaId || !formData.grupoId || !formData.maestroId) {
      setMessage({ type: "error", text: "Por favor selecciona todos los campos" });
      return;
    }
    setFormLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await fetch("/api/asignaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error("Error al guardar");
      setMessage({ type: "success", text: "Asignación creada correctamente" });
      setFormData({ materiaId: "", grupoId: "", maestroId: "" });
      fetchData();
    } catch (e) {
      setMessage({ type: "error", text: "Error al crear asignación" });
    }
    setFormLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Seguro que deseas eliminar esta asignación?")) {
      try {
        await fetch(`/api/asignaciones/${id}`, { method: "DELETE" });
        setMessage({ type: "success", text: "Asignación eliminada" });
        fetchData();
      } catch (e) {
        setMessage({ type: "error", text: "Error al eliminar" });
      }
    }
  };

  const columns = [
    { header: "Materia", accessorKey: "materia.nombre" },
    { header: "Grupo", accessorKey: "grupo.nombre" },
    { 
      header: "Maestro", 
      accessorKey: "maestro.usuario.nombre",
      cell: (row: any) => `${row.maestro?.usuario?.nombre || row.maestro?.nombre || ""} ${row.maestro?.usuario?.apellido || row.maestro?.apellido || ""}`.trim() 
    },
    {
      header: "Acciones",
      accessorKey: "id",
      cell: (row: any) => (
        <button onClick={() => handleDelete(row.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
          <Trash2 size={18} />
        </button>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Asignaciones de Materias</h1>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Nueva Asignación</h2>
        {message.text && (
          <div className={`p-3 rounded mb-4 text-sm ${message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Materia</label>
            <select 
              value={formData.materiaId} 
              onChange={e => setFormData({ ...formData, materiaId: e.target.value })}
              className="w-full border p-2 rounded"
            >
              <option value="">Selecciona Materia</option>
              {materias.map((m: any) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Grupo</label>
            <select 
              value={formData.grupoId} 
              onChange={e => setFormData({ ...formData, grupoId: e.target.value })}
              className="w-full border p-2 rounded"
            >
              <option value="">Selecciona Grupo</option>
              {grupos.map((g: any) => <option key={g.id} value={g.id}>{g.nombre}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Maestro</label>
            <select 
              value={formData.maestroId} 
              onChange={e => setFormData({ ...formData, maestroId: e.target.value })}
              className="w-full border p-2 rounded"
            >
              <option value="">Selecciona Maestro</option>
              {maestros.map((m: any) => <option key={m.id} value={m.id}>{m.nombre} {m.apellido}</option>)}
            </select>
          </div>
          <button 
            type="submit" 
            disabled={formLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {formLoading ? "Guardando..." : "Asignar"}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Asignaciones Actuales</h2>
        <DataTable data={asignaciones} columns={columns} loading={loading} />
      </div>
    </div>
  );
}

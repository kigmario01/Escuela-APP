"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { useHorarios } from "@/hooks";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

export default function HorariosPage() {
  const { data, loading, refetch } = useHorarios();
  const [open, setOpen] = useState(false);
  const [asignaciones, setAsignaciones] = useState([]);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    materiaGrupoId: "",
    diaSemana: "LUNES",
    horaInicio: "",
    horaFin: "",
    salon: ""
  });

  useEffect(() => {
    if (open) {
      fetch("/api/asignaciones")
        .then(res => res.json())
        .then(d => setAsignaciones(d.data || d || []))
        .catch(e => console.error(e));
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.materiaGrupoId || !formData.diaSemana || !formData.horaInicio || !formData.horaFin || !formData.salon) {
      setError("Todos los campos son obligatorios");
      return;
    }
    setError("");
    setFormLoading(true);
    try {
      const res = await fetch("/api/horarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error("Error al guardar");
      setOpen(false);
      setFormData({
        materiaGrupoId: "",
        diaSemana: "LUNES",
        horaInicio: "",
        horaFin: "",
        salon: ""
      });
      refetch();
    } catch (e: any) {
      setError(e.message || "Error al crear horario");
    }
    setFormLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Seguro que deseas eliminar este horario?")) {
      await fetch(`/api/horarios/${id}`, { method: "DELETE" });
      refetch();
    }
  };

  const columns = [
    { header: "Día", accessorKey: "diaSemana" },
    { header: "Materia", accessorKey: "materiaGrupo.materia.nombre" },
    { header: "Grupo", accessorKey: "materiaGrupo.grupo.nombre" },
    { header: "Hora Inicio", accessorKey: "horaInicio" },
    { header: "Hora Fin", accessorKey: "horaFin" },
    { header: "Salón", accessorKey: "salon" },
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader title="Horarios" description="Horarios de clases asignados" />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            Nuevo Horario
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Horario</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <div>
                <label className="block text-sm font-medium mb-1">Asignación</label>
                <select
                  value={formData.materiaGrupoId}
                  onChange={e => setFormData({ ...formData, materiaGrupoId: e.target.value })}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Selecciona asignación</option>
                  {asignaciones.map((a: any) => (
                    <option key={a.id} value={a.id}>
                      {a.materia?.nombre} - {a.grupo?.nombre} ({a.maestro?.nombre} {a.maestro?.apellido})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Día</label>
                <select
                  value={formData.diaSemana}
                  onChange={e => setFormData({ ...formData, diaSemana: e.target.value })}
                  className="w-full border p-2 rounded"
                >
                  <option value="LUNES">Lunes</option>
                  <option value="MARTES">Martes</option>
                  <option value="MIERCOLES">Miércoles</option>
                  <option value="JUEVES">Jueves</option>
                  <option value="VIERNES">Viernes</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Hora Inicio</label>
                  <input
                    type="time"
                    value={formData.horaInicio}
                    onChange={e => setFormData({ ...formData, horaInicio: e.target.value })}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hora Fin</label>
                  <input
                    type="time"
                    value={formData.horaFin}
                    onChange={e => setFormData({ ...formData, horaFin: e.target.value })}
                    className="w-full border p-2 rounded"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Salón</label>
                <input
                  type="text"
                  value={formData.salon}
                  onChange={e => setFormData({ ...formData, salon: e.target.value })}
                  className="w-full border p-2 rounded"
                  placeholder="Ej. A-101"
                />
              </div>
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {formLoading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable data={data} columns={columns} loading={loading} />
    </div>
  );
}

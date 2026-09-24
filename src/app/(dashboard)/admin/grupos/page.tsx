"use client";
import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/tables/DataTable";
import { GrupoForm } from "@/components/forms";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";

export default function GruposPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/grupos");
      const d = await res.json();
      setData(d.data || d || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (confirm("¿Seguro que deseas eliminar este registro?")) {
      await fetch(`/api/grupos/${id}`, { method: "DELETE" });
      fetchData();
    }
  };

  const columns = [
    { header: "Nombre", accessorKey: "nombre" },
    { header: "Grado", accessorKey: "grado" },
    { header: "Turno", accessorKey: "turno" },
    {
      header: "Acciones",
      accessorKey: "id",
      cell: (row: any) => (
        <div className="flex space-x-2">
          <button onClick={() => { setEditData(row); setEditOpen(true); }} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
            <Pencil size={18} />
          </button>
          <button onClick={() => handleDelete(row.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Grupos</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            Nuevo Grupo
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nuevo Grupo</DialogTitle></DialogHeader>
            <GrupoForm onSuccess={() => { setOpen(false); fetchData(); }} />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable data={data} columns={columns} loading={loading} />

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Editar Grupo</DialogTitle></DialogHeader>
          {editData && <GrupoForm initialData={editData} onSuccess={() => { setEditOpen(false); fetchData(); }} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

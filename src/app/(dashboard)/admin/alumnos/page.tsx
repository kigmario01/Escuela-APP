"use client";
import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/tables/DataTable";
import { AlumnoForm } from "@/components/forms";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChangeUserPhotoModal } from "@/components/modals/ChangeUserPhotoModal";
import { Pencil, Trash2, Camera, User } from "lucide-react";

export default function AlumnosPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [photoUser, setPhotoUser] = useState<any>(null);
  const [photoOpen, setPhotoOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/alumnos");
      const d = await res.json();
      setData(d.data || d || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (confirm("¿Seguro que deseas eliminar este alumno?")) {
      await fetch(`/api/alumnos/${id}`, { method: "DELETE" });
      fetchData();
    }
  };

  const columns = [
    {
      header: "Foto",
      accessorKey: "foto",
      cell: (row: any) => (
        <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
          {row.foto ? (
            <img src={row.foto} alt={row.nombre} className="w-full h-full object-cover" />
          ) : (
            <User className="w-5 h-5 text-slate-400" />
          )}
        </div>
      )
    },
    { header: "Nombre", accessorKey: "nombre" },
    { header: "Apellido", accessorKey: "apellido" },
    { header: "Matrícula", accessorKey: "matricula" },
    { header: "Email", accessorKey: "email" },
    {
      header: "Acciones",
      accessorKey: "id",
      cell: (row: any) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => { setPhotoUser(row); setPhotoOpen(true); }} 
            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded" 
            title="Cambiar Foto de Perfil"
          >
            <Camera size={18} />
          </button>
          <button 
            onClick={() => { setEditData(row); setEditOpen(true); }} 
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" 
            title="Editar Alumno"
          >
            <Pencil size={18} />
          </button>
          <button 
            onClick={() => handleDelete(row.id)} 
            className="p-1.5 text-red-600 hover:bg-red-50 rounded" 
            title="Eliminar Alumno"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Alumnos</h1>
          <p className="text-sm text-slate-500">Gestión de estudiantes y fotografías de perfil</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            Nuevo Alumno
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nuevo Alumno</DialogTitle></DialogHeader>
            <AlumnoForm onSuccess={() => { setOpen(false); fetchData(); }} />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable data={data} columns={columns} loading={loading} />

      {/* Modal para Editar Alumno */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Editar Alumno</DialogTitle></DialogHeader>
          {editData && <AlumnoForm initialData={editData} onSuccess={() => { setEditOpen(false); fetchData(); }} />}
        </DialogContent>
      </Dialog>

      {/* Modal para que el Administrador cambie la foto del Alumno */}
      <ChangeUserPhotoModal
        isOpen={photoOpen}
        onClose={() => setPhotoOpen(false)}
        user={photoUser}
        onSuccess={fetchData}
      />
    </div>
  );
}

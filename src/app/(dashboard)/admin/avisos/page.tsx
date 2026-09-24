"use client";
import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/tables/DataTable";
import { AvisoForm } from "@/components/forms";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AvisosPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/avisos");
      const d = await res.json();
      setData(d.data || d || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const columns = [
    { header: "Título", accessorKey: "titulo" },
    { header: "Tipo", accessorKey: "tipo" },
    { header: "Contenido", accessorKey: "contenido" },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Avisos</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            Nuevo Aviso
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nuevo Aviso</DialogTitle></DialogHeader>
            <AvisoForm onSuccess={() => { setOpen(false); fetchData(); }} />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable data={data} columns={columns} loading={loading} />
    </div>
  );
}

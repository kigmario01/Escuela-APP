"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { useCalificaciones } from "@/hooks";

export default function AlumnoCalificaciones() {
  const { data, loading } = useCalificaciones();
  const columns = [
    { header: "Materia", accessorKey: "materiaGrupo.materia.nombre" },
    { header: "Parcial", accessorKey: "parcial" },
    { header: "Calificación", accessorKey: "calificacion" },
    { header: "Observaciones", accessorKey: "observaciones" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Mis Calificaciones" description="Historial de evaluaciones" />
      <DataTable data={data} columns={columns} loading={loading} />
    </div>
  );
}

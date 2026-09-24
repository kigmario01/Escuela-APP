"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { useAsistencia } from "@/hooks";

export default function AlumnoAsistencia() {
  const { data, loading } = useAsistencia();
  const columns = [
    { header: "Materia", accessorKey: "materiaGrupo.materia.nombre" },
    { header: "Fecha", accessorKey: "fecha" },
    { header: "Estado", accessorKey: "estado" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Mi Asistencia" description="Registro de asistencias y faltas" />
      <DataTable data={data} columns={columns} loading={loading} />
    </div>
  );
}

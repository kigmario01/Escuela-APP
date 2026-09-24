"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { useHorarios } from "@/hooks";

export default function AlumnoHorario() {
  const { data, loading } = useHorarios();
  const columns = [
    { header: "Día", accessorKey: "diaSemana" },
    { header: "Materia", accessorKey: "materiaGrupo.materia.nombre" },
    { header: "Hora Inicio", accessorKey: "horaInicio" },
    { header: "Hora Fin", accessorKey: "horaFin" },
    { header: "Salón", accessorKey: "salon" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Mi Horario" description="Horario semanal de clases" />
      <DataTable data={data} columns={columns} loading={loading} />
    </div>
  );
}

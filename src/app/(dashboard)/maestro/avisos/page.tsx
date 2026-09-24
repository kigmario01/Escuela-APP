"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { useAvisos } from "@/hooks";

export default function MaestroAvisos() {
  const { data, loading } = useAvisos();
  const columns = [
    { header: "Título", accessorKey: "titulo" },
    { header: "Contenido", accessorKey: "contenido" },
    { header: "Tipo", accessorKey: "tipo" },
    { header: "Publicado por", accessorKey: "autor.nombre" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Avisos a mis grupos" description="Avisos y comunicados generales o por grupo" />
      <DataTable data={data} columns={columns} loading={loading} />
    </div>
  );
}

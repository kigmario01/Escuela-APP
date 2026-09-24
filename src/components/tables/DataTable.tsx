"use client";

import React, { useState, useMemo } from "react";

interface Column {
  header: string;
  accessorKey?: string;
  cell?: (row: any) => React.ReactNode;
}

interface DataTableProps {
  data: any;
  columns: Column[];
  loading?: boolean;
}

function getNestedValue(obj: any, path?: string): string {
  if (!obj || !path) return "-";
  const val = path.split(".").reduce((acc, part) => acc && acc[part], obj);
  if (val === null || val === undefined) return "-";
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
}

export function DataTable({ data, columns, loading }: DataTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const rawRows: any[] = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];

  const filteredRows = useMemo(() => {
    return rawRows.filter(row => {
      if (!search) return true;
      return columns.some(col => {
        if (!col.accessorKey) return false;
        const val = getNestedValue(row, col.accessorKey);
        return val.toLowerCase().includes(search.toLowerCase());
      });
    });
  }, [rawRows, search, columns]);

  const sortedRows = useMemo(() => {
    let sortable = [...filteredRows];
    if (sortConfig !== null) {
      sortable.sort((a, b) => {
        const aVal = getNestedValue(a, sortConfig.key);
        const bVal = getNestedValue(b, sortConfig.key);
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [filteredRows, sortConfig]);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return sortedRows.slice(start, start + itemsPerPage);
  }, [sortedRows, page, itemsPerPage]);

  const handleSort = (key?: string) => {
    if (!key) return;
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const totalPages = Math.ceil(sortedRows.length / itemsPerPage);

  if (loading) {
    return (
      <div className="border rounded-md p-8 text-center text-slate-500 bg-white">
        Cargando datos...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Buscar..."
          className="px-3 py-2 border rounded-md text-sm w-64"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <div className="text-sm text-slate-500">
          Mostrando {paginatedRows.length} de {sortedRows.length} registros
        </div>
      </div>
      <div className="border rounded-md overflow-hidden bg-white shadow-sm">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-slate-100 text-slate-700 border-b font-semibold">
            <tr>
              {columns.map((col, i) => (
                <th 
                  key={i} 
                  className={`px-4 py-3 border-r last:border-r-0 ${col.accessorKey ? "cursor-pointer hover:bg-slate-200 transition-colors" : ""}`} 
                  onClick={() => col.accessorKey && handleSort(col.accessorKey)}
                >
                  {col.header} {col.accessorKey && sortConfig?.key === col.accessorKey ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500">
                  Sin datos registrados.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, rowIndex) => (
                <tr key={row.id || rowIndex} className="hover:bg-slate-50 transition-colors">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-4 py-3 text-slate-700">
                      {col.cell ? col.cell(row) : getNestedValue(row, col.accessorKey)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center">
        <select
          className="px-3 py-2 border rounded-md text-sm"
          value={itemsPerPage}
          onChange={(e) => { setItemsPerPage(Number(e.target.value)); setPage(1); }}
        >
          <option value={5}>5 por página</option>
          <option value={10}>10 por página</option>
          <option value={20}>20 por página</option>
          <option value={50}>50 por página</option>
        </select>
        <div className="flex space-x-2">
          <button
            className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Anterior
          </button>
          <span className="px-3 py-1 text-sm">Página {page} de {totalPages || 1}</span>
          <button
            className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}

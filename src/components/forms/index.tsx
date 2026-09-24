"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const alumnoSchema = z.object({
  nombre: z.string().min(1, "Obligatorio"),
  apellido: z.string().min(1, "Obligatorio"),
  email: z.string().email("Email inválido"),
  matricula: z.string().min(1, "Obligatorio"),
  grupoId: z.string().optional()
});

const maestroSchema = z.object({
  nombre: z.string().min(1, "Obligatorio"),
  apellido: z.string().min(1, "Obligatorio"),
  email: z.string().email("Email inválido"),
  especialidad: z.string().min(1, "Obligatorio")
});

const materiaSchema = z.object({
  nombre: z.string().min(1, "Obligatorio"),
  clave: z.string().min(1, "Obligatorio"),
  descripcion: z.string().optional()
});

const grupoSchema = z.object({
  nombre: z.string().min(1, "Obligatorio"),
  grado: z.number().min(1, "Debe ser mayor a 0"),
  turno: z.enum(["MATUTINO", "VESPERTINO"])
});

const avisoSchema = z.object({
  titulo: z.string().min(1, "Obligatorio"),
  contenido: z.string().min(1, "Obligatorio"),
  tipo: z.enum(["GENERAL", "GRUPO"]),
  grupoId: z.string().optional()
});

export function AlumnoForm({ onSuccess, initialData }: { onSuccess?: () => void, initialData?: any }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ 
    resolver: zodResolver(alumnoSchema),
    defaultValues: initialData || {}
  });
  const [loading, setLoading] = useState(false);
  const [grupos, setGrupos] = useState([]);

  useEffect(() => { fetch("/api/grupos").then(r => r.json()).then(d => setGrupos(d.data || d || [])); }, []);

  const onSubmit = async (data: any) => {
    setLoading(true);
    const method = initialData ? "PUT" : "POST";
    const url = initialData ? `/api/alumnos/${initialData.id}` : "/api/alumnos";
    await fetch(url, { method, body: JSON.stringify(data), headers: { "Content-Type": "application/json" }});
    setLoading(false);
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div><label>Nombre</label><input {...register("nombre")} className="w-full border p-2 rounded" />{errors.nombre && <p className="text-red-500 text-xs">{errors.nombre.message as string}</p>}</div>
      <div><label>Apellido</label><input {...register("apellido")} className="w-full border p-2 rounded" /></div>
      <div><label>Email</label><input {...register("email")} className="w-full border p-2 rounded" /></div>
      <div><label>Matrícula</label><input {...register("matricula")} className="w-full border p-2 rounded" /></div>
      <div><label>Grupo</label><select {...register("grupoId")} className="w-full border p-2 rounded"><option value="">Selecciona un grupo</option>{grupos.map((g: any) => <option key={g.id} value={g.id}>{g.nombre}</option>)}</select></div>
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">{loading ? "Guardando..." : "Guardar"}</button>
    </form>
  );
}

export function MaestroForm({ onSuccess, initialData }: { onSuccess?: () => void, initialData?: any }) {
  const { register, handleSubmit } = useForm({ 
    resolver: zodResolver(maestroSchema),
    defaultValues: initialData || {}
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    const method = initialData ? "PUT" : "POST";
    const url = initialData ? `/api/maestros/${initialData.id}` : "/api/maestros";
    await fetch(url, { method, body: JSON.stringify(data), headers: { "Content-Type": "application/json" }});
    setLoading(false);
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div><label>Nombre</label><input {...register("nombre")} className="w-full border p-2 rounded" /></div>
      <div><label>Apellido</label><input {...register("apellido")} className="w-full border p-2 rounded" /></div>
      <div><label>Email</label><input {...register("email")} className="w-full border p-2 rounded" /></div>
      <div><label>Especialidad</label><input {...register("especialidad")} className="w-full border p-2 rounded" /></div>
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">{loading ? "Guardando..." : "Guardar"}</button>
    </form>
  );
}

export function MateriaForm({ onSuccess, initialData }: { onSuccess?: () => void, initialData?: any }) {
  const { register, handleSubmit } = useForm({ 
    resolver: zodResolver(materiaSchema),
    defaultValues: initialData || {}
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    const method = initialData ? "PUT" : "POST";
    const url = initialData ? `/api/materias/${initialData.id}` : "/api/materias";
    await fetch(url, { method, body: JSON.stringify(data), headers: { "Content-Type": "application/json" }});
    setLoading(false);
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div><label>Nombre</label><input {...register("nombre")} className="w-full border p-2 rounded" /></div>
      <div><label>Clave</label><input {...register("clave")} className="w-full border p-2 rounded" /></div>
      <div><label>Descripción</label><input {...register("descripcion")} className="w-full border p-2 rounded" /></div>
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">{loading ? "Guardando..." : "Guardar"}</button>
    </form>
  );
}

export function GrupoForm({ onSuccess, initialData }: { onSuccess?: () => void, initialData?: any }) {
  const { register, handleSubmit } = useForm({ 
    resolver: zodResolver(grupoSchema),
    defaultValues: initialData || {}
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    const method = initialData ? "PUT" : "POST";
    const url = initialData ? `/api/grupos/${initialData.id}` : "/api/grupos";
    await fetch(url, { method, body: JSON.stringify(data), headers: { "Content-Type": "application/json" }});
    setLoading(false);
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div><label>Nombre</label><input {...register("nombre")} className="w-full border p-2 rounded" /></div>
      <div><label>Grado</label><input type="number" {...register("grado", { valueAsNumber: true })} className="w-full border p-2 rounded" /></div>
      <div><label>Turno</label><select {...register("turno")} className="w-full border p-2 rounded"><option value="MATUTINO">Matutino</option><option value="VESPERTINO">Vespertino</option></select></div>
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">{loading ? "Guardando..." : "Guardar"}</button>
    </form>
  );
}

export function AvisoForm({ onSuccess, initialData }: { onSuccess?: () => void, initialData?: any }) {
  const { register, handleSubmit, watch } = useForm({ 
    resolver: zodResolver(avisoSchema),
    defaultValues: initialData || {}
  });
  const [loading, setLoading] = useState(false);
  const [grupos, setGrupos] = useState([]);
  const tipo = watch("tipo");

  useEffect(() => { fetch("/api/grupos").then(r => r.json()).then(d => setGrupos(d.data || d || [])); }, []);

  const onSubmit = async (data: any) => {
    setLoading(true);
    const method = initialData ? "PUT" : "POST";
    const url = initialData ? `/api/avisos/${initialData.id}` : "/api/avisos";
    await fetch(url, { method, body: JSON.stringify(data), headers: { "Content-Type": "application/json" }});
    setLoading(false);
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div><label>Título</label><input {...register("titulo")} className="w-full border p-2 rounded" /></div>
      <div><label>Contenido</label><textarea {...register("contenido")} className="w-full border p-2 rounded" /></div>
      <div><label>Tipo</label><select {...register("tipo")} className="w-full border p-2 rounded"><option value="GENERAL">General</option><option value="GRUPO">Grupo</option></select></div>
      {tipo === "GRUPO" && (
        <div><label>Grupo</label><select {...register("grupoId")} className="w-full border p-2 rounded"><option value="">Selecciona un grupo</option>{grupos.map((g: any) => <option key={g.id} value={g.id}>{g.nombre}</option>)}</select></div>
      )}
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">{loading ? "Guardando..." : "Guardar"}</button>
    </form>
  );
}

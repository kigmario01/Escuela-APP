import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function jsonToCsv(items: any[]): string {
  if (items.length === 0) return '';
  const replacer = (key: string, value: any) => value === null ? '' : value;
  const header = Object.keys(items[0]);
  const csv = [
    header.join(','), // header row first
    ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
  ].join('\r\n');
  return csv;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    
    if (!type || !['alumnos', 'maestros', 'materias', 'grupos', 'asistencia', 'calificaciones'].includes(type)) {
      return NextResponse.json({ error: 'Tipo inválido o no proporcionado' }, { status: 400 });
    }

    let data: any[] = [];

    if (type === 'alumnos') {
      const alumnos = await prisma.alumno.findMany({
        include: { usuario: true, grupo: true }
      });
      data = alumnos.map(a => ({
        id: a.id,
        nombre: a.usuario.nombre,
        apellido: a.usuario.apellido,
        email: a.usuario.email,
        matricula: a.matricula,
        grupo: a.grupo?.nombre || ''
      }));
    } else if (type === 'maestros') {
      const maestros = await prisma.maestro.findMany({
        include: { usuario: true }
      });
      data = maestros.map(m => ({
        id: m.id,
        nombre: m.usuario.nombre,
        apellido: m.usuario.apellido,
        email: m.usuario.email,
        especialidad: m.especialidad || ''
      }));
    } else if (type === 'materias') {
      data = await prisma.materia.findMany();
    } else if (type === 'grupos') {
      data = await prisma.grupo.findMany();
    } else if (type === 'asistencia') {
      const asistencias = await prisma.asistencia.findMany({
        include: { alumno: { include: { usuario: true } }, materiaGrupo: { include: { materia: true } } }
      });
      data = asistencias.map(a => ({
        alumno: `${a.alumno.usuario.nombre} ${a.alumno.usuario.apellido}`,
        matricula: a.alumno.matricula,
        materia: a.materiaGrupo.materia.nombre,
        fecha: a.fecha.toISOString().split('T')[0],
        estado: a.estado
      }));
    } else if (type === 'calificaciones') {
      const calificaciones = await prisma.calificacion.findMany({
        include: { alumno: { include: { usuario: true } }, materiaGrupo: { include: { materia: true } } }
      });
      data = calificaciones.map(c => ({
        alumno: `${c.alumno.usuario.nombre} ${c.alumno.usuario.apellido}`,
        matricula: c.alumno.matricula,
        materia: c.materiaGrupo.materia.nombre,
        parcial: c.parcial,
        calificacion: c.calificacion,
        observaciones: c.observaciones || ''
      }));
    }

    const csvData = jsonToCsv(data);
    
    return new NextResponse(csvData, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${type}.csv"`
      }
    });

  } catch (error) {
    console.error('Error in export:', error);
    return NextResponse.json({ error: 'Error procesando exportación' }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const alumnoId = searchParams.get("alumnoId");

    if (!alumnoId) {
      return NextResponse.json({ error: "Falta el ID del alumno" }, { status: 400 });
    }

    const alumno = await prisma.alumno.findUnique({
      where: { id: alumnoId },
      include: {
        usuario: true,
        grupo: true,
        calificaciones: {
          include: {
            materiaGrupo: {
              include: {
                materia: true
              }
            }
          },
          orderBy: { parcial: 'asc' }
        }
      }
    });

    if (!alumno) {
      return NextResponse.json({ error: "Alumno no encontrado" }, { status: 404 });
    }

    // Process calificaciones grouped by materia
    const materiasMap = new Map<string, any>();
    
    alumno.calificaciones.forEach(cal => {
      const materiaNombre = cal.materiaGrupo.materia.nombre;
      if (!materiasMap.has(materiaNombre)) {
        materiasMap.set(materiaNombre, {
          nombre: materiaNombre,
          calificaciones: [],
          suma: 0,
          count: 0
        });
      }
      
      const materiaData = materiasMap.get(materiaNombre);
      materiaData.calificaciones.push({
        parcial: cal.parcial,
        calificacion: cal.calificacion
      });
      materiaData.suma += cal.calificacion;
      materiaData.count += 1;
    });

    let totalSumaGeneral = 0;
    let totalMaterias = 0;
    const materias = Array.from(materiasMap.values()).map(m => {
      const promedio = m.count > 0 ? parseFloat((m.suma / m.count).toFixed(2)) : 0;
      totalSumaGeneral += promedio;
      if (m.count > 0) totalMaterias++;
      
      return {
        nombre: m.nombre,
        calificaciones: m.calificaciones,
        promedio
      };
    });

    const promedioGeneral = totalMaterias > 0 ? parseFloat((totalSumaGeneral / totalMaterias).toFixed(2)) : 0;

    return NextResponse.json({
      data: {
        alumno: {
          nombre: alumno.usuario.nombre,
          apellido: alumno.usuario.apellido,
          matricula: alumno.matricula
        },
        grupo: alumno.grupo ? { nombre: alumno.grupo.nombre } : null,
        materias,
        promedioGeneral
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Error al generar la boleta" }, { status: 500 });
  }
}

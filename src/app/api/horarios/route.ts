import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { HorarioSchema } from "@/lib/validations";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const grupoId = searchParams.get("grupoId");
    const maestroId = searchParams.get("maestroId");

    const horarios = await prisma.horario.findMany({
      where: {
        materiaGrupo: {
          ...(grupoId && { grupoId }),
          ...(maestroId && { maestroId }),
        }
      },
      include: {
        materiaGrupo: {
          include: { materia: true, maestro: { include: { usuario: true } }, grupo: true }
        }
      }
    });
    return NextResponse.json({ data: horarios });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener horarios" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const body = await req.json();
    const { materiaGrupoId, diaSemana, horaInicio, horaFin, salon } = body;
    
    if (!materiaGrupoId || !diaSemana || !horaInicio || !horaFin) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const horario = await prisma.horario.create({
      data: { materiaGrupoId, diaSemana, horaInicio, horaFin, salon }
    });
    return NextResponse.json({ data: horario }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

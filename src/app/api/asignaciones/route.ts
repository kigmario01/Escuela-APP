import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Rol } from "@/types";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const asignaciones = await prisma.materiaGrupo.findMany({
      include: {
        materia: true,
        grupo: true,
        maestro: { include: { usuario: true } }
      }
    });
    return NextResponse.json({ data: asignaciones });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener asignaciones" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.rol !== Rol.ADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { materiaId, grupoId, maestroId } = body;
    
    if (!materiaId || !grupoId || !maestroId) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    const asignacion = await prisma.materiaGrupo.create({
      data: { materiaId, grupoId, maestroId },
      include: {
        materia: true,
        grupo: true,
        maestro: { include: { usuario: true } }
      }
    });
    
    return NextResponse.json({ data: asignacion }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Error al crear asignación" }, { status: 400 });
  }
}

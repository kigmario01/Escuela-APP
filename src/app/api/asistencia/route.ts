import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { AsistenciaSchema } from "@/lib/validations";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const materiaGrupoId = searchParams.get("materiaGrupoId");
    const fecha = searchParams.get("fecha"); // ISO String

    if (!materiaGrupoId || !fecha) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    const startOfDay = new Date(fecha);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(fecha);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const asistencias = await prisma.asistencia.findMany({
      where: {
        materiaGrupoId,
        fecha: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
    return NextResponse.json({ data: asistencias });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.rol !== 'MAESTRO' && session.user.rol !== 'ADMIN')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const asistencias = z.array(AsistenciaSchema).parse(body);

    const results = await prisma.$transaction(
      asistencias.map((a) =>
        prisma.asistencia.upsert({
          where: {
            alumnoId_materiaGrupoId_fecha: {
              alumnoId: a.alumnoId,
              materiaGrupoId: a.materiaGrupoId,
              fecha: new Date(a.fecha),
            },
          },
          update: { estado: a.estado },
          create: {
            alumnoId: a.alumnoId,
            materiaGrupoId: a.materiaGrupoId,
            fecha: new Date(a.fecha),
            estado: a.estado,
          },
        })
      )
    );

    return NextResponse.json({ data: results }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

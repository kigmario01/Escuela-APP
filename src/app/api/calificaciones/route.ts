import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { CalificacionSchema } from "@/lib/validations";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const alumnoId = searchParams.get("alumnoId");
    const materiaGrupoId = searchParams.get("materiaGrupoId");

    const calificaciones = await prisma.calificacion.findMany({
      where: {
        ...(alumnoId && { alumnoId }),
        ...(materiaGrupoId && { materiaGrupoId }),
      },
    });
    return NextResponse.json({ data: calificaciones });
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
    const calificaciones = z.array(CalificacionSchema).parse(body);

    const results = await prisma.$transaction(
      calificaciones.map((c) =>
        prisma.calificacion.upsert({
          where: {
            alumnoId_materiaGrupoId_parcial: {
              alumnoId: c.alumnoId,
              materiaGrupoId: c.materiaGrupoId,
              parcial: c.parcial,
            },
          },
          update: { calificacion: c.calificacion, observaciones: c.observaciones },
          create: {
            alumnoId: c.alumnoId,
            materiaGrupoId: c.materiaGrupoId,
            parcial: c.parcial,
            calificacion: c.calificacion,
            observaciones: c.observaciones,
          },
        })
      )
    );

    return NextResponse.json({ data: results }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

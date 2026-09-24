import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { AvisoSchema } from "@/lib/validations";
import { TipoAviso } from "@/types";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const grupoId = searchParams.get("grupoId"); // For student/teacher filtering

    const avisos = await prisma.aviso.findMany({
      where: {
        OR: [
          { tipo: TipoAviso.GENERAL },
          ...(grupoId ? [{ destinatarios: { some: { grupoId } } }] : [])
        ]
      },
      include: {
        autor: { select: { nombre: true, apellido: true } },
        destinatarios: { include: { grupo: true } },
        leidoPor: { where: { usuarioId: session.user.id } } // To check if current user read it
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ data: avisos });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const validatedData = AvisoSchema.parse(body);

    const result = await prisma.$transaction(async (tx) => {
      const aviso = await tx.aviso.create({
        data: {
          titulo: validatedData.titulo,
          contenido: validatedData.contenido,
          tipo: validatedData.tipo,
          usuarioId: session.user.id,
        }
      });

      if (validatedData.tipo === TipoAviso.GRUPO && validatedData.destinatarios) {
        await tx.avisoDestinatario.createMany({
          data: validatedData.destinatarios.map(grupoId => ({
            avisoId: aviso.id,
            grupoId
          }))
        });
      }

      return aviso;
    });

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

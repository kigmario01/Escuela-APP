import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Rol } from "@/types";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const alumno = await prisma.alumno.findUnique({
      where: { id: (await params).id },
      include: { usuario: true, grupo: true },
    });
    if (!alumno) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ data: alumno });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching alumno" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.rol !== Rol.ADMIN) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const body = await req.json();
    // Simplified update, in real app need validation
    const { matricula, grupoId, usuario: { nombre, apellido, activo } = {} as any } = body;

    const alumno = await prisma.alumno.update({
      where: { id: (await params).id },
      data: {
        matricula,
        grupoId,
        usuario: {
          update: { nombre, apellido, activo }
        }
      },
      include: { usuario: true }
    });
    return NextResponse.json({ data: alumno });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.rol !== Rol.ADMIN) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const alumno = await prisma.alumno.findUnique({ where: { id: (await params).id } });
    if (!alumno) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.usuario.delete({ where: { id: alumno.usuarioId } });
    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting" }, { status: 500 });
  }
}

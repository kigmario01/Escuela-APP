import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Rol } from "@/types";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const maestro = await prisma.maestro.findUnique({
      where: { id: (await params).id },
      include: { usuario: true },
    });
    if (!maestro) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ data: maestro });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.rol !== Rol.ADMIN) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const body = await req.json();
    const { especialidad, usuario: { nombre, apellido, activo } = {} as any } = body;

    const maestro = await prisma.maestro.update({
      where: { id: (await params).id },
      data: {
        especialidad,
        usuario: { update: { nombre, apellido, activo } }
      },
      include: { usuario: true }
    });
    return NextResponse.json({ data: maestro });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.rol !== Rol.ADMIN) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const maestro = await prisma.maestro.findUnique({ where: { id: (await params).id } });
    if (!maestro) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.usuario.delete({ where: { id: maestro.usuarioId } });
    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Rol } from "@/types";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const materia = await prisma.materia.findUnique({ where: { id: (await params).id } });
    if (!materia) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ data: materia });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.rol !== Rol.ADMIN) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const body = await req.json();
    const materia = await prisma.materia.update({
      where: { id: (await params).id },
      data: body,
    });
    return NextResponse.json({ data: materia });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.rol !== Rol.ADMIN) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await prisma.materia.delete({ where: { id: (await params).id } });
    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting" }, { status: 500 });
  }
}

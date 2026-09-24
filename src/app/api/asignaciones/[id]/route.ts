import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Rol } from "@/types";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.rol !== Rol.ADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.materiaGrupo.delete({
      where: { id }
    });

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar la asignación" }, { status: 500 });
  }
}

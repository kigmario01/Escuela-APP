import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const user = await prisma.usuario.findUnique({
      where: { id: session.user.id },
      include: {
        maestro: true,
        alumno: { include: { grupo: true } }
      }
    });

    if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

    const { password, ...userWithoutPassword } = user;
    return NextResponse.json({ data: userWithoutPassword });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener perfil" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const body = await req.json();
    const { nombre, apellido, email, newPassword, foto } = body;

    const dataToUpdate: any = {};
    if (nombre) dataToUpdate.nombre = nombre;
    if (apellido) dataToUpdate.apellido = apellido;
    if (email) dataToUpdate.email = email;
    if (foto !== undefined) dataToUpdate.foto = foto;
    if (newPassword) {
      dataToUpdate.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.usuario.update({
      where: { id: session.user.id },
      data: dataToUpdate,
      include: {
        maestro: true,
        alumno: { include: { grupo: true } }
      }
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return NextResponse.json({ data: userWithoutPassword });
  } catch (error: any) {
    return NextResponse.json({ error: "Error al actualizar perfil" }, { status: 400 });
  }
}

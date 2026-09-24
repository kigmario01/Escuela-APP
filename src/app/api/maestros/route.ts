import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { MaestroSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";
import { Rol } from "@/types";

export async function GET(req: Request) {
  try {
    const maestros = await prisma.maestro.findMany({
      include: {
        usuario: { select: { id: true, nombre: true, apellido: true, email: true, activo: true, foto: true } },
      },
    });
    const formatted = maestros.map(m => ({
      ...m,
      nombre: m.usuario?.nombre || "",
      apellido: m.usuario?.apellido || "",
      email: m.usuario?.email || "",
      foto: m.usuario?.foto || null,
      usuarioId: m.usuarioId,
    }));
    return NextResponse.json({ data: formatted });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.rol !== Rol.ADMIN) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const validatedData = MaestroSchema.parse(body);
    const hashedPassword = await bcrypt.hash(validatedData.usuario.password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.create({
        data: {
          ...validatedData.usuario,
          password: hashedPassword,
          rol: Rol.MAESTRO,
        },
      });

      const maestro = await tx.maestro.create({
        data: {
          usuarioId: usuario.id,
          especialidad: validatedData.especialidad,
        },
      });

      return maestro;
    });

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { AlumnoSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";
import { Rol } from "@/types";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const grupoId = searchParams.get("grupoId");

    const alumnos = await prisma.alumno.findMany({
      where: grupoId ? { grupoId } : undefined,
      include: {
        usuario: {
          select: { id: true, nombre: true, apellido: true, email: true, activo: true, foto: true },
        },
        grupo: true,
      },
    });
    const formatted = alumnos.map((a) => ({
      ...a,
      nombre: a.usuario?.nombre || "",
      apellido: a.usuario?.apellido || "",
      email: a.usuario?.email || "",
      foto: a.usuario?.foto || null,
      usuarioId: a.usuarioId,
    }));
    return NextResponse.json({ data: formatted });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching alumnos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.rol !== Rol.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const payload = body.usuario ? body : {
      usuario: {
        nombre: body.nombre,
        apellido: body.apellido,
        email: body.email,
        password: body.password || "password123",
      },
      matricula: body.matricula,
      grupoId: body.grupoId || undefined,
    };
    const validatedData = AlumnoSchema.parse(payload);

    const hashedPassword = await bcrypt.hash(validatedData.usuario.password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.create({
        data: {
          ...validatedData.usuario,
          password: hashedPassword,
          rol: Rol.ALUMNO,
        },
      });

      const alumno = await tx.alumno.create({
        data: {
          usuarioId: usuario.id,
          matricula: validatedData.matricula,
          grupoId: validatedData.grupoId,
        },
      });

      return alumno;
    });

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { GrupoSchema } from "@/lib/validations";
import { Rol } from "@/types";

export async function GET(req: Request) {
  try {
    const grupos = await prisma.grupo.findMany();
    return NextResponse.json({ data: grupos });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.rol !== Rol.ADMIN) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const validatedData = GrupoSchema.parse(body);

    const grupo = await prisma.grupo.create({ data: validatedData });
    return NextResponse.json({ data: grupo }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

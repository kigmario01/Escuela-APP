import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const avisoLeido = await prisma.avisoLeido.upsert({
      where: {
        avisoId_usuarioId: {
          avisoId: (await params).id,
          usuarioId: session.user.id,
        }
      },
      update: {},
      create: {
        avisoId: (await params).id,
        usuarioId: session.user.id,
      }
    });

    return NextResponse.json({ data: avisoLeido });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

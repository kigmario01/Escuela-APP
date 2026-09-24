import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const alumnoId = searchParams.get("alumnoId");
    
    // Simple stats: count of each state
    const stats = await prisma.asistencia.groupBy({
      by: ['estado'],
      where: alumnoId ? { alumnoId } : undefined,
      _count: true,
    });

    return NextResponse.json({ data: stats });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching" }, { status: 500 });
  }
}

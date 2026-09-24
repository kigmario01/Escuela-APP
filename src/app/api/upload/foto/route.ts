import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Rol } from "@/types";
import path from "path";
import fs from "fs/promises";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const requestedUsuarioId = formData.get("usuarioId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 });
    }

    // Determine target user id
    let targetUserId = session.user.id;
    if (requestedUsuarioId && requestedUsuarioId !== session.user.id) {
      if (session.user.rol !== Rol.ADMIN) {
        return NextResponse.json({ error: "Solo los administradores pueden cambiar fotos de otros usuarios" }, { status: 403 });
      }
      targetUserId = requestedUsuarioId;
    }

    // Validate mime type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Formato inválido. Solo se admiten imágenes JPG, PNG, WEBP o GIF" }, { status: 400 });
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "La imagen es demasiado pesada. El tamaño máximo es 5MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "avatars");
    await fs.mkdir(uploadsDir, { recursive: true });

    // Generate unique safe filename
    const ext = path.extname(file.name) || ".jpg";
    const filename = `avatar-${targetUserId}-${Date.now()}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    // Save file
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/avatars/${filename}`;

    // Update usuario in database
    const updatedUser = await prisma.usuario.update({
      where: { id: targetUserId },
      data: { foto: publicUrl },
      select: { id: true, nombre: true, apellido: true, foto: true, email: true }
    });

    return NextResponse.json({
      success: true,
      foto: publicUrl,
      usuario: updatedUser,
      message: "Foto de perfil actualizada exitosamente"
    });
  } catch (error: any) {
    console.error("Error al subir foto:", error);
    return NextResponse.json({ error: error?.message || "Error al procesar la foto" }, { status: 500 });
  }
}

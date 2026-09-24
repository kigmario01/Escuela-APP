import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as xlsx from 'xlsx';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    
    if (!type || !['alumnos', 'maestros', 'materias', 'grupos'].includes(type)) {
      return NextResponse.json({ error: 'Tipo inválido o no proporcionado' }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No se encontró archivo' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'El archivo está vacío o no tiene el formato correcto' }, { status: 400 });
    }

    let created = 0;
    let skipped = 0;
    let errors = 0;
    const defaultPassword = await bcrypt.hash('escuela2024', 10);

    for (const row of data as any[]) {
      try {
        if (type === 'alumnos') {
          if (!row.nombre || !row.apellido || !row.email || !row.matricula || !row.grupo) {
            skipped++;
            continue;
          }
          
          let grupo = await prisma.grupo.findFirst({ where: { nombre: String(row.grupo) } });
          
          await prisma.$transaction(async (tx) => {
            const user = await tx.usuario.create({
              data: {
                email: String(row.email),
                password: defaultPassword,
                nombre: String(row.nombre),
                apellido: String(row.apellido),
                rol: 'ALUMNO',
              }
            });
            await tx.alumno.create({
              data: {
                usuarioId: user.id,
                matricula: String(row.matricula),
                grupoId: grupo?.id || null,
              }
            });
          });
          created++;
        } else if (type === 'maestros') {
          if (!row.nombre || !row.apellido || !row.email || !row.especialidad) {
            skipped++;
            continue;
          }

          await prisma.$transaction(async (tx) => {
            const user = await tx.usuario.create({
              data: {
                email: String(row.email),
                password: defaultPassword,
                nombre: String(row.nombre),
                apellido: String(row.apellido),
                rol: 'MAESTRO',
              }
            });
            await tx.maestro.create({
              data: {
                usuarioId: user.id,
                especialidad: String(row.especialidad),
              }
            });
          });
          created++;
        } else if (type === 'materias') {
          if (!row.nombre || !row.clave) {
            skipped++;
            continue;
          }
          
          await prisma.materia.create({
            data: {
              nombre: String(row.nombre),
              clave: String(row.clave),
              descripcion: row.descripcion ? String(row.descripcion) : null,
            }
          });
          created++;
        } else if (type === 'grupos') {
          if (!row.nombre || !row.grado || !row.turno) {
            skipped++;
            continue;
          }
          
          await prisma.grupo.create({
            data: {
              nombre: String(row.nombre),
              grado: Number(row.grado),
              turno: String(row.turno),
            }
          });
          created++;
        }
      } catch (err) {
        console.error(err);
        errors++;
      }
    }

    return NextResponse.json({
      message: 'Importación finalizada',
      resumen: { created, skipped, errors }
    });
  } catch (error) {
    console.error('Error in import:', error);
    return NextResponse.json({ error: 'Error procesando archivo' }, { status: 500 });
  }
}

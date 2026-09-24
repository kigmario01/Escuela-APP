import { NextResponse } from 'next/server';
import * as xlsx from 'xlsx';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    
    if (!type || !['alumnos', 'maestros', 'materias', 'grupos'].includes(type)) {
      return NextResponse.json({ error: 'Tipo inválido o no proporcionado' }, { status: 400 });
    }

    let data: any[] = [];
    
    if (type === 'alumnos') {
      data = [
        { nombre: 'Juan', apellido: 'Pérez', email: 'juan@escuela.com', matricula: 'MAT001', grupo: '3°A' },
        { nombre: 'Ana', apellido: 'López', email: 'ana@escuela.com', matricula: 'MAT002', grupo: '1°B' },
      ];
    } else if (type === 'maestros') {
      data = [
        { nombre: 'María', apellido: 'García', email: 'maria@escuela.com', especialidad: 'Matemáticas' },
        { nombre: 'Carlos', apellido: 'Sánchez', email: 'carlos@escuela.com', especialidad: 'Historia' },
      ];
    } else if (type === 'materias') {
      data = [
        { nombre: 'Matemáticas I', clave: 'MAT01', descripcion: 'Álgebra y geometría' },
        { nombre: 'Historia de México', clave: 'HIS01', descripcion: 'Historia moderna' },
      ];
    } else if (type === 'grupos') {
      data = [
        { nombre: '3°A', grado: 3, turno: 'MATUTINO' },
        { nombre: '1°B', grado: 1, turno: 'VESPERTINO' },
      ];
    }

    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Plantilla');

    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="plantilla_${type}.xlsx"`
      }
    });
  } catch (error) {
    console.error('Error generating template:', error);
    return NextResponse.json({ error: 'Error generando plantilla' }, { status: 500 });
  }
}

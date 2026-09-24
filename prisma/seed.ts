import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Clean all data
  await prisma.avisoLeido.deleteMany()
  await prisma.avisoDestinatario.deleteMany()
  await prisma.aviso.deleteMany()
  await prisma.horario.deleteMany()
  await prisma.calificacion.deleteMany()
  await prisma.asistencia.deleteMany()
  await prisma.materiaGrupo.deleteMany()
  await prisma.materia.deleteMany()
  await prisma.alumno.deleteMany()
  await prisma.grupo.deleteMany()
  await prisma.maestro.deleteMany()
  await prisma.usuario.deleteMany()

  // Create only 1 admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  
  await prisma.usuario.create({
    data: {
      email: 'admin@escuela.com',
      password: adminPassword,
      nombre: 'Administrador',
      apellido: 'Sistema',
      rol: 'ADMIN'
    }
  })

  console.log('Seeding finished. Only Admin created.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

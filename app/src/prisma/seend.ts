import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'aldahir.ubilluz@unsch.edu.pe';
  const password = '12345678';

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log(`⚠️ El usuario con el correo ${email} ya existe.`);
    return;
  }

  const admin = await prisma.user.create({
    data: {
      name: 'Administrador',
      email,
      password: hashedPassword,
      rol: 'ADMIN',
      isActive: true,
    },
  });

  console.log('✅ Usuario administrador creado con éxito:');
  console.log(admin);
}

main()
  .catch((e) => {
    console.error('❌ Error al crear el admin:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

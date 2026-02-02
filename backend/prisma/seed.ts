import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando sembrado de catálogos...');

  // Catálogo Kind (Especie)
  const kinds = [
    { name: 'Perro' },
    { name: 'Gato' },
    { name: 'Otro' },
  ];

  console.log('Sembrando Kinds...');
  for (const kind of kinds) {
    const exists = await prisma.kind.findFirst({
      where: { name: kind.name },
    });

    if (!exists) {
      await prisma.kind.create({
        data: kind,
      });
      console.log(`  + Creado Kind: ${kind.name}`);
    } else {
      console.log(`  = Ya existe Kind: ${kind.name}`);
    }
  }

  // Catálogo Gender (Género)
  const genders = [
    { name: 'Macho' },
    { name: 'Hembra' },
  ];

  console.log('Sembrando Genders...');
  for (const gender of genders) {
    const exists = await prisma.gender.findFirst({
      where: { name: gender.name },
    });

    if (!exists) {
      await prisma.gender.create({
        data: gender,
      });
      console.log(`  + Creado Gender: ${gender.name}`);
    } else {
      console.log(`  = Ya existe Gender: ${gender.name}`);
    }
  }

  console.log('✅ Sembrado finalizado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
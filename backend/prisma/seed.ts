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

  // Catálogo Race (Razas) - Obtener Kind IDs
  const perroKind = await prisma.kind.findFirst({
    where: { name: 'Perro' },
  });
  const gatoKind = await prisma.kind.findFirst({
    where: { name: 'Gato' },
  });

  const races = [
    // Razas de perros
    { name: 'Labrador', kindId: perroKind?.id },
    { name: 'Pastor Alemán', kindId: perroKind?.id },
    { name: 'Chihuahua', kindId: perroKind?.id },
    // Razas de gatos
    { name: 'Persa', kindId: gatoKind?.id },
    { name: 'Siamés', kindId: gatoKind?.id },
    { name: 'Maine Coon', kindId: gatoKind?.id },
  ];

  console.log('Sembrando Races...');
  for (const race of races) {
    if (!race.kindId) continue;
    
    const exists = await prisma.race.findFirst({
      where: { 
        AND: [
          { name: race.name },
          { kindId: race.kindId }
        ]
      },
    });

    if (!exists) {
      await prisma.race.create({
        data: race as { name: string; kindId: string },
      });
      console.log(`  + Creada Raza: ${race.name}`);
    } else {
      console.log(`  = Ya existe Raza: ${race.name}`);
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
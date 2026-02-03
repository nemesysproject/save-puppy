import { PrismaClient } from '@prisma/client';
import { IPetRepository } from '@/domain/repositories/pet.repository';
import { PetEntity } from '@/domain/entities/pet.entity';

const prisma = new PrismaClient();

export class PrismaPetRepository implements IPetRepository {
    async create(pet: PetEntity): Promise<PetEntity> {
        const created = await prisma.pet.create({
            data: {
                name: pet.name,
                status: pet.status,
                kindId: pet.kindId,
                genderId: pet.genderId,
                shelterId: pet.shelterId,
                ownerEmail: pet.ownerEmail || '' // Prisma needs a string if not optional in schema but logic might say otherwise. checked schema: ownerEmail String... wait let me check schema again.
            }
        });
        return new PetEntity(
            created.id,
            created.name,
            created.status,
            created.kindId,
            created.genderId,
            created.shelterId,
            created.ownerEmail
        );
    }

    async update(id: string, pet: Partial<PetEntity>): Promise<PetEntity> {
        const updated = await prisma.pet.update({
            where: { id },
            data: {
                ...pet
            }
        });
        return new PetEntity(
            updated.id,
            updated.name,
            updated.status,
            updated.kindId,
            updated.genderId,
            updated.shelterId,
            updated.ownerEmail
        );
    }

    async delete(id: string): Promise<void> {
        await prisma.pet.delete({
            where: { id }
        });
    }

    async findById(id: string): Promise<PetEntity | null> {
        const found = await prisma.pet.findUnique({
            where: { id }
        });

        if (!found) return null;

        return new PetEntity(
            found.id,
            found.name,
            found.status,
            found.kindId,
            found.genderId,
            found.shelterId,
            found.ownerEmail
        );
    }

    async findAll(): Promise<PetEntity[]> {
        const pets = await prisma.pet.findMany();
        return pets.map((p: any) => new PetEntity(
            p.id,
            p.name,
            p.status,
            p.kindId,
            p.genderId,
            p.shelterId,
            p.ownerEmail
        ));
    }
}

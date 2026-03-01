import { PrismaClient } from '@prisma/client';
import { IShelterRepository } from '@/domain/repositories/shelter.repository';
import { ShelterEntity } from '@/domain/entities/shelter.entity';

const prisma = new PrismaClient();

export class PrismaShelterRepository implements IShelterRepository {
    async create(shelter: ShelterEntity): Promise<ShelterEntity> {
        const created = await prisma.shelter.create({
            data: {
                name: shelter.name,
                email: shelter.email,
                address: shelter.address,
                latitude: shelter.latitude,
                longitude: shelter.longitude,
                capacity: shelter.capacity
            }
        });
        return new ShelterEntity(
            created.id,
            created.name,
            created.email,
            created.address,
            created.latitude,
            created.longitude,
            created.capacity
        );
    }

    async update(id: string, shelter: Partial<ShelterEntity>): Promise<ShelterEntity> {
        const updated = await prisma.shelter.update({
            where: { id },
            data: {
                ...shelter
            }
        });
        return new ShelterEntity(
            updated.id,
            updated.name,
            updated.email,
            updated.address,
            updated.latitude,
            updated.longitude,
            updated.capacity
        );
    }

    async delete(id: string): Promise<void> {
        await prisma.shelter.delete({
            where: { id }
        });
    }

    async findById(id: string): Promise<ShelterEntity | null> {
        const found = await prisma.shelter.findUnique({
            where: { id }
        });

        if (!found) return null;

        return new ShelterEntity(
            found.id,
            found.name,
            found.email,
            found.address,
            found.latitude,
            found.longitude,
            found.capacity
        );
    }

    async findAll(): Promise<ShelterEntity[]> {
        const shelters = await prisma.shelter.findMany();
        return shelters.map((s: any) => new ShelterEntity(
            s.id,
            s.name,
            s.email,
            s.address,
            s.latitude,
            s.longitude,
            s.capacity
        ));
    }
}

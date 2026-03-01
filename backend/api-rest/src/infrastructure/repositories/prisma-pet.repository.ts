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

    async findByLocation(kindId: string, lat: number, lon: number, radius: number, raceId?: string): Promise<any[]> {
        // En una implementación real con PostGIS usaríamos raw query.
        // Aquí simplificamos filtrando por kindId y raceId, e incluyendo los datos de Media (que tienen lat/lon)
        const where: any = {
            kindId: kindId,
            status: { in: ['LOST', 'ADOPTION'] } // Solo buscamos mascotas que podrían ser candidatos
        };

        if (raceId) {
            where.raceId = raceId;
        }

        const candidates = await prisma.pet.findMany({
            where,
            include: {
                media: {
                    select: {
                        url: true,
                        latitude: true,
                        longitude: true
                    }
                }
            }
        });

        // Filtrado por distancia manual (simplificado)
        return candidates.filter(pet => {
            if (pet.media.length === 0) return false;

            // Verificamos si alguna de las fotos/videos de la mascota está dentro del radio
            return pet.media.some(m => {
                if (m.latitude === null || m.longitude === null) return false;
                const dist = this.calculateDistance(lat, lon, m.latitude, m.longitude);
                return dist <= radius;
            });
        });
    }

    private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371; // Radio de la tierra en km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}

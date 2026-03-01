import { prisma } from '@/infrastructure/database/prisma';
import { IRaceRepository } from '../../domain/repositories/race.repository';
import { Race } from '../../domain/entities/race.entity';

export class PrismaRaceRepository implements IRaceRepository {
  async create(race: Omit<Race, 'id' | 'createdAt' | 'updatedAt'>): Promise<Race> {
    return prisma.race.create({
      data: race,
    });
  }

  async findById(id: string): Promise<Race | null> {
    return prisma.race.findUnique({
      where: { id },
    });
  }

  async findByName(name: string, kindId: string): Promise<Race | null> {
    return prisma.race.findUnique({
      where: { name_kindId: { name, kindId } },
    });
  }

  async findByKindId(kindId: string): Promise<Race[]> {
    return prisma.race.findMany({
      where: { kindId },
    });
  }

  async findAll(): Promise<Race[]> {
    return prisma.race.findMany();
  }

  async update(id: string, data: Partial<Race>): Promise<Race> {
    return prisma.race.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.race.delete({
      where: { id },
    });
  }
}

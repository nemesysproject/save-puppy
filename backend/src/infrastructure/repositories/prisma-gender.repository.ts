import { IGenderRepository } from "@/domain/repositories/gender.repository";
import { GenderEntity } from "@/domain/entities/gender.entity";
import { prisma } from "../database/prisma";

export class PrismaGenderRepository implements IGenderRepository {
    async findAll(): Promise<GenderEntity[]> {
        console.log('PrismaGenderRepository.findAll executing...');
        console.log('prisma client status:', prisma != null ? 'connected' : 'null');
        try {
            const genders = await prisma.gender.findMany();
            console.log(`PrismaGenderRepository found ${genders.length} records`);
            return genders.map(k => new GenderEntity(k.id, k.name, k.createdAt, k.updatedAt));
        } catch (error) {
            console.error('PrismaGenderRepository.findAll failed:', error);
            throw error;
        }
    }
}

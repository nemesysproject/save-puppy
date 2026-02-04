"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaGenderRepository = void 0;
const gender_entity_1 = require("../../domain/entities/gender.entity");
const prisma_1 = require("../database/prisma");
class PrismaGenderRepository {
    async findAll() {
        console.log('PrismaGenderRepository.findAll executing...');
        console.log('prisma client status:', prisma_1.prisma != null ? 'connected' : 'null');
        try {
            const genders = await prisma_1.prisma.gender.findMany();
            console.log(`PrismaGenderRepository found ${genders.length} records`);
            return genders.map(k => new gender_entity_1.GenderEntity(k.id, k.name, k.createdAt, k.updatedAt));
        }
        catch (error) {
            console.error('PrismaGenderRepository.findAll failed:', error);
            throw error;
        }
    }
}
exports.PrismaGenderRepository = PrismaGenderRepository;

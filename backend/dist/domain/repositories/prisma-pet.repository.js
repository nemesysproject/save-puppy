"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaPetRepository = void 0;
const prisma_1 = require("../../infrastructure/database/prisma");
const pet_entity_1 = require("../../domain/entities/pet.entity");
class PrismaPetRepository {
    async save(pet) {
        await prisma_1.prisma.pet.create({
            data: {
                id: pet.id,
                name: pet.name,
                status: pet.status,
                kindId: pet.kindId,
                genderId: pet.genderId,
                shelterId: pet.shelterId,
                ownerEmail: pet.ownerEmail || 'temp@example.com'
            }
        });
    }
    async findById(id) {
        const petModel = await prisma_1.prisma.pet.findUnique({ where: { id } });
        if (!petModel)
            return null;
        return new pet_entity_1.PetEntity(petModel.id, petModel.name, petModel.status, petModel.kindId, petModel.genderId, petModel.shelterId, petModel.ownerEmail);
    }
}
exports.PrismaPetRepository = PrismaPetRepository;

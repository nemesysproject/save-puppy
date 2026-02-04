"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaPetRepository = void 0;
const client_1 = require("@prisma/client");
const pet_entity_1 = require("../../domain/entities/pet.entity");
const prisma = new client_1.PrismaClient();
class PrismaPetRepository {
    async create(pet) {
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
        return new pet_entity_1.PetEntity(created.id, created.name, created.status, created.kindId, created.genderId, created.shelterId, created.ownerEmail);
    }
    async update(id, pet) {
        const updated = await prisma.pet.update({
            where: { id },
            data: {
                ...pet
            }
        });
        return new pet_entity_1.PetEntity(updated.id, updated.name, updated.status, updated.kindId, updated.genderId, updated.shelterId, updated.ownerEmail);
    }
    async delete(id) {
        await prisma.pet.delete({
            where: { id }
        });
    }
    async findById(id) {
        const found = await prisma.pet.findUnique({
            where: { id }
        });
        if (!found)
            return null;
        return new pet_entity_1.PetEntity(found.id, found.name, found.status, found.kindId, found.genderId, found.shelterId, found.ownerEmail);
    }
    async findAll() {
        const pets = await prisma.pet.findMany();
        return pets.map((p) => new pet_entity_1.PetEntity(p.id, p.name, p.status, p.kindId, p.genderId, p.shelterId, p.ownerEmail));
    }
}
exports.PrismaPetRepository = PrismaPetRepository;

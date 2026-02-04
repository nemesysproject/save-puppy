"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaShelterRepository = void 0;
const client_1 = require("@prisma/client");
const shelter_entity_1 = require("../../domain/entities/shelter.entity");
const prisma = new client_1.PrismaClient();
class PrismaShelterRepository {
    async create(shelter) {
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
        return new shelter_entity_1.ShelterEntity(created.id, created.name, created.email, created.address, created.latitude, created.longitude, created.capacity);
    }
    async update(id, shelter) {
        const updated = await prisma.shelter.update({
            where: { id },
            data: {
                ...shelter
            }
        });
        return new shelter_entity_1.ShelterEntity(updated.id, updated.name, updated.email, updated.address, updated.latitude, updated.longitude, updated.capacity);
    }
    async delete(id) {
        await prisma.shelter.delete({
            where: { id }
        });
    }
    async findById(id) {
        const found = await prisma.shelter.findUnique({
            where: { id }
        });
        if (!found)
            return null;
        return new shelter_entity_1.ShelterEntity(found.id, found.name, found.email, found.address, found.latitude, found.longitude, found.capacity);
    }
    async findAll() {
        const shelters = await prisma.shelter.findMany();
        return shelters.map((s) => new shelter_entity_1.ShelterEntity(s.id, s.name, s.email, s.address, s.latitude, s.longitude, s.capacity));
    }
}
exports.PrismaShelterRepository = PrismaShelterRepository;

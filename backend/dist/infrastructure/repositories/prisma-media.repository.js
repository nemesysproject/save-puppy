"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaMediaRepository = void 0;
const client_1 = require("@prisma/client");
const media_entity_1 = require("../../domain/entities/media.entity");
const prisma = new client_1.PrismaClient();
class PrismaMediaRepository {
    async create(media) {
        const created = await prisma.media.create({
            data: {
                url: media.url,
                storageKey: media.storageKey,
                provider: media.provider,
                type: media.type,
                latitude: media.latitude,
                longitude: media.longitude,
                petId: media.petId
            }
        });
        return new media_entity_1.MediaEntity(created.id, created.url, created.storageKey, created.provider, created.type, created.latitude, created.longitude, created.petId, created.createdAt, created.updatedAt);
    }
    async delete(id) {
        await prisma.media.delete({
            where: { id }
        });
    }
    async findById(id) {
        const found = await prisma.media.findUnique({
            where: { id }
        });
        if (!found)
            return null;
        return new media_entity_1.MediaEntity(found.id, found.url, found.storageKey, found.provider, found.type, found.latitude, found.longitude, found.petId, found.createdAt, found.updatedAt);
    }
    async findByPetId(petId) {
        const found = await prisma.media.findMany({
            where: { petId }
        });
        return found.map((m) => new media_entity_1.MediaEntity(m.id, m.url, m.storageKey, m.provider, m.type, m.latitude, m.longitude, m.petId, m.createdAt, m.updatedAt));
    }
}
exports.PrismaMediaRepository = PrismaMediaRepository;

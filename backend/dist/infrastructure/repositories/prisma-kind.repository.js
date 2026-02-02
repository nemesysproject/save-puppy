"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaKindRepository = void 0;
const prisma_1 = require("../../infrastructure/database/prisma");
const kind_entity_1 = require("../../domain/entities/kind.entity");
class PrismaKindRepository {
    async findAll() {
        const kinds = await prisma_1.prisma.kind.findMany();
        return kinds.map(k => new kind_entity_1.KindEntity(k.id, k.name, k.createdAt, k.updatedAt));
    }
}
exports.PrismaKindRepository = PrismaKindRepository;

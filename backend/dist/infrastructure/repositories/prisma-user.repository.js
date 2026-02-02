"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserRepository = void 0;
const prisma_1 = require("../../infrastructure/database/prisma");
const user_entity_1 = require("../../domain/entities/user.entity");
class PrismaUserRepository {
    async save(user) {
        await prisma_1.prisma.user.create({
            data: {
                id: user.id,
                email: user.email,
                password: user.password,
                role: user.role,
                provider: user.provider,
                providerId: user.providerId
            }
        });
    }
    async findByEmail(email) {
        const userModel = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (!userModel)
            return null;
        return new user_entity_1.UserEntity(userModel.id, userModel.email, userModel.role, userModel.provider, userModel.password, userModel.providerId);
    }
}
exports.PrismaUserRepository = PrismaUserRepository;

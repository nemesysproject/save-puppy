import { UserEntity } from "@/domain/entities/user.entity";
import type { IUserRepository } from "@/domain/repositories/user.repository";
import { prisma } from "@/infrastructure/database/prisma";

export class PrismaUserRepository implements IUserRepository {
	async save(user: UserEntity): Promise<void> {
		await prisma.user.create({
			data: {
				id: user.id,
				email: user.email,
				password: user.password,
				role: user.role,
				provider: user.provider,
				providerId: user.providerId,
			},
		});
	}

	async findByEmail(email: string): Promise<UserEntity | null> {
		const userModel = await prisma.user.findUnique({ where: { email } });

		if (!userModel) return null;

		return new UserEntity(
			userModel.id,
			userModel.email,
			userModel.role,
			userModel.provider,
			userModel.password,
			userModel.providerId,
		);
	}
}

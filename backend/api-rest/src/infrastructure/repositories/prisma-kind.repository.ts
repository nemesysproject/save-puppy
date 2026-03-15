import { KindEntity } from "@/domain/entities/kind.entity";
import type { IKindRepository } from "@/domain/repositories/kind.repository";
import { prisma } from "@/infrastructure/database/prisma";

export class PrismaKindRepository implements IKindRepository {
	async findAll(): Promise<KindEntity[]> {
		console.log("PrismaKindRepository.findAll executing...");
		console.log("prisma client status:", prisma != null ? "connected" : "null");
		try {
			const kinds = await prisma.kind.findMany();
			console.log(`PrismaKindRepository found ${kinds.length} records`);
			return kinds.map(
				(k) => new KindEntity(k.id, k.name, k.createdAt, k.updatedAt),
			);
		} catch (error) {
			console.error("PrismaKindRepository.findAll failed:", error);
			throw error;
		}
	}
}

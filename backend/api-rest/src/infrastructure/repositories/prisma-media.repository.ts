import { PrismaClient } from "@prisma/client";
import { MediaEntity } from "@/domain/entities/media.entity";
import type { IMediaRepository } from "@/domain/repositories/media.repository";

const prisma = new PrismaClient();

export class PrismaMediaRepository implements IMediaRepository {
	async create(media: MediaEntity): Promise<MediaEntity> {
		const created = await prisma.media.create({
			data: {
				url: media.url,
				storageKey: media.storageKey,
				provider: media.provider,
				type: media.type,
				latitude: media.latitude,
				longitude: media.longitude,
				geohash: media.geohash ?? null,
				petId: media.petId,
			},
		});
		return new MediaEntity(
			created.id,
			created.url,
			created.storageKey,
			created.provider,
			created.type,
			created.latitude,
			created.longitude,
			created.geohash,
			created.petId,
			created.createdAt,
			created.updatedAt,
		);
	}

	async delete(id: string): Promise<void> {
		await prisma.media.delete({
			where: { id },
		});
	}

	async findById(id: string): Promise<MediaEntity | null> {
		const found = await prisma.media.findUnique({
			where: { id },
		});

		if (!found) return null;

		return new MediaEntity(
			found.id,
			found.url,
			found.storageKey,
			found.provider,
			found.type,
			found.latitude,
			found.longitude,
			found.geohash,
			found.petId,
			found.createdAt,
			found.updatedAt,
		);
	}

	async findByPetId(petId: string): Promise<MediaEntity[]> {
		const found = await prisma.media.findMany({
			where: { petId },
		});

		return found.map(
			(m: any) =>
				new MediaEntity(
					m.id,
					m.url,
					m.storageKey,
					m.provider,
					m.type,
					m.latitude,
					m.longitude,
					m.geohash,
					m.petId,
					m.createdAt.toISOString(),
					m.updatedAt.toISOString(),
				),
		);
	}

	async findByGeohashPrefix(
		prefix: string,
		limit = 50,
	): Promise<MediaEntity[]> {
		const found = await prisma.media.findMany({
			where: {
				geohash: {
					startsWith: prefix,
				},
			},
			take: limit,
		});

		return found.map(
			(m: any) =>
				new MediaEntity(
					m.id,
					m.url,
					m.storageKey,
					m.provider,
					m.type,
					m.latitude,
					m.longitude,
					m.geohash,
					m.petId,
					m.createdAt.toISOString(),
					m.updatedAt.toISOString(),
				),
		);
	}
}

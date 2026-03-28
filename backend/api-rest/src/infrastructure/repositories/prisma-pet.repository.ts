import { PrismaClient } from "@prisma/client";
import { PetEntity } from "@/domain/entities/pet.entity";
import type { IPetRepository } from "@/domain/repositories/pet.repository";
import { computeGeohash, geohashNeighbors } from "@/infrastructure/services/geohash.service";

interface PetMedia {
	url: string;
	latitude: number | null;
	longitude: number | null;
}

export interface PetWithMedia {
	id: string;
	name: string;
	status: string;
	kindId: string;
	genderId: string;
	shelterId: string | null;
	ownerEmail: string | null;
	createdAt: Date;
	kind?: { name: string };
	gender?: { name: string };
	race?: { name: string } | null;
	media?: PetMedia[];
	distance?: number;
}

const prisma = new PrismaClient();

export class PrismaPetRepository implements IPetRepository {
	async create(pet: PetEntity): Promise<PetEntity> {
		const created = await prisma.pet.create({
			data: {
				name: pet.name,
				status: pet.status,
				kindId: pet.kindId,
				genderId: pet.genderId,
				raceId: pet.raceId,
				shelterId: pet.shelterId,
				ownerEmail: pet.ownerEmail,
				ownerId: pet.ownerId,
			},
		});
		return new PetEntity(
			created.id,
			created.name,
			created.status,
			created.kindId,
			created.genderId,
			created.shelterId,
			created.ownerEmail,
			created.ownerId,
			created.raceId,
		);
	}

	async update(id: string, pet: Partial<PetEntity>): Promise<PetEntity> {
		const updated = await prisma.pet.update({
			where: { id },
			data: { ...pet },
		});
		return new PetEntity(
			updated.id,
			updated.name,
			updated.status,
			updated.kindId,
			updated.genderId,
			updated.shelterId,
			updated.ownerEmail,
			updated.ownerId,
			updated.raceId,
		);
	}

	async delete(id: string): Promise<void> {
		await prisma.pet.delete({ where: { id } });
	}

	async findById(id: string): Promise<PetEntity | null> {
		const found = await prisma.pet.findUnique({ where: { id } });
		if (!found) return null;
		return new PetEntity(
			found.id,
			found.name,
			found.status,
			found.kindId,
			found.genderId,
			found.shelterId,
			found.ownerEmail,
			found.ownerId,
			found.raceId,
		);
	}

	async findAll(): Promise<PetEntity[]> {
		const pets = await prisma.pet.findMany();
		return pets.map(
			(p: any) =>
				new PetEntity(
					p.id,
					p.name,
					p.status,
					p.kindId,
					p.genderId,
					p.shelterId,
					p.ownerEmail,
					p.ownerId,
					p.raceId,
				),
		);
	}

	async findByLocation(
		lat: number,
		lon: number,
		radiusKm: number,
		kindId?: string,
		raceId?: string,
		status?: string,
		withImages?: boolean,
	): Promise<any[]> {
		const radiusInMeters = radiusKm * 1000;

		const centerHash = computeGeohash(lat, lon, radiusInMeters);
		const prefixes = geohashNeighbors(centerHash);

		console.log(`[findByLocation] Lat: ${lat}, Lon: ${lon}, Radius: ${radiusKm}km (${radiusInMeters}m)`);
		console.log(`[findByLocation] Geohash Precision: length=${centerHash.length}, center=${centerHash}, neighbors=${prefixes.length}`);

		// Filtro OR para las 9 celdas o vecinos que cubren el radio
		const geohashFilter = {
			OR: prefixes.map((p) => ({ geohash: { startsWith: p } })),
		};

		const where: any = {
			media: {
				some: geohashFilter,
			},
		};

		if (kindId) where.kindId = kindId;
		if (raceId) where.raceId = raceId;

		if (status) {
			where.status = status;
		} else {
			where.status = { in: ["LOST", "ADOPTION"] };
		}

		const candidates = await prisma.pet.findMany({
			where,
			include: {
				kind: true,
				gender: true,
				race: true,
				media: {
					where: geohashFilter,
					select: {
						id: true,
						url: true,
						latitude: true,
						longitude: true,
						geohash: true,
					},
					orderBy: { createdAt: "asc" },
				},
			},
			orderBy: { createdAt: "desc" },
		});

		console.log(`[findByLocation] Found ${candidates.length} candidates`);

		const results: PetWithMedia[] = candidates
			.map((pet) => {
				const mediaWithDistance: {
					url: string;
					latitude: number | null;
					longitude: number | null;
					distance?: number;
				}[] = [];
				let minDistance = Infinity;

				pet.media.forEach((m) => {
					console.log(`[findByLocation] Pet ${pet.id} has media ${m.latitude}, ${m.longitude}`);
					if (m.latitude !== null && m.longitude !== null) {
						const dist = this.calculateDistance(lat, lon, m.latitude, m.longitude);
						if (dist <= radiusKm) {
							mediaWithDistance.push({ url: m.url, latitude: m.latitude, longitude: m.longitude, distance: dist });
							if (dist < minDistance) minDistance = dist;
						}
					} else if (m.geohash && prefixes.some((p) => m.geohash!.startsWith(p))) {
						// Fallback: Si no hay lat/lon pero sabemos que el geohash coindice
						mediaWithDistance.push({ url: m.url, latitude: lat, longitude: lon, distance: radiusKm });
						if (radiusKm < minDistance) minDistance = radiusKm;
					}
				});

				const basePet = {
					id: pet.id,
					name: pet.name,
					status: pet.status,
					kindId: pet.kindId,
					genderId: pet.genderId,
					shelterId: pet.shelterId,
					ownerEmail: pet.ownerEmail,
					ownerId: pet.ownerId,
					createdAt: pet.createdAt,
					kind: pet.kind,
					gender: pet.gender,
					raceId: pet.raceId,
					race: pet.race,
				};

				if (withImages === false) {
					return {
						...basePet,
						media: mediaWithDistance.map((m) => ({ url: m.url, latitude: m.latitude, longitude: m.longitude })),
						distance: minDistance === Infinity ? null : minDistance,
					};
				}

				if (mediaWithDistance.length > 0) {
					return {
						...basePet,
						media: mediaWithDistance.map((m) => ({ url: m.url, latitude: m.latitude, longitude: m.longitude })),
						distance: minDistance,
					};
				}

				return null;
			})
			.filter(
				(p: any) => p !== null && (withImages === false || (p.media && p.media.length > 0)),
			) as any;

		console.log(`[findByLocation] Found ${results.length} results`);

		return results.sort((a, b) => (a.distance || 0) - (b.distance || 0));
	}

	private calculateDistance(
		lat1: number,
		lon1: number,
		lat2: number,
		lon2: number,
	): number {
		const R = 6371;
		const dLat = ((lat2 - lat1) * Math.PI) / 180;
		const dLon = ((lon2 - lon1) * Math.PI) / 180;
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos((lat1 * Math.PI) / 180) *
			Math.cos((lat2 * Math.PI) / 180) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c;
	}
}

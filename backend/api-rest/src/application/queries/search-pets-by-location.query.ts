import type { IPetRepository } from "@/domain/repositories/pet.repository";
import type { IHandler } from "@/infrastructure/shared/mediator";

export class SearchPetsByLocationQuery {
	constructor(
		public readonly latitude: number,
		public readonly longitude: number,
		public readonly radiusKm: number,
		public readonly kindId?: string,
		public readonly raceId?: string,
		public readonly status?: string,
		public readonly withImages?: boolean,
	) { }
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
	media?: { url: string; latitude: number | null; longitude: number | null }[];
	distance?: number;
}

export class SearchPetsByLocationHandler
	implements IHandler<SearchPetsByLocationQuery, PetWithMedia[]> {
	constructor(private petRepository: IPetRepository) { }

	async handle(query: SearchPetsByLocationQuery): Promise<PetWithMedia[]> {

		return await this.petRepository.findByLocation(
			query.latitude,
			query.longitude,
			query.radiusKm,
			query.kindId,
			query.raceId,
			query.status,
			query.withImages,
		);
	}
}

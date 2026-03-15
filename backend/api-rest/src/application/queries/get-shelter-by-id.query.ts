import type { ShelterEntity } from "@/domain/entities/shelter.entity";
import type { IShelterRepository } from "@/domain/repositories/shelter.repository";
import type { IHandler } from "@/infrastructure/shared/mediator";

export class GetShelterByIdQuery {
	constructor(public readonly id: string) {}
}

export class GetShelterByIdHandler
	implements IHandler<GetShelterByIdQuery, ShelterEntity | null>
{
	constructor(private shelterRepository: IShelterRepository) {}

	async handle(query: GetShelterByIdQuery): Promise<ShelterEntity | null> {
		return await this.shelterRepository.findById(query.id);
	}
}

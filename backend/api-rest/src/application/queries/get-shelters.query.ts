import type { ShelterEntity } from "@/domain/entities/shelter.entity";
import type { IShelterRepository } from "@/domain/repositories/shelter.repository";
import type { IHandler } from "@/infrastructure/shared/mediator";

export class GetSheltersQuery {}

export class GetSheltersHandler
	implements IHandler<GetSheltersQuery, ShelterEntity[]>
{
	constructor(private shelterRepository: IShelterRepository) {}

	async handle(query: GetSheltersQuery): Promise<ShelterEntity[]> {
		return await this.shelterRepository.findAll();
	}
}

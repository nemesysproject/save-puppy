import type { PetEntity } from "@/domain/entities/pet.entity";
import type { IPetRepository } from "@/domain/repositories/pet.repository";
import type { IHandler } from "@/infrastructure/shared/mediator";

export class GetPetsQuery {}

export class GetPetsHandler implements IHandler<GetPetsQuery, PetEntity[]> {
	constructor(private petRepository: IPetRepository) {}

	async handle(query: GetPetsQuery): Promise<PetEntity[]> {
		return await this.petRepository.findAll();
	}
}

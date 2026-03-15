import type { PetEntity } from "@/domain/entities/pet.entity";
import type { IPetRepository } from "@/domain/repositories/pet.repository";
import type { IHandler } from "@/infrastructure/shared/mediator";

export class GetPetByIdQuery {
	constructor(public readonly id: string) {}
}

export class GetPetByIdHandler
	implements IHandler<GetPetByIdQuery, PetEntity | null>
{
	constructor(private petRepository: IPetRepository) {}

	async handle(query: GetPetByIdQuery): Promise<PetEntity | null> {
		return await this.petRepository.findById(query.id);
	}
}

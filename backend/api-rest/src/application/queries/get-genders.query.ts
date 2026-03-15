import type { GenderEntity } from "@/domain/entities/gender.entity";
import { KindEntity } from "@/domain/entities/kind.entity";
import type { IGenderRepository } from "@/domain/repositories/gender.repository";
import type { IHandler } from "@/infrastructure/shared/mediator";

export class GetGendersQuery {
	// No properties needed for getting all kinds
}

export class GetGendersHandler
	implements IHandler<GetGendersQuery, GenderEntity[]>
{
	constructor(private genderRepository: IGenderRepository) {
		console.log("GetGendersHandler initialized with GenderRepository");
	}

	async handle(query: GetGendersQuery): Promise<GenderEntity[]> {
		return await this.genderRepository.findAll();
	}
}

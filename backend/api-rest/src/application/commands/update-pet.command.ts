import type { PetEntity } from "@/domain/entities/pet.entity";
import type { IPetRepository } from "@/domain/repositories/pet.repository";
import type { IHandler } from "@/infrastructure/shared/mediator";

export class UpdatePetCommand {
	constructor(
		public readonly id: string,
		public readonly name?: string,
		public readonly status?: string,
		public readonly kindId?: string,
		public readonly genderId?: string,
		public readonly shelterId?: string | null,
		public readonly ownerEmail?: string,
	) {}
}

export class UpdatePetHandler implements IHandler<UpdatePetCommand, PetEntity> {
	constructor(private petRepository: IPetRepository) {}

	async handle(command: UpdatePetCommand): Promise<PetEntity> {
		const petToUpdate: Partial<PetEntity> = {};
		if (command.name) petToUpdate.name = command.name;
		if (command.status) petToUpdate.status = command.status;
		if (command.kindId) petToUpdate.kindId = command.kindId;
		if (command.genderId) petToUpdate.genderId = command.genderId;
		if (command.shelterId !== undefined)
			petToUpdate.shelterId = command.shelterId;
		if (command.ownerEmail !== undefined)
			petToUpdate.ownerEmail = command.ownerEmail;

		return await this.petRepository.update(command.id, petToUpdate);
	}
}

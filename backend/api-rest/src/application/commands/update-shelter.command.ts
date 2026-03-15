import type { ShelterEntity } from "@/domain/entities/shelter.entity";
import type { IShelterRepository } from "@/domain/repositories/shelter.repository";
import type { IHandler } from "@/infrastructure/shared/mediator";

export class UpdateShelterCommand {
	constructor(
		public readonly id: string,
		public readonly name?: string,
		public readonly email?: string,
		public readonly address?: string,
		public readonly latitude?: number,
		public readonly longitude?: number,
		public readonly capacity?: number,
	) {}
}

export class UpdateShelterHandler
	implements IHandler<UpdateShelterCommand, ShelterEntity>
{
	constructor(private shelterRepository: IShelterRepository) {}

	async handle(command: UpdateShelterCommand): Promise<ShelterEntity> {
		const shelterToUpdate: Partial<ShelterEntity> = {};
		if (command.name) shelterToUpdate.name = command.name;
		if (command.email) shelterToUpdate.email = command.email;
		if (command.address) shelterToUpdate.address = command.address;
		if (command.latitude) shelterToUpdate.latitude = command.latitude;
		if (command.longitude) shelterToUpdate.longitude = command.longitude;
		if (command.capacity) shelterToUpdate.capacity = command.capacity;

		return await this.shelterRepository.update(command.id, shelterToUpdate);
	}
}

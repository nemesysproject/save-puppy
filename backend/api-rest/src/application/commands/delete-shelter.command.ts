import type { IShelterRepository } from "@/domain/repositories/shelter.repository";
import type { IHandler } from "@/infrastructure/shared/mediator";

export class DeleteShelterCommand {
	constructor(public readonly id: string) {}
}

export class DeleteShelterHandler
	implements IHandler<DeleteShelterCommand, void>
{
	constructor(private shelterRepository: IShelterRepository) {}

	async handle(command: DeleteShelterCommand): Promise<void> {
		await this.shelterRepository.delete(command.id);
	}
}

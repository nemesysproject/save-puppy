import { IHandler } from '@/infrastructure/shared/mediator';
import { IShelterRepository } from '@/domain/repositories/shelter.repository';

export class DeleteShelterCommand {
    constructor(
        public readonly id: string
    ) { }
}

export class DeleteShelterHandler implements IHandler<DeleteShelterCommand, void> {
    constructor(private shelterRepository: IShelterRepository) { }

    async handle(command: DeleteShelterCommand): Promise<void> {
        await this.shelterRepository.delete(command.id);
    }
}

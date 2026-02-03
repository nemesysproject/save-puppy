import { IHandler } from '@/infrastructure/shared/mediator';
import { IPetRepository } from '@/domain/repositories/pet.repository';

export class DeletePetCommand {
    constructor(
        public readonly id: string
    ) { }
}

export class DeletePetHandler implements IHandler<DeletePetCommand, void> {
    constructor(private petRepository: IPetRepository) { }

    async handle(command: DeletePetCommand): Promise<void> {
        await this.petRepository.delete(command.id);
    }
}

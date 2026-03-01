import { IHandler } from '@/infrastructure/shared/mediator';
import { IPetRepository } from '@/domain/repositories/pet.repository';
import { PetEntity } from '@/domain/entities/pet.entity';

export class GetPetByIdQuery {
    constructor(public readonly id: string) { }
}

export class GetPetByIdHandler implements IHandler<GetPetByIdQuery, PetEntity | null> {
    constructor(private petRepository: IPetRepository) { }

    async handle(query: GetPetByIdQuery): Promise<PetEntity | null> {
        return await this.petRepository.findById(query.id);
    }
}

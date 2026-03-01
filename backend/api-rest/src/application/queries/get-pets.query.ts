import { IHandler } from '@/infrastructure/shared/mediator';
import { IPetRepository } from '@/domain/repositories/pet.repository';
import { PetEntity } from '@/domain/entities/pet.entity';

export class GetPetsQuery { }

export class GetPetsHandler implements IHandler<GetPetsQuery, PetEntity[]> {
    constructor(private petRepository: IPetRepository) { }

    async handle(query: GetPetsQuery): Promise<PetEntity[]> {
        return await this.petRepository.findAll();
    }
}

import { IHandler } from '@/infrastructure/shared/mediator';
import { IShelterRepository } from '@/domain/repositories/shelter.repository';
import { ShelterEntity } from '@/domain/entities/shelter.entity';

export class GetSheltersQuery { }

export class GetSheltersHandler implements IHandler<GetSheltersQuery, ShelterEntity[]> {
    constructor(private shelterRepository: IShelterRepository) { }

    async handle(query: GetSheltersQuery): Promise<ShelterEntity[]> {
        return await this.shelterRepository.findAll();
    }
}

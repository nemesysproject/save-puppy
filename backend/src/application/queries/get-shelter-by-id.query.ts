import { IHandler } from '@/infrastructure/shared/mediator';
import { IShelterRepository } from '@/domain/repositories/shelter.repository';
import { ShelterEntity } from '@/domain/entities/shelter.entity';

export class GetShelterByIdQuery {
    constructor(public readonly id: string) { }
}

export class GetShelterByIdHandler implements IHandler<GetShelterByIdQuery, ShelterEntity | null> {
    constructor(private shelterRepository: IShelterRepository) { }

    async handle(query: GetShelterByIdQuery): Promise<ShelterEntity | null> {
        return await this.shelterRepository.findById(query.id);
    }
}

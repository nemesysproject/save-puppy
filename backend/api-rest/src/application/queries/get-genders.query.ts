import { IHandler } from '@/infrastructure/shared/mediator';
import { KindEntity } from '@/domain/entities/kind.entity';

import { GenderEntity } from '@/domain/entities/gender.entity';
import { IGenderRepository } from '@/domain/repositories/gender.repository';

export class GetGendersQuery {
    // No properties needed for getting all kinds
}

export class GetGendersHandler implements IHandler<GetGendersQuery, GenderEntity[]> {
    constructor(private genderRepository: IGenderRepository) {
        console.log('GetGendersHandler initialized with GenderRepository');
    }

    async handle(query: GetGendersQuery): Promise<GenderEntity[]> {
        return await this.genderRepository.findAll();
    }
}

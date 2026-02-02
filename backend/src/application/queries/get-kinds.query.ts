import { IHandler } from '@/infrastructure/shared/mediator';
import { KindEntity } from '@/domain/entities/kind.entity';
import { IKindRepository } from '@/domain/repositories/kind.repository';

export class GetKindsQuery {
    // No properties needed for getting all kinds
}

export class GetKindsHandler implements IHandler<GetKindsQuery, KindEntity[]> {
    constructor(private kindRepository: IKindRepository) { 
        console.log('GetKindsHandler initialized with KindRepository');
    }

    async handle(query: GetKindsQuery): Promise<KindEntity[]> {
        return await this.kindRepository.findAll();
    }
}

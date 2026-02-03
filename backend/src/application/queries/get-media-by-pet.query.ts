import { IHandler } from '@/infrastructure/shared/mediator';
import { IMediaRepository } from '@/domain/repositories/media.repository';
import { MediaEntity } from '@/domain/entities/media.entity';

export class GetMediaByPetQuery {
    constructor(public readonly petId: string) { }
}

export class GetMediaByPetHandler implements IHandler<GetMediaByPetQuery, MediaEntity[]> {
    constructor(private mediaRepository: IMediaRepository) { }

    async handle(query: GetMediaByPetQuery): Promise<MediaEntity[]> {
        return await this.mediaRepository.findByPetId(query.petId);
    }
}

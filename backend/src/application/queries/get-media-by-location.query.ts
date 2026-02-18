import { IHandler } from '@/infrastructure/shared/mediator';
import { IMediaRepository } from '@/domain/repositories/media.repository';
import { MediaEntity } from '@/domain/entities/media.entity';

export class GetMediaByLocationQuery {
    constructor(public readonly geohashPrefix: string, public readonly limit = 50) { }
}

export class GetMediaByLocationHandler implements IHandler<GetMediaByLocationQuery, MediaEntity[]> {
    constructor(private mediaRepository: IMediaRepository) { }

    async handle(query: GetMediaByLocationQuery): Promise<MediaEntity[]> {
        return await this.mediaRepository.findByGeohashPrefix(query.geohashPrefix, query.limit);
    }
}

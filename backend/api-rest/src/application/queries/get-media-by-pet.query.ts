import type { MediaEntity } from "@/domain/entities/media.entity";
import type { IMediaRepository } from "@/domain/repositories/media.repository";
import type { IHandler } from "@/infrastructure/shared/mediator";

export class GetMediaByPetQuery {
	constructor(public readonly petId: string) {}
}

export class GetMediaByPetHandler
	implements IHandler<GetMediaByPetQuery, MediaEntity[]>
{
	constructor(private mediaRepository: IMediaRepository) {}

	async handle(query: GetMediaByPetQuery): Promise<MediaEntity[]> {
		return await this.mediaRepository.findByPetId(query.petId);
	}
}

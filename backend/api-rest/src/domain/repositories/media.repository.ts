import type { MediaEntity } from "../entities/media.entity";

export interface IMediaRepository {
	create(media: MediaEntity): Promise<MediaEntity>;
	delete(id: string): Promise<void>;
	findById(id: string): Promise<MediaEntity | null>;
	findByPetId(petId: string): Promise<MediaEntity[]>;
	findByGeohashPrefix(prefix: string, limit?: number): Promise<MediaEntity[]>;
}

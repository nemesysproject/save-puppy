import type { ShelterEntity } from "../entities/shelter.entity";

export interface IShelterRepository {
	create(shelter: ShelterEntity): Promise<ShelterEntity>;
	update(id: string, shelter: Partial<ShelterEntity>): Promise<ShelterEntity>;
	delete(id: string): Promise<void>;
	findById(id: string): Promise<ShelterEntity | null>;
	findAll(): Promise<ShelterEntity[]>;
}

import type { GenderEntity } from "../entities/gender.entity";

//GenderEntity
export interface IGenderRepository {
	findAll(): Promise<GenderEntity[]>;
}

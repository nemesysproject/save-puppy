import type { Race } from "../../domain/entities/race.entity";
import type { IRaceRepository } from "../../domain/repositories/race.repository";

export class GetRacesByKindQuery {
	constructor(readonly kindId: string) {}
}

export class GetRacesByKindHandler {
	constructor(private raceRepository: IRaceRepository) {}

	async handle(query: GetRacesByKindQuery): Promise<Race[]> {
		return this.raceRepository.findByKindId(query.kindId);
	}
}

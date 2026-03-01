import { Race } from '../../domain/entities/race.entity';
import { IRaceRepository } from '../../domain/repositories/race.repository';

export class GetRacesByKindQuery {
  constructor(readonly kindId: string) {}
}

export class GetRacesByKindHandler {
  constructor(private raceRepository: IRaceRepository) {}

  async handle(query: GetRacesByKindQuery): Promise<Race[]> {
    return this.raceRepository.findByKindId(query.kindId);
  }
}

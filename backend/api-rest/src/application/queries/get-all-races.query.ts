import { IHandler } from '@/infrastructure/shared/mediator';
import { Race } from '@/domain/entities/race.entity';
import { IRaceRepository } from '@/domain/repositories/race.repository';

export class GetAllRacesQuery {
  constructor() {}
}

export class GetAllRacesHandler implements IHandler<GetAllRacesQuery, Race[]> {
  constructor(private raceRepository: IRaceRepository) {}

  async handle(query: GetAllRacesQuery): Promise<Race[]> {
    return this.raceRepository.findAll();
  }
}

export class GetRaceByIdQuery {
  constructor(readonly id: string) {}
}

export class GetRaceByIdHandler implements IHandler<GetRaceByIdQuery, Race | null> {
  constructor(private raceRepository: IRaceRepository) {}

  async handle(query: GetRaceByIdQuery): Promise<Race | null> {
    return this.raceRepository.findById(query.id);
  }
}

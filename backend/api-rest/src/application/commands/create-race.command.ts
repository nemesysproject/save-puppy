import { IHandler } from '@/infrastructure/shared/mediator';
import { Race } from '@/domain/entities/race.entity';
import { IRaceRepository } from '@/domain/repositories/race.repository';

export class CreateRaceCommand {
  constructor(
    readonly name: string,
    readonly kindId: string
  ) {}
}

export class CreateRaceHandler implements IHandler<CreateRaceCommand, Race> {
  constructor(private raceRepository: IRaceRepository) {}

  async handle(command: CreateRaceCommand): Promise<Race> {
    return this.raceRepository.create({
      name: command.name,
      kindId: command.kindId,
    });
  }
}

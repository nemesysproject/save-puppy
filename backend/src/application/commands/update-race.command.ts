import { IHandler } from '@/infrastructure/shared/mediator';
import { Race } from '@/domain/entities/race.entity';
import { IRaceRepository } from '@/domain/repositories/race.repository';

export class UpdateRaceCommand {
  constructor(
    readonly id: string,
    readonly name?: string,
    readonly kindId?: string
  ) {}
}

export class UpdateRaceHandler implements IHandler<UpdateRaceCommand, Race> {
  constructor(private raceRepository: IRaceRepository) {}

  async handle(command: UpdateRaceCommand): Promise<Race> {
    const data: Partial<Race> = {};
    if (command.name) data.name = command.name;
    if (command.kindId) data.kindId = command.kindId;

    return this.raceRepository.update(command.id, data);
  }
}

import { IHandler } from '@/infrastructure/shared/mediator';
import { IRaceRepository } from '@/domain/repositories/race.repository';

export class DeleteRaceCommand {
  constructor(readonly id: string) {}
}

export class DeleteRaceHandler implements IHandler<DeleteRaceCommand, void> {
  constructor(private raceRepository: IRaceRepository) {}

  async handle(command: DeleteRaceCommand): Promise<void> {
    await this.raceRepository.delete(command.id);
  }
}

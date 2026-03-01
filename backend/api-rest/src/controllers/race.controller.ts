import { Request, Response } from 'express';
import { Mediator } from '../infrastructure/shared/mediator';
import { GetRacesByKindQuery } from '../application/queries/get-races-by-kind.query';
import { GetAllRacesQuery, GetRaceByIdQuery } from '../application/queries/get-all-races.query';
import { CreateRaceCommand } from '../application/commands/create-race.command';
import { UpdateRaceCommand } from '../application/commands/update-race.command';
import { DeleteRaceCommand } from '../application/commands/delete-race.command';

export class RaceController {
  constructor(private mediator: Mediator) {}

  async getAllRaces(req: Request, res: Response): Promise<void> {
    try {
      const races = await this.mediator.send(
        'GetAllRacesQuery',
        new GetAllRacesQuery()
      );
      res.status(200).json(races);
    } catch (error) {
      console.error('Error fetching all races:', error);
      res.status(500).json({ error: 'Failed to fetch races' });
    }
  }

  async getRaceById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const race = await this.mediator.send(
        'GetRaceByIdQuery',
        new GetRaceByIdQuery(id)
      );
      if (!race) {
        res.status(404).json({ error: 'Race not found' });
        return;
      }
      res.status(200).json(race);
    } catch (error) {
      console.error('Error fetching race by id:', error);
      res.status(500).json({ error: 'Failed to fetch race' });
    }
  }

  async getRacesByKind(req: Request, res: Response): Promise<void> {
    try {
      const { kindId } = req.params;
      const races = await this.mediator.send(
        'GetRacesByKindQuery',
        new GetRacesByKindQuery(kindId)
      );
      res.status(200).json(races);
    } catch (error) {
      console.error('Error fetching races by kind:', error);
      res.status(500).json({ error: 'Failed to fetch races' });
    }
  }

  async createRace(req: Request, res: Response): Promise<void> {
    try {
      const { name, kindId } = req.body;
      
      if (!name || !kindId) {
        res.status(400).json({ error: 'Missing required fields: name, kindId' });
        return;
      }

      const race = await this.mediator.send(
        'CreateRaceCommand',
        new CreateRaceCommand(name, kindId)
      );
      res.status(201).json(race);
    } catch (error) {
      console.error('Error creating race:', error);
      res.status(500).json({ error: 'Failed to create race' });
    }
  }

  async updateRace(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, kindId } = req.body;

      if (!name && !kindId) {
        res.status(400).json({ error: 'At least one field must be provided' });
        return;
      }

      const race = await this.mediator.send(
        'UpdateRaceCommand',
        new UpdateRaceCommand(id, name, kindId)
      );
      res.status(200).json(race);
    } catch (error) {
      console.error('Error updating race:', error);
      res.status(500).json({ error: 'Failed to update race' });
    }
  }

  async deleteRace(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.mediator.send('DeleteRaceCommand', new DeleteRaceCommand(id));
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting race:', error);
      res.status(500).json({ error: 'Failed to delete race' });
    }
  }
}

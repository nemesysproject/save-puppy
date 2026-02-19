import { Race } from '../entities/race.entity';

export interface IRaceRepository {
  create(race: Omit<Race, 'id' | 'createdAt' | 'updatedAt'>): Promise<Race>;
  findById(id: string): Promise<Race | null>;
  findByName(name: string, kindId: string): Promise<Race | null>;
  findByKindId(kindId: string): Promise<Race[]>;
  findAll(): Promise<Race[]>;
  update(id: string, data: Partial<Race>): Promise<Race>;
  delete(id: string): Promise<void>;
}

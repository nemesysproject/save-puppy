import { KindEntity } from '../entities/kind.entity';

export interface IKindRepository {
    findAll(): Promise<KindEntity[]>;
}

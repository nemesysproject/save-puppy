import { PetEntity } from '@/domain/entities/pet.entity';

export interface IPetRepository {
    create(pet: PetEntity): Promise<PetEntity>;
    update(id: string, pet: Partial<PetEntity>): Promise<PetEntity>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<PetEntity | null>;
    findAll(): Promise<PetEntity[]>;
}
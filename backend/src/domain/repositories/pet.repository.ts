import { PetEntity } from '@/domain/entities/pet.entity';

export interface IPetRepository {
    save(pet: PetEntity): Promise<void>;
    findById(id: string): Promise<PetEntity | null>;
}
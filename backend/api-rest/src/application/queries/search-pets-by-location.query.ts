import { IHandler } from '@/infrastructure/shared/mediator';
import { IPetRepository } from '@/domain/repositories/pet.repository';
// import { PetEntity } from '@/domain/entities/pet.entity';

export class SearchPetsByLocationQuery {
    constructor(
        public readonly kindId: string,
        public readonly latitude: number,
        public readonly longitude: number,
        public readonly radiusKm: number,
        public readonly raceId?: string
    ) { }
}

export class SearchPetsByLocationHandler implements IHandler<SearchPetsByLocationQuery, any[]> {
    constructor(private petRepository: IPetRepository) { }

    async handle(query: SearchPetsByLocationQuery): Promise<any[]> {
        // En una implementación real, calcularíamos geohashes o usaríamos PostGIS
        // Por ahora delegamos al repositorio la búsqueda por filtros básicos
        return await this.petRepository.findByLocation(
            query.kindId,
            query.latitude,
            query.longitude,
            query.radiusKm,
            query.raceId
        );
    }
}

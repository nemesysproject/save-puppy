export interface ShelterCreatedEvent {
    id: string;
    name: string;
    email: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    capacity?: number;
}

export interface PetCreatedEvent {
    id: string;
    name: string;
    status: string;
    kindId: string;
    genderId: string;
    shelterId?: string | null;
    ownerEmail?: string;
}

export interface MediaCreatedEvent {
    petId: string;
    url: string;
    type: string;
}

export interface ShelterDto {
    id: string;
    name: string;
    email: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    capacity?: number;
}

export interface CreateShelterDto {
    name: string;
    email: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    capacity?: number;
}

export interface UpdateShelterDto {
    name?: string;
    email?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    capacity?: number;
}

/**
 * Shelter Models
 */

export interface Shelter {
  id: string;
  name: string;
  email: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  capacity?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateShelterRequest {
  name: string;
  email: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  capacity?: number;
}

export interface UpdateShelterRequest {
  name?: string;
  email?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  capacity?: number;
}

export interface CreateShelterResponse {
  id: string;
  message: string;
  shelter?: Shelter;
}

export interface UpdateShelterResponse {
  message: string;
  shelter?: Shelter;
}

export interface DeleteShelterResponse {
  message: string;
}

export interface GetShelterResponse {
  shelter: Shelter;
}

export interface GetSheltersResponse {
  shelters: Shelter[];
  total?: number;
}

export interface ShelterWithPets extends Shelter {
  pets?: string[]; // Array of pet IDs
  petCount?: number;
}

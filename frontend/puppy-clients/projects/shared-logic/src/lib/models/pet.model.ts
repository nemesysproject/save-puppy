/**
 * Pet Models
 */

export interface Pet {
  id: string;
  name: string;
  status: string; // e.g., 'available', 'adopted', 'pending'
  kindId: string;
  genderId: string;
  shelterId?: string;
  ownerEmail?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreatePetRequest {
  name: string;
  status: string;
  kindId: string;
  genderId: string;
  shelterId?: string;
  ownerEmail?: string;
}

export interface UpdatePetRequest {
  name?: string;
  status?: string;
  kindId?: string;
  genderId?: string;
  shelterId?: string;
  ownerEmail?: string;
}

export interface CreatePetResponse {
  id: string;
  message: string;
  pet?: Pet;
}

export interface UpdatePetResponse {
  message: string;
  pet?: Pet;
}

export interface DeletePetResponse {
  message: string;
}

export interface GetPetResponse {
  pet: Pet;
}

export interface GetPetsResponse {
  pets: Pet[];
  total?: number;
}

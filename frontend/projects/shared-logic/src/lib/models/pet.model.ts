import { Kind, Gender, Race } from "./common.model";

/**
 * Pet Models
 */

export interface Pet {
	id: string;
	name: string;
	status: string; // LOST, ADOPTION, FOUND
	kindId: string;
	kind?: Kind;
	raceId?: string;
	race?: Race;
	genderId: string;
	gender?: Gender;
	shelterId?: string;
	ownerEmail?: string | null;
	ownerId?: string | null;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface CreatePetRequest {
	name: string;
	status: string;
	kindId: string;
	genderId: string;
	raceId?: string | null;
	shelterId?: string;
	ownerEmail?: string | null;
	ownerId?: string | null;
}

export interface UpdatePetRequest {
	name?: string;
	status?: string;
	kindId?: string;
	genderId?: string;
	raceId?: string | null;
	shelterId?: string;
	ownerEmail?: string | null;
	ownerId?: string | null;
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

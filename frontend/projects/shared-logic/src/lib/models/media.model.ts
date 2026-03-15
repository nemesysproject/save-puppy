/**
 * Media Models
 */

export interface Media {
	id: string;
	url: string;
	storageKey?: string;
	provider?: string; // e.g., 'cloudinary', 's3'
	type: string; // e.g., 'image/jpeg', 'video/mp4'
	latitude?: number;
	longitude?: number;
	geohash?: string;
	petId: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface CreateMediaRequest {
	file: File;
	petId: string;
	type?: string;
	latitude?: number;
	longitude?: number;
}

export interface CreateMediaResponse {
	id: string;
	message: string;
	media?: Media;
	url?: string;
}

export interface UpdateMediaRequest {
	latitude?: number;
	longitude?: number;
	type?: string;
}

export interface UpdateMediaResponse {
	message: string;
	media?: Media;
}

export interface DeleteMediaResponse {
	message: string;
}

export interface GetMediaByPetResponse {
	media: Media[];
	total?: number;
}

export interface GetMediaByLocationResponse {
	media: Media[];
	latitude: number;
	longitude: number;
	radius?: number;
	total?: number;
}

export interface MediaWithPetInfo extends Media {
	petName?: string;
	shelterId?: string;
}

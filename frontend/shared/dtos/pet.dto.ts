export interface PetDto {
    id: string;
    name: string;
    status: 'LOST' | 'ADOPTION' | 'FOUND';
    kindId: string;
    genderId: string;
    shelterId?: string;
    ownerEmail?: string;
}

export interface CreatePetDto {
    name: string;
    status: 'LOST' | 'ADOPTION' | 'FOUND';
    kindId: string;
    genderId: string;
    shelterId?: string;
    ownerEmail?: string;
}

export interface UpdatePetDto {
    name?: string;
    status?: 'LOST' | 'ADOPTION' | 'FOUND';
    kindId?: string;
    genderId?: string;
    shelterId?: string;
    ownerEmail?: string;
}

export interface MediaDto {
    id: string;
    url: string;
    type: string;
    petId: string;
}

export interface CreateMediaDto {
    image: File | Blob;
    petId: string;
}

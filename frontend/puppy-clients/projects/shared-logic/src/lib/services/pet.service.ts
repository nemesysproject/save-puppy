import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    Pet,
    CreatePetRequest,
    UpdatePetRequest,
    CreatePetResponse,
    UpdatePetResponse,
    DeletePetResponse
} from '../models/pet.model';

@Injectable({
    providedIn: 'root'
})
export class PetService {
    private http = inject(HttpClient);
    private readonly API_URL = 'http://localhost/api/pets'; // Should be from environment in real apps

    getPets(): Observable<Pet[]> {
        return this.http.get<Pet[]>(this.API_URL);
    }

    getPetById(id: string): Observable<Pet> {
        return this.http.get<Pet>(`${this.API_URL}/${id}`);
    }

    createPet(request: CreatePetRequest): Observable<CreatePetResponse> {
        return this.http.post<CreatePetResponse>(this.API_URL, request);
    }

    updatePet(id: string, request: UpdatePetRequest): Observable<UpdatePetResponse> {
        return this.http.put<UpdatePetResponse>(`${this.API_URL}/${id}`, request);
    }

    deletePet(id: string): Observable<DeletePetResponse> {
        return this.http.delete<DeletePetResponse>(`${this.API_URL}/${id}`);
    }
}

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    Shelter,
    CreateShelterRequest,
    UpdateShelterRequest,
    CreateShelterResponse,
    UpdateShelterResponse,
    DeleteShelterResponse
} from '../models/shelter.model';

@Injectable({
    providedIn: 'root'
})
export class ShelterService {
    private http = inject(HttpClient);
    private readonly API_URL = 'http://localhost/api/shelters';

    getShelters(): Observable<Shelter[]> {
        return this.http.get<Shelter[]>(this.API_URL);
    }

    getShelterById(id: string): Observable<Shelter> {
        return this.http.get<Shelter>(`${this.API_URL}/${id}`);
    }

    createShelter(request: CreateShelterRequest): Observable<CreateShelterResponse> {
        return this.http.post<CreateShelterResponse>(this.API_URL, request);
    }

    updateShelter(id: string, request: UpdateShelterRequest): Observable<UpdateShelterResponse> {
        return this.http.put<UpdateShelterResponse>(`${this.API_URL}/${id}`, request);
    }

    deleteShelter(id: string): Observable<DeleteShelterResponse> {
        return this.http.delete<DeleteShelterResponse>(`${this.API_URL}/${id}`);
    }
}

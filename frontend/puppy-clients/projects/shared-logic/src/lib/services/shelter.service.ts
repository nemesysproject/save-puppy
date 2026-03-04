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
import { API_BASE_URL } from './api.tokens';

@Injectable({
    providedIn: 'root'
})
export class ShelterService {
    private http = inject(HttpClient);
    private readonly baseUrl = inject(API_BASE_URL);
    private readonly apiUrl = `${this.baseUrl}/shelters`;

    getShelters(): Observable<Shelter[]> {
        return this.http.get<Shelter[]>(this.apiUrl);
    }

    getShelterById(id: string): Observable<Shelter> {
        return this.http.get<Shelter>(`${this.apiUrl}/${id}`);
    }

    createShelter(request: CreateShelterRequest): Observable<CreateShelterResponse> {
        return this.http.post<CreateShelterResponse>(this.apiUrl, request);
    }

    updateShelter(id: string, request: UpdateShelterRequest): Observable<UpdateShelterResponse> {
        return this.http.put<UpdateShelterResponse>(`${this.apiUrl}/${id}`, request);
    }

    deleteShelter(id: string): Observable<DeleteShelterResponse> {
        return this.http.delete<DeleteShelterResponse>(`${this.apiUrl}/${id}`);
    }
}

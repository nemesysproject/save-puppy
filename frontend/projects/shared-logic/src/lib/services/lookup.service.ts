import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Kind, Gender, Race } from '../models/common.model';
import { Shelter } from '../models/shelter.model';
import { API_BASE_URL } from './api.tokens';

@Injectable({
    providedIn: 'root'
})
export class LookupService {
    private http = inject(HttpClient);
    private readonly baseUrl = inject(API_BASE_URL);

    getKinds(): Observable<Kind[]> {
        return this.http.get<Kind[]>(`${this.baseUrl}/kinds`);
    }

    getGenders(): Observable<Gender[]> {
        return this.http.get<Gender[]>(`${this.baseUrl}/genders`);
    }

    getRaces(kindId: string): Observable<Race[]> {
        return this.http.get<Race[]>(`${this.baseUrl}/races/kind/${kindId}`);
    }

    getShelters(): Observable<Shelter[]> {
        return this.http.get<Shelter[]>(`${this.baseUrl}/shelters`);
    }
}

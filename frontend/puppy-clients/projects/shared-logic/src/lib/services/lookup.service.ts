import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Kind, Gender, Race } from '../models/common.model';
import { Shelter } from '../models/shelter.model';

@Injectable({
    providedIn: 'root'
})
export class LookupService {
    private http = inject(HttpClient);
    private readonly BASE_URL = 'http://localhost/api';

    getKinds(): Observable<Kind[]> {
        return this.http.get<Kind[]>(`${this.BASE_URL}/kinds`);
    }

    getGenders(): Observable<Gender[]> {
        return this.http.get<Gender[]>(`${this.BASE_URL}/genders`);
    }

    getRaces(kindId: string): Observable<Race[]> {
        return this.http.get<Race[]>(`${this.BASE_URL}/races/kind/${kindId}`);
    }

    getShelters(): Observable<Shelter[]> {
        return this.http.get<Shelter[]>(`${this.BASE_URL}/shelters`);
    }
}

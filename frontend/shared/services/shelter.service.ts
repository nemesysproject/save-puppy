import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';
import { ShelterDto, CreateShelterDto, UpdateShelterDto } from '@shared/dtos';

@Injectable({
    providedIn: 'root'
})
export class ShelterService extends BaseApiService {
    protected readonly endpoint = '/shelters';

    getAll(): Observable<ShelterDto[]> {
        return this.http.get<ShelterDto[]>(this.getFullUrl())
            .pipe(catchError(this.handleError));
    }

    getById(id: string): Observable<ShelterDto> {
        return this.http.get<ShelterDto>(this.getFullUrl(`/${id}`))
            .pipe(catchError(this.handleError));
    }

    create(shelter: CreateShelterDto): Observable<ShelterDto> {
        return this.http.post<ShelterDto>(this.getFullUrl(), shelter)
            .pipe(catchError(this.handleError));
    }

    update(id: string, shelter: UpdateShelterDto): Observable<ShelterDto> {
        return this.http.put<ShelterDto>(this.getFullUrl(`/${id}`), shelter)
            .pipe(catchError(this.handleError));
    }

    delete(id: string): Observable<any> {
        return this.http.delete<any>(this.getFullUrl(`/${id}`))
            .pipe(catchError(this.handleError));
    }
}

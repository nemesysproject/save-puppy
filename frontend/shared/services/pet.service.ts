import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';
import { PetDto, CreatePetDto, UpdatePetDto } from '@shared/dtos';

@Injectable({
    providedIn: 'root'
})
export class PetService extends BaseApiService {
    protected readonly endpoint = '/pets';

    getAll(): Observable<PetDto[]> {
        return this.http.get<PetDto[]>(this.getFullUrl())
            .pipe(catchError(this.handleError));
    }

    getById(id: string): Observable<PetDto> {
        return this.http.get<PetDto>(this.getFullUrl(`/${id}`))
            .pipe(catchError(this.handleError));
    }

    create(pet: CreatePetDto): Observable<PetDto> {
        return this.http.post<PetDto>(this.getFullUrl(), pet)
            .pipe(catchError(this.handleError));
    }

    update(id: string, pet: UpdatePetDto): Observable<PetDto> {
        return this.http.put<PetDto>(this.getFullUrl(`/${id}`), pet)
            .pipe(catchError(this.handleError));
    }

    delete(id: string): Observable<any> {
        return this.http.delete<any>(this.getFullUrl(`/${id}`))
            .pipe(catchError(this.handleError));
    }
}

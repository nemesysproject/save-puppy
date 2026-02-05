import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';
import { GenderDto } from '@shared/dtos';

@Injectable({
    providedIn: 'root'
})
export class GenderService extends BaseApiService {
    protected readonly endpoint = '/genders';

    getGenders(): Observable<GenderDto[]> {
        return this.http.get<GenderDto[]>(this.getFullUrl())
            .pipe(catchError(this.handleError));
    }
}
